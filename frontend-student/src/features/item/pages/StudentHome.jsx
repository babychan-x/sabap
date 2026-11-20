import { useParams } from 'react-router-dom'

// G011 投稿一覧（ホーム）画面（studentHome）
// ※ 仮の画面。外部設計書 G011 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: B-1

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StudentHome.css';

export default function StudentHome() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('すべて');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 写真つきの仮データ
  const dummyItems = [
    {
      id: 1,
      title: '黒い折り畳み財布',
      date: '2026/10/13 16:00',
      location: '1号館',
      status: '学生厚生到着済',
      statusType: 'success',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=200&q=80',
    },
    {
      title: 'iPhone(白)',
      date: '2026/10/13 15:00',
      location: '2号館',
      status: '教員預かり',
      statusType: 'info',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 3,
      title: '青の水筒',
      date: '2026/10/13 14:00',
      location: '体育館',
      status: '学生厚生到着済',
      statusType: 'success',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 4,
      title: 'ピンクポーチ',
      date: '2026/10/13 13:00',
      location: '食堂',
      status: '学生厚生到着済',
      statusType: 'success',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 5,
      title: 'マフラー',
      date: '2026/10/12 20:00',
      location: 'S号館',
      status: '学生厚生到着済',
      statusType: 'success',
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const categories = ['すべて', '財布', 'スマホ', '傘', 'その他'];

  return (
    <div className="home-page-wrapper">
      {/* 9:16比率のスマホ枠 */}
      <div className="home-mobile-container">
        {/* ヘッダー */}
        <header className="home-header">
          <div className="home-title-wrapper">
            <span className="home-title-badge">TDU</span>
            <h1 className="home-app-title">落とし物投稿システム</h1>
          </div>
          <button
            className="home-notification-btn"
            onClick={() => navigate('/notifications')}
            aria-label="通知"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="home-notification-badge">3</span>
          </button>
        </header>

        {/* 検索バー */}
        <div className="home-search-section">
          <div className="home-search-bar">
            <svg className="home-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8c8c8c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="キーワードで検索(例:財布、黒、図書館)"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
                }
              }}
            />
          </div>
        </div>

        {/* カテゴリ選択（プルダウン式に変更） */}
        <div className="home-category-section">
          <div className="home-select-wrapper">
            <select
              className="home-category-select"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  カテゴリ: {cat}
                </option>
              ))}
            </select>
            <span className="home-select-arrow">▼</span>
          </div>
        </div>

        {/* 落とし物リスト */}
        <div className="home-item-list">
          {dummyItems.map((item) => (
            <div
              key={item.id}
              className="home-item-card"
              onClick={() => navigate(`/items/${item.id}`)}
            >
              <img src={item.image} alt={item.title} className="home-item-img" />
              <div className="home-item-info">
                <h2 className="home-item-name">{item.title}</h2>
                <p className="home-item-date">{item.date}</p>
                <p className="home-item-location">{item.location}</p>
              </div>
              <div className="home-item-status-wrapper">
                <span className={`home-status-badge ${item.statusType}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ボトムナビゲーション（フッター） */}
        <nav className="home-bottom-nav">
          <Link to="/home" className="home-nav-item active">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span>ホーム</span>
          </Link>
          <Link to="/post" className="home-nav-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="3"></circle>
            </svg>
            <span>投稿</span>
          </Link>
          <Link to="/mypage" className="home-nav-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span>マイページ</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}