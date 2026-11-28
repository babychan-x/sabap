import './StudentMyPostDetail.css'

// G028 投稿詳細画面（studentMyPostDetail）
// ※ 仮の画面。外部設計書 G028 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: G-2 自分の投稿の詳細（getMyPost）・G-4 投稿の削除（deleteMyPost）。api/myPosts.js。仮データは mock/myPosts.js
// 置き場所: src/features/mypage/pages/StudentMyPostDetail.jsx（App.jsx: /mypage/posts/:id）
// 削除の確認（D001）と完了（D002）のダイアログは、この画面の中で表示する。

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteMyPost, getMyPost } from '../../../api/myPosts';
import ScreenLayout from '../../../components/ScreenLayout';
import { formatDateTime } from '../../../utils/date';
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
  const [deleting, setDeleting] = useState(false); // 削除中は「確認」を二重に押せないようにする

  // 取得した投稿（どの ID の結果かも一緒に持つ。ID が変わったら「読み込み中」に戻る）
  // 項目名と DB の列の対応は mock/myPosts.js の先頭に書いてある
  const [result, setResult] = useState(null); // { postId, post, error }

  // 画面を開いたとき（ID が変わったとき）に、投稿を取得する
  useEffect(() => {
    let ignore = false; // 画面を離れたあとに届いた結果は使わない
    getMyPost(id)
      .then((post) => {
        if (!ignore) setResult({ postId: id, post, error: '' });
      })
      .catch((err) => {
        // 文言は設計書に記載なし（仮）
        const error = err.message === 'NOT_FOUND'
          ? '投稿が見つかりませんでした'
          : '読み込めませんでした。時間をおいて、もう一度お試しください。';
        if (!ignore) setResult({ postId: id, post: null, error });
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  const loading = result?.postId !== id;
  const post = loading ? null : result.post;

  // 読み込み中・見つからないときは、別の投稿を代わりに出さず、文言だけを表示する
  if (!post) {
    return (
      <ScreenLayout title="投稿の詳細" onBack={() => navigate(ROUTES.myPostList)} background="gray">
        <p className="my-post-detail-empty" role={loading ? undefined : 'alert'}>
          {loading ? '読み込み中…' : result.error}
        </p>
      </ScreenLayout>
    );
  }

  // 編集・削除ができる条件（要件定義書 4.1 より。要確認）
  //   編集：保管場所ステータスが「学生厚生未到着」のときだけ
  //   削除：「学生厚生未到着」で、受け取り申請がないときだけ
  const canEdit = post.itemStatus === 'NOT_ARRIVED';
  const canDelete = post.itemStatus === 'NOT_ARRIVED' && !post.hasApplication;

  // ボタンが使えない理由（仕様に文言の記載なし。仮）
  let notice = '';
  if (!canEdit) {
    notice = '学生厚生に到着済みのため、編集・削除はできません。';
  } else if (!canDelete) {
    notice = '受け取り申請があるため、削除はできません。';
  }

  const images = post.postImageUrls.length > 0 ? post.postImageUrls : [null];

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
  // 削除できなかったときの文言（設計書に記載なし。仮）
  const DELETE_ERRORS = {
    NOT_FOUND: 'この投稿はすでに削除されています',
    NOT_DELETABLE: 'この投稿は、到着済みか受け取り申請があるため削除できません',
  };
  const handleConfirmDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteMyPost(id);
      setDialog('complete');
    } catch (err) {
      setDeleteError(DELETE_ERRORS[err.message] ?? '削除できませんでした。時間をおいて、もう一度お試しください。');
    } finally {
      setDeleting(false);
    }
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

  // 削除の確認（D001）・完了（D002）ダイアログ（画面全体に重ねる。ScreenLayout の overlay に渡す）
  const dialogOverlay = dialog && (
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
                disabled={deleting}
              >
                戻る
              </button>
              <button
                className="my-post-detail-dialog-btn danger"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? '削除中…' : '確認'}
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
  );

  return (
    <ScreenLayout
      title="投稿の詳細"
      onBack={() => navigate(ROUTES.myPostList)}
      background="gray"
      contentClassName="my-post-detail-content"
      overlay={dialogOverlay}
    >
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
                    alt={`${post.itemName}の写真${index + 1}`}
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
          <h2 className="my-post-detail-item-name">{post.itemName}</h2>

          <dl className="my-post-detail-list">
            <div className="my-post-detail-row">
              <dt>カテゴリー</dt>
              <dd>{post.itemCategory}</dd>
            </div>
            <div className="my-post-detail-row">
              <dt>発見日時</dt>
              <dd>{formatDateTime(post.foundAt)}</dd>
            </div>
            <div className="my-post-detail-row">
              <dt>発見場所</dt>
              <dd>{post.foundLocation}</dd>
            </div>
            <div className="my-post-detail-row">
              <dt>保管場所</dt>
              <dd>{STORAGE_LABELS[post.itemStatus]}</dd>
            </div>
            <div className="my-post-detail-row">
              <dt>特徴</dt>
              <dd>{post.itemDescription || '特になし'}</dd>
            </div>
            <div className="my-post-detail-row">
              <dt>保管期限</dt>
              <dd>{formatDateTime(post.storageDeadline)} まで</dd>
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
    </ScreenLayout>
  );
}
