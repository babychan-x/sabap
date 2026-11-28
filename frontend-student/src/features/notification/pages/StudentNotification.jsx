// G012 通知画面（studentNotification）
// 主なAPI（仮）: C-1 通知一覧（getNotifications）・C-2 既読にする（markNotificationRead）。api/notifications.js
// 置き場所: src/features/notification/pages/StudentNotification.jsx（App.jsx: /notifications）
// 11/28: 画面の中の仮データをやめて、api/notifications.js から取る形にした（仮データは mock/notifications.js）

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentNotification.css';
import ScreenLayout from '../../../components/ScreenLayout';
import { getNotifications, markNotificationRead } from '../../../api/notifications';
import { formatDateTime } from '../../../utils/date';

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ※ G015 と G017 は同じ画面（2026/11/24 確定。StudentItemDetail、/items/:id）。G015 に行く通知も /items/:id へ。
// ---------------------------------------------------------------
const ROUTES = {
  home: '/home', // G011 投稿一覧
  post: '/post', // G021 落とし物投稿
  mypage: '/mypage', // G024 マイページ
  itemDetail: (postId) => `/items/${postId}`, // G015・G017 落とし物詳細
  approvalDetail: (applicationId) => `/applications/${applicationId}/approval`, // G014 承認詳細
  handedOverDetail: (applicationId) => `/mypage/applications/${applicationId}/handed-over`, // G034 受け渡し済み詳細
  message: (messageId) => `/messages/${messageId}`, // G013 メッセージ画面
};

// ---------------------------------------------------------------
// 通知の種類ごとの設定
//   icon : 'item' = 落とし物の写真 / 'envelope' = 封筒アイコン（メッセージ系）
//   text : 『落とし物名』のあとに続く通知文
//   to   : 押したときの遷移先（外部設計書 G012 イベント2の表どおり）。通知 n を受け取る
// 通知に持たせるID：postId（落とし物）/ applicationId（申請）/ messageId（メッセージ）（mock/notifications.js）
// ※ 画像にある文言以外（承認取消・期限切れ・解除・保管場所更新・処分済み）は仮の文言。
// ※ 「受け渡し完了」の遷移先 G034 は、外部設計書のイベント表に記載がないため要確認。
// ---------------------------------------------------------------
const NOTIFICATION_TYPES = {
  APPLY_APPROVED: {
    icon: 'item',
    text: 'が受け取り承認されました。',
    to: (n) => ROUTES.approvalDetail(n.applicationId), // G014
  },
  APPLY_REJECTED: {
    icon: 'item',
    text: 'が受け取り却下されました。',
    to: (n) => ROUTES.approvalDetail(n.applicationId), // G014
  },
  APPROVAL_CANCELLED: {
    icon: 'item',
    text: 'の受け取り承認が取り消されました。',
    to: (n) => ROUTES.itemDetail(n.postId), // G015（= G017 と同じ画面）
  },
  APPROVAL_EXPIRED: {
    icon: 'item',
    text: 'の受け取り承認が期限切れで取り消されました。',
    to: (n) => ROUTES.itemDetail(n.postId), // G015（= G017 と同じ画面）
  },
  HANDOVER_CANCELLED: {
    icon: 'item',
    text: 'の受け渡しが解除されました。',
    to: (n) => ROUTES.itemDetail(n.postId), // G015（= G017 と同じ画面）
  },
  STATUS_UPDATED: {
    icon: 'item',
    text: 'の保管場所が更新されました。',
    to: (n) => ROUTES.itemDetail(n.postId), // G017
  },
  DISPOSED: {
    icon: 'item',
    text: 'が処分済みになりました。',
    to: (n) => ROUTES.itemDetail(n.postId), // G017
  },
  HANDOVER_COMPLETED: {
    icon: 'envelope',
    text: 'の受け渡しが完了しました。感謝メッセージを送信しましょう。',
    to: (n) => ROUTES.handedOverDetail(n.applicationId), // G034
  },
  THANKS_RECEIVED: {
    icon: 'envelope',
    text: 'の受け取り主から、感謝メッセージを受信しました。',
    to: (n) => ROUTES.message(n.messageId), // G013
  },
};

// 封筒アイコン（メッセージ系の通知用）
function EnvelopeIcon() {
  return (
    <svg
      className="notification-envelope"
      width="56"
      height="56"
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <path
        d="M6 27 L32 6 L58 27 V54 a3 3 0 0 1 -3 3 H9 a3 3 0 0 1 -3 -3 Z"
        fill="#8b8b8b"
      />
      <rect x="16" y="14" width="32" height="26" rx="2" fill="#ffffff" />
      <path
        d="M22 22 H42 M22 28 H42 M22 34 H36"
        stroke="#8b8b8b"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M6 54 L28 36 H36 L58 54"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 写真がない落とし物のときに出す、画像アイコン（G027 の Thumbnail と同じ形）
function NoImageIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  );
}

export default function StudentNotification() {
  const navigate = useNavigate();

  // 通知の一覧（C-1。新着順）。loading = 読み込み中、error = 読み込めなかったときの文
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false; // 画面を離れたあとに届いた結果は使わない
    getNotifications()
      .then((list) => {
        if (!ignore) setNotifications(list);
      })
      .catch(() => {
        if (!ignore) setError('読み込めませんでした。時間をおいて、もう一度お試しください。');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // イベント2: 通知を選択したとき：既読にして（NEWマークを消して）、種類に応じた画面へ遷移する
  const handleSelect = (notification) => {
    if (!notification.isRead) {
      // 既読にする（C-2）。失敗しても、画面の移動は止めない（仮）
      markNotificationRead(notification.notificationId).catch(() => {});
      setNotifications((prev) =>
        prev.map((n) => (n.notificationId === notification.notificationId ? { ...n, isRead: true } : n))
      );
    }
    const config = NOTIFICATION_TYPES[notification.notificationType];
    navigate(config.to(notification));
  };

  return (
    <ScreenLayout
      title="通知"
      onBack={() => navigate(ROUTES.home)} // イベント1: 戻る → G011
      bottomNav="home"
    >
      {/* 通知リスト */}
      <div className="notification-list">
        {loading && <p className="notification-empty">読み込み中…</p>}

        {!loading && error && (
          <p className="notification-empty error" role="alert">{error}</p>
        )}

        {!loading && !error && notifications.length === 0 && (
          <p className="notification-empty">通知はありません</p>
        )}

        {!loading && !error && notifications.map((n) => {
          const config = NOTIFICATION_TYPES[n.notificationType];
          const itemName = n.post?.itemName ?? '';
          const imageUrl = n.post?.postImageUrls?.[0];
          return (
            <div
              key={n.notificationId}
              className="notification-item"
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(n)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSelect(n);
              }}
            >
              {/* 落とし物の写真 または 封筒アイコン（写真がない落とし物は、画像アイコン） */}
              <div className="notification-img-wrapper">
                {config.icon === 'envelope' ? (
                  <EnvelopeIcon />
                ) : imageUrl ? (
                  <img src={imageUrl} alt={itemName} className="notification-img" />
                ) : (
                  <NoImageIcon />
                )}
                {/* 未読の通知にだけNEWマークを表示 */}
                {!n.isRead && (
                  <span className="notification-new-badge">
                    <span>NEW</span>
                  </span>
                )}
              </div>

              <div className="notification-info">
                <p className="notification-text">
                  『{itemName}』{config.text}
                </p>
                <p className="notification-date">{formatDateTime(n.createdAt)}</p>
              </div>
            </div>
          );
        })}
      </div>

    </ScreenLayout>
  );
}
