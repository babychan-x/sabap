import './StudentNotification.css'

// G012 通知画面（studentNotification）
// ※ 仮の画面。外部設計書 G012 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: C-1, C-2

// G012 通知画面（studentNotification）
// ※ 仮の画面。外部設計書 G012 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: 通知一覧の取得・既読の更新（API一覧表の番号に合わせて書き換える）

// G012 通知画面（studentNotification）
// ※ 仮の画面。外部設計書 G012 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: 通知一覧の取得・既読の更新（API一覧表の番号に合わせて書き換える）

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../../components/BottomNav';
import './StudentNotification.css';

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ※ G015（申請結果詳細）は App.jsx にルートがない（設計書の確認が済むまで作らない）。
//   G015 に行く通知は、いったん G017（落とし物詳細）へ遷移させている。
//   G015 のルートができたら、下の NOTIFICATION_TYPES の該当部分を書き換える。
// ---------------------------------------------------------------
const ROUTES = {
  home: '/home', // G011 投稿一覧
  post: '/post', // G021 落とし物投稿
  mypage: '/mypage', // G024 マイページ
  itemDetail: (itemId) => `/items/${itemId}`, // G017 落とし物詳細
  approvalDetail: (applicationId) => `/applications/${applicationId}/approval`, // G014 承認詳細
  handedOverDetail: (applicationId) => `/mypage/applications/${applicationId}/handed-over`, // G034 受け渡し済み詳細
  message: (messageId) => `/messages/${messageId}`, // G013 メッセージ画面
};

// ---------------------------------------------------------------
// 通知の種類ごとの設定
//   icon : 'item' = 落とし物の写真 / 'envelope' = 封筒アイコン（メッセージ系）
//   text : 『落とし物名』のあとに続く通知文
//   to   : 押したときの遷移先（外部設計書 G012 イベント2の表どおり）。通知 n を受け取る
// 通知に持たせるID：itemId（落とし物）/ applicationId（申請）/ messageId（メッセージ）
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
    to: (n) => ROUTES.itemDetail(n.itemId), // 本来は G015（ルート未作成のため G017 で代用）
  },
  APPROVAL_EXPIRED: {
    icon: 'item',
    text: 'の受け取り承認が期限切れで取り消されました。',
    to: (n) => ROUTES.itemDetail(n.itemId), // 本来は G015（ルート未作成のため G017 で代用）
  },
  HANDOVER_CANCELLED: {
    icon: 'item',
    text: 'の受け渡しが解除されました。',
    to: (n) => ROUTES.itemDetail(n.itemId), // 本来は G015（ルート未作成のため G017 で代用）
  },
  STATUS_UPDATED: {
    icon: 'item',
    text: 'の保管場所が更新されました。',
    to: (n) => ROUTES.itemDetail(n.itemId), // G017
  },
  DISPOSED: {
    icon: 'item',
    text: 'が処分済みになりました。',
    to: (n) => ROUTES.itemDetail(n.itemId), // G017
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

export default function StudentNotification() {
  const navigate = useNavigate();

  // 写真つきの仮データ（新着順）
  // itemId / applicationId / messageId : 遷移先の画面に渡すID（種類ごとに必要なものだけ入れる）
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'APPLY_APPROVED',
      itemName: '黒い折り畳み財布',
      date: '2026/10/13 16:00',
      isRead: false,
      itemId: 1,
      applicationId: 101,
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 2,
      type: 'APPLY_REJECTED',
      itemName: 'iPhone(白)',
      date: '2026/10/13 15:00',
      isRead: false,
      itemId: 2,
      applicationId: 102,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 3,
      type: 'HANDOVER_COMPLETED',
      itemName: 'ピンクポーチ',
      date: '2026/10/13 14:00',
      isRead: false,
      itemId: 4,
      applicationId: 103,
      image: null,
    },
    {
      id: 4,
      type: 'APPLY_APPROVED',
      itemName: 'ピンクポーチ',
      date: '2026/10/13 13:00',
      isRead: true,
      itemId: 4,
      applicationId: 103,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 5,
      type: 'THANKS_RECEIVED',
      itemName: '眼鏡',
      date: '2026/10/12 13:00',
      isRead: true,
      messageId: 201,
      image: null,
    },
    {
      id: 6,
      type: 'THANKS_RECEIVED',
      itemName: '英単語ターゲット1900',
      date: '2026/10/11 13:00',
      isRead: true,
      messageId: 202,
      image: null,
    },
  ]);

  // 通知を選択したとき：既読にして（NEWマークを消して）、種類に応じた画面へ遷移する
  const handleSelect = (notification) => {
    // TODO: API（既読にする）を呼ぶ
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );
    const config = NOTIFICATION_TYPES[notification.type];
    navigate(config.to(notification));
  };

  return (
    <div className="notification-page-wrapper">
      {/* 9:16比率のスマホ枠 */}
      <div className="notification-mobile-container">
        {/* ヘッダー */}
        <header className="notification-header">
          <button
            className="notification-back-btn"
            onClick={() => navigate(ROUTES.home)}
            aria-label="戻る"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 className="notification-title">通知</h1>
        </header>

        {/* 通知リスト */}
        <div className="notification-list">
          {notifications.length === 0 && (
            <p className="notification-empty">通知はありません</p>
          )}

          {notifications.map((n) => {
            const config = NOTIFICATION_TYPES[n.type];
            return (
              <div
                key={n.id}
                className="notification-item"
                role="button"
                tabIndex={0}
                onClick={() => handleSelect(n)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSelect(n);
                }}
              >
                {/* 落とし物の写真 または 封筒アイコン */}
                <div className="notification-img-wrapper">
                  {config.icon === 'envelope' ? (
                    <EnvelopeIcon />
                  ) : (
                    <img src={n.image} alt={n.itemName} className="notification-img" />
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
                    『{n.itemName}』{config.text}
                  </p>
                  <p className="notification-date">{n.date}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ボトムナビゲーション（フッター） */}
        <BottomNav active="home" />
      </div>
    </div>
  );
}