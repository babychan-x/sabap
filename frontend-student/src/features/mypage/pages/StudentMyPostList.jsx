import './StudentMyPostList.css'

// G027 自分の投稿一覧画面（studentMyPostList）
// ※ 仮の画面。外部設計書 G027 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: 自分が投稿した落とし物の一覧取得（API一覧表の番号に合わせて書き換える）
// 置き場所: src/features/mypage/pages/StudentMyPostList.jsx（App.jsx: /mypage/posts）

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../../components/BottomNav';
import './StudentMyPostList.css';

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  home: '/home', // G011 投稿一覧
  post: '/post', // G021 落とし物投稿
  mypage: '/mypage', // G024 マイページ
  myPostDetail: (postId) => `/mypage/posts/${postId}`, // G028 自分の投稿の詳細
};

// 写真つきのサムネイル（写真がないとき／読み込めないときは、灰色の枠にアイコンを表示）
function Thumbnail({ src, alt }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="my-post-list-img-wrapper">
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          className="my-post-list-img"
          onError={() => setFailed(true)}
        />
      ) : (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      )}
    </div>
  );
}

export default function StudentMyPostList() {
  const navigate = useNavigate();

  // 写真つきの仮データ（画像の並びのまま。日時の意味（発見日時／投稿日時）は設計書で要確認）
  // image が null のものは、写真のURLを入れると表示される。
  const dummyPosts = [
    {
      id: 1,
      title: '眼鏡',
      date: '2026/10/12 18:00',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=200&q=80',
    },
    { id: 2, title: 'ボールペン三本', date: '2026/10/12 15:00', image: null },
    { id: 3, title: '折りたたみ傘(白)', date: '2026/09/12 13:00', image: null },
    { id: 4, title: '水筒ボトル(透明)', date: '2026/06/12 13:00', image: null },
    { id: 5, title: 'キーホルダーと鍵', date: '2026/03/11 13:00', image: null },
    { id: 6, title: '充電ケーブル', date: '2026/06/12 13:00', image: null },
  ];

  return (
    <div className="my-post-list-page-wrapper">
      {/* 9:16比率のスマホ枠 */}
      <div className="my-post-list-mobile-container">
        {/* ヘッダー */}
        <header className="my-post-list-header">
          <button
            className="my-post-list-back-btn"
            onClick={() => navigate(ROUTES.mypage)}
            aria-label="戻る"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 className="my-post-list-title">自分の投稿一覧</h1>
        </header>

        {/* 投稿リスト */}
        <div className="my-post-list">
          {dummyPosts.length === 0 && (
            <p className="my-post-list-empty">投稿した落とし物はありません</p>
          )}

          {dummyPosts.map((post) => (
            <div
              key={post.id}
              className="my-post-list-item"
              role="button"
              tabIndex={0}
              onClick={() => navigate(ROUTES.myPostDetail(post.id))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(ROUTES.myPostDetail(post.id));
              }}
            >
              <Thumbnail src={post.image} alt={post.title} />
              <div className="my-post-list-info">
                <h2 className="my-post-list-name">{post.title}</h2>
                <p className="my-post-list-date">{post.date}</p>
              </div>
              <svg className="my-post-list-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 6 15 12 9 18"></polyline>
              </svg>
            </div>
          ))}
        </div>

        {/* ボトムナビゲーション（フッター） */}
        <BottomNav active="mypage" />
      </div>
    </div>
  );
}