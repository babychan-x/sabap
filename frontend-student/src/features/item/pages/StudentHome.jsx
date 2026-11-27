// G011 投稿一覧（ホーム）画面（studentHome）
// ※ 仮の画面。外部設計書 G011 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: B-1

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItems } from '../../../api/items';
import { formatDateTime } from '../../../utils/date';
import { STORAGE_STATUS_LABELS } from '../../../utils/labels';
import BottomNav from '../../../components/BottomNav';
import './StudentHome.css';

// 保管場所ステータス → バッジの色のクラス
const STATUS_TYPES = {
  NOT_ARRIVED: 'warn',
  ARRIVED: 'success',
  RETURNED: 'closed',
  DISPOSED: 'closed',
};

export default function StudentHome() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('すべて');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 落とし物の一覧（仮データは src/mock/items.js。G016・G017 と同じデータを使う。
  // 以前はこの画面の中に別の仮データがあり、詳細画面（G017）と ID がずれて、押したものと違う詳細が開いていた）
  const [items, setItems] = useState([]);
  useEffect(() => {
    let ignore = false;
    getItems()
      .then((list) => {
        if (!ignore) setItems(list);
      })
      .catch(() => {
        // 読み込み失敗時の表示は設計書に記載なし（仮。いまは何も表示しない）
      });
    return () => {
      ignore = true;
    };
  }, []);

  const categories = ['すべて', 'かばん・小物入れ', '衣類', '装飾品', '文具・書籍','電子機器','生活用品','貴重品','その他'];

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
          {items.map((item) => (
            <div
              key={item.postId}
              className="home-item-card"
              onClick={() => navigate(`/items/${item.postId}`)}
            >
              {/* 写真がないときは、同じ大きさの灰色の枠だけ出す */}
              {item.postImageUrls[0] ? (
                <img src={item.postImageUrls[0]} alt={item.itemName} className="home-item-img" />
              ) : (
                <div className="home-item-img" aria-hidden="true" />
              )}
              <div className="home-item-info">
                <h2 className="home-item-name">{item.itemName}</h2>
                <p className="home-item-date">{formatDateTime(item.foundAt)}</p>
                <p className="home-item-location">{item.foundLocation}</p>
              </div>
              <div className="home-item-status-wrapper">
                <span className={`home-status-badge ${STATUS_TYPES[item.itemStatus]}`}>
                  {STORAGE_STATUS_LABELS[item.itemStatus]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ボトムナビゲーション（フッター） */}
        <BottomNav active="home" />
      </div>
    </div>
  );
}