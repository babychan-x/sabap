import { Link } from 'react-router-dom'
import './BottomNav.css'

// 下タブ（ホーム・投稿・マイページ）。画面の一番下に固定して表示する。
// 見た目は G027（StudentMyPostList）の下タブと同じ（デザイン担当の画面に合わせた）。
// 使い方: <BottomNav active="home" />  （active: 'home' / 'post' / 'mypage'。選択中のタブが青くなる）
//
// ※ 下タブは画面の下に重なって表示されるので、使う画面では、スクロールする部分の下に
//   64px 以上の余白（padding-bottom）を空けておく（G027 は 88px）。
// ※ 親の要素（スマホ枠）に position: relative が必要（G025〜G029 の枠には付いている）。

// タブの中身（遷移先は App.jsx のルーティングと同じ）
const TABS = [
  {
    key: 'home',
    label: 'ホーム',
    to: '/home', // G011 投稿一覧
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    key: 'post',
    label: '投稿',
    to: '/post', // G021 落とし物投稿
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="3"></circle>
      </svg>
    ),
  },
  {
    key: 'mypage',
    label: 'マイページ',
    to: '/mypage', // G024 マイページ
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
]

export default function BottomNav({ active }) {
  return (
    <nav className="bottom-nav" aria-label="メインメニュー">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          to={tab.to}
          className={`bottom-nav-item ${tab.key === active ? 'active' : ''}`}
          aria-current={tab.key === active ? 'page' : undefined}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </Link>
      ))}
    </nav>
  )
}
