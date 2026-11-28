import './StudentMyPostList.css'

// G027 自分の投稿一覧画面（studentMyPostList）
// ※ 仮の画面。外部設計書 G027 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: G-1 自分の投稿一覧（api/myPosts.js の getMyPosts。仮データは mock/myPosts.js）
// 置き場所: src/features/mypage/pages/StudentMyPostList.jsx（App.jsx: /mypage/posts）

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyPosts } from '../../../api/myPosts';
import { formatDateTime } from '../../../utils/date';
import './StudentMyPostList.css';
import ScreenLayout from '../../../components/ScreenLayout';

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

  // 自分の投稿の一覧（null = 読み込み中）。仮データは mock/myPosts.js（G028・G029 と同じデータ）
  const [myPosts, setMyPosts] = useState(null);
  const [loadError, setLoadError] = useState('');

  // 画面を開いたときに、一覧を取得する
  useEffect(() => {
    let ignore = false; // 画面を離れたあとに届いた結果は使わない
    getMyPosts()
      .then((posts) => {
        if (!ignore) setMyPosts(posts);
      })
      .catch(() => {
        // 文言は設計書に記載なし（仮）
        if (!ignore) setLoadError('読み込めませんでした。時間をおいて、もう一度お試しください。');
      });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <ScreenLayout
      title="自分の投稿一覧"
      onBack={() => navigate(ROUTES.mypage)}
      bottomNav="mypage"
    >
      {/* 投稿リスト */}
      <div className="my-post-list">
        {loadError && (
          <p className="my-post-list-empty" role="alert">{loadError}</p>
        )}
        {!loadError && myPosts === null && (
          <p className="my-post-list-empty">読み込み中…</p>
        )}
        {myPosts?.length === 0 && (
          <p className="my-post-list-empty">投稿した落とし物はありません</p>
        )}

        {myPosts?.map((post) => (
          <div
            key={post.postId}
            className="my-post-list-item"
            role="button"
            tabIndex={0}
            onClick={() => navigate(ROUTES.myPostDetail(post.postId))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate(ROUTES.myPostDetail(post.postId));
            }}
          >
            {/* 写真は1枚目をサムネイルにする */}
            <Thumbnail src={post.postImageUrls[0] ?? null} alt={post.itemName} />
            <div className="my-post-list-info">
              <h2 className="my-post-list-name">{post.itemName}</h2>
              {/* 投稿日時（設計書 G027 入出力項目4: 投稿が登録された日時） */}
              <p className="my-post-list-date">{formatDateTime(post.postedAt)}</p>
            </div>
            <svg className="my-post-list-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 6 15 12 9 18"></polyline>
            </svg>
          </div>
        ))}
      </div>

    </ScreenLayout>
  );
}