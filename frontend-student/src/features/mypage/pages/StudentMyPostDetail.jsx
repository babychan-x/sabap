import './StudentMyPostDetail.css'

// G028 投稿詳細画面（studentMyPostDetail）
// ※ 仮の画面。外部設計書 G028 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: 自分の投稿の詳細取得・投稿の削除（API一覧表の番号に合わせて書き換える）
// 置き場所: src/features/mypage/pages/StudentMyPostDetail.jsx（App.jsx: /mypage/posts/:id）
// 削除の確認（D001）と完了（D002）のダイアログは、この画面の中で表示する。

import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './StudentMyPostDetail.css';

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  myPostList: '/mypage/posts', // G027 自分の投稿一覧
  myPostEdit: (postId) => `/mypage/posts/${postId}/edit`, // G029 投稿編集
};

// 保管場所ステータスの表示名
const STORAGE_LABELS = {
  NOT_ARRIVED: '学生厚生未到着',
  ARRIVED: '学生厚生到着済み',
  RETURNED: '受け渡し済み',
  DISPOSED: '処分済み',
};

// 写真がないとき／読み込めないときの表示
function ImagePlaceholder() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  );
}

export default function StudentMyPostDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // /mypage/posts/:id の投稿ID
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState([]); // 読み込みに失敗した写真の番号
  const [dialog, setDialog] = useState(null); // null / 'confirm'（D001）/ 'complete'（D002）
  const [deleteError, setDeleteError] = useState('');

  // 写真つきの仮データ（G027 の仮データの投稿ID 1〜6 に対応）
  // status        : 保管場所ステータス
  // hasApplication: 受け取り申請があるか
  // images が空のものは、写真のURLを入れると表示される。
  // TODO: API で投稿を取得する（見つからないときの表示は仕様に記載なし）
  const glassesImage = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80';
  const dummyPosts = {
    1: {
      title: '眼鏡',
      category: 'メガネ',
      foundAt: '2026/10/12 18:00',
      place: '4号館',
      status: 'NOT_ARRIVED',
      hasApplication: true,
      feature: '',
      deadline: '2027/10/12 23:59',
      images: [glassesImage, glassesImage, glassesImage],
    },
    2: {
      title: 'ボールペン三本',
      category: 'その他',
      foundAt: '2026/10/12 15:00',
      place: '2号館',
      status: 'NOT_ARRIVED',
      hasApplication: false,
      feature: 'ピンク・水色・黄色のペンが1本ずつ',
      deadline: '2027/10/12 23:59',
      images: [],
    },
    3: {
      title: '折りたたみ傘(白)',
      category: '傘',
      foundAt: '2026/09/12 13:00',
      place: '体育館',
      status: 'ARRIVED',
      hasApplication: false,
      feature: '',
      deadline: '2027/09/12 23:59',
      images: [],
    },
    4: {
      title: '水筒ボトル(透明)',
      category: 'その他',
      foundAt: '2026/06/12 13:00',
      place: '体育館',
      status: 'RETURNED',
      hasApplication: true,
      feature: '蓋にコルクが付いている',
      deadline: '2027/06/12 23:59',
      images: [],
    },
    5: {
      title: 'キーホルダーと鍵',
      category: 'その他',
      foundAt: '2026/03/11 13:00',
      place: '1号館',
      status: 'ARRIVED',
      hasApplication: true,
      feature: 'クマのキーホルダーと鍵2本',
      deadline: '2027/03/11 23:59',
      images: [],
    },
    6: {
      title: '充電ケーブル',
      category: 'その他',
      foundAt: '2026/06/12 13:00',
      place: '食堂',
      status: 'NOT_ARRIVED',
      hasApplication: false,
      feature: 'ケーブルは白色',
      deadline: '2027/06/12 23:59',
      images: [],
    },
  };
  const post = dummyPosts[id];

  // 仮データにないIDのときは、別の投稿を代わりに出さず「見つかりません」を表示する
  if (!post) {
    return (
      <div className="my-post-detail-page-wrapper">
        <div className="my-post-detail-mobile-container">
          <header className="my-post-detail-header">
            <button
              className="my-post-detail-back-btn"
              onClick={() => navigate(ROUTES.myPostList)}
              aria-label="戻る"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <h1 className="my-post-detail-title">投稿の詳細</h1>
          </header>
          <p className="my-post-detail-empty">投稿が見つかりませんでした</p>
        </div>
      </div>
    );
  }

  // 編集・削除ができる条件（要件定義書 4.1 より。要確認）
  //   編集：保管場所ステータスが「学生厚生未到着」のときだけ
  //   削除：「学生厚生未到着」で、受け取り申請がないときだけ
  const canEdit = post.status === 'NOT_ARRIVED';
  const canDelete = post.status === 'NOT_ARRIVED' && !post.hasApplication;

  // ボタンが使えない理由（仕様に文言の記載なし。仮）
  let notice = '';
  if (!canEdit) {
    notice = '学生厚生に到着済みのため、編集・削除はできません。';
  } else if (!canDelete) {
    notice = '受け取り申請があるため、削除はできません。';
  }

  const images = post.images.length > 0 ? post.images : [null];

  // 写真をスワイプしたとき、何枚目かを調べて「●○○」の点を切り替える
  const handleScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    setActiveIndex(Math.round(slider.scrollLeft / slider.clientWidth));
  };

  // 点を押したとき、その写真まで動かす
  const handleDotClick = (index) => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollTo({ left: index * slider.clientWidth, behavior: 'smooth' });
  };

  // 「削除する」を押したとき：削除確認ダイアログ（D001）を表示する
  const handleDelete = () => {
    setDeleteError('');
    setDialog('confirm');
  };

  // D001「確認」：投稿を削除して、削除完了ダイアログ（D002）を表示する
  const handleConfirmDelete = () => {
    // TODO: API（投稿の削除）を呼ぶ
    //   すでに削除されているときは、次のようにエラーを出して、削除しない
    //   setDeleteError('この投稿はすでに削除されています');
    //   return;
    setDialog('complete');
  };

  // D001「戻る」：ダイアログを閉じて、自分の投稿一覧に戻る（設計書どおり。投稿は削除しない）
  const handleCancelDelete = () => {
    setDialog(null);
    navigate(ROUTES.myPostList);
  };

  // D002「一覧に戻る」：ダイアログを閉じて、自分の投稿一覧に移る
  const handleBackToList = () => {
    setDialog(null);
    navigate(ROUTES.myPostList);
  };

  return (
    <div className="my-post-detail-page-wrapper">
      {/* 9:16比率のスマホ枠 */}
      <div className="my-post-detail-mobile-container">
        {/* ヘッダー */}
        <header className="my-post-detail-header">
          <button
            className="my-post-detail-back-btn"
            onClick={() => navigate(ROUTES.myPostList)}
            aria-label="戻る"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 className="my-post-detail-title">投稿の詳細</h1>
        </header>

        {/* 本文エリア */}
        <div className="my-post-detail-content">
          <section className="my-post-detail-card">
            {/* 写真（スワイプで切り替え） */}
            <div className="my-post-detail-photo-area">
              <div
                className="my-post-detail-slider"
                ref={sliderRef}
                onScroll={handleScroll}
              >
                {images.map((src, index) => (
                  <div className="my-post-detail-slide" key={index}>
                    {src && !failedImages.includes(index) ? (
                      <img
                        src={src}
                        alt={`${post.title}の写真${index + 1}`}
                        className="my-post-detail-img"
                        onError={() => setFailedImages((prev) => [...prev, index])}
                      />
                    ) : (
                      <ImagePlaceholder />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 写真が2枚以上のときだけ点を表示 */}
            {images.length > 1 && (
              <div className="my-post-detail-dots">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`my-post-detail-dot ${index === activeIndex ? 'active' : ''}`}
                    onClick={() => handleDotClick(index)}
                    aria-label={`${index + 1}枚目の写真を表示`}
                  />
                ))}
              </div>
            )}

            <div className="my-post-detail-body">
              <h2 className="my-post-detail-item-name">{post.title}</h2>

              <dl className="my-post-detail-list">
                <div className="my-post-detail-row">
                  <dt>カテゴリー</dt>
                  <dd>{post.category}</dd>
                </div>
                <div className="my-post-detail-row">
                  <dt>発見日時</dt>
                  <dd>{post.foundAt}</dd>
                </div>
                <div className="my-post-detail-row">
                  <dt>発見場所</dt>
                  <dd>{post.place}</dd>
                </div>
                <div className="my-post-detail-row">
                  <dt>保管場所</dt>
                  <dd>{STORAGE_LABELS[post.status]}</dd>
                </div>
                <div className="my-post-detail-row">
                  <dt>特徴</dt>
                  <dd>{post.feature || '特になし'}</dd>
                </div>
                <div className="my-post-detail-row">
                  <dt>保管期限</dt>
                  <dd>{post.deadline} まで</dd>
                </div>
              </dl>
            </div>
          </section>

          {/* 編集・削除ボタン（使えないときは灰色にして、理由を下に表示） */}
          <div className="my-post-detail-actions">
            <button
              className="my-post-detail-btn edit"
              disabled={!canEdit}
              onClick={() => navigate(ROUTES.myPostEdit(id))}
            >
              編集する
            </button>
            <button
              className="my-post-detail-btn delete"
              disabled={!canDelete}
              onClick={handleDelete}
            >
              削除する
            </button>
          </div>
          {notice && <p className="my-post-detail-notice">{notice}</p>}
        </div>

        {/* 削除の確認（D001）・完了（D002）ダイアログ */}
        {dialog && (
          <div
            className="my-post-detail-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="my-post-detail-dialog-message"
          >
            <div className="my-post-detail-dialog">
              {dialog === 'confirm' ? (
                <>
                  <p id="my-post-detail-dialog-message" className="my-post-detail-dialog-message">
                    投稿を削除しますか？
                  </p>
                  {deleteError && (
                    <p className="my-post-detail-dialog-error" role="alert">
                      {deleteError}
                    </p>
                  )}
                  <div className="my-post-detail-dialog-actions">
                    <button
                      className="my-post-detail-dialog-btn secondary"
                      onClick={handleCancelDelete}
                    >
                      戻る
                    </button>
                    <button
                      className="my-post-detail-dialog-btn danger"
                      onClick={handleConfirmDelete}
                    >
                      確認
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p id="my-post-detail-dialog-message" className="my-post-detail-dialog-message">
                    投稿の削除が完了しました
                  </p>
                  <div className="my-post-detail-dialog-actions">
                    <button
                      className="my-post-detail-dialog-btn primary"
                      onClick={handleBackToList}
                    >
                      一覧に戻る
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
