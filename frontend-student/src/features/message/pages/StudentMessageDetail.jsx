import './StudentMessageDetail.css'

// G013 メッセージ詳細画面（studentMessageDetail）
// ※ 仮の画面。外部設計書 G013 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: D-2

// G013 メッセージ画面（studentMessageDetail）
// ※ 仮の画面。外部設計書 G013 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: 感謝メッセージの詳細取得（API一覧表の番号に合わせて書き換える）
// 置き場所: src/features/message/pages/StudentMessageDetail.jsx（App.jsx: /messages/:id）

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNav from '../../../components/BottomNav';
import './StudentMessageDetail.css';

// 送信者のアイコン（アイコン画像が決まるまでの仮。ニックネームの横に表示する）
function AvatarIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      <rect width="56" height="56" fill="#ffe4e6" />
      <circle cx="28" cy="22" r="10" fill="#fda4af" />
      <path d="M6 56 C6 44 16 38 28 38 C40 38 50 44 50 56 Z" fill="#fda4af" />
    </svg>
  );
}

// 写真がないとき／読み込めないときの表示
function ImagePlaceholder() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  );
}

export default function StudentMessageDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // /messages/:id のメッセージID
  const [imageFailed, setImageFailed] = useState(false);

  // 写真つきの仮データ（G012 の仮データのメッセージID 201 / 202 に対応）
  // TODO: API でメッセージを取得する（見つからないときの表示は仕様に記載なし）
  const dummyMessages = {
    201: {
      senderName: 'こなん',
      sentAt: '2026/10/13 13:00',
      body: '大事な眼鏡が無事に戻ってきました！\n見通しゼロの暗闇から救出してくれたのは、間違いなくキミの親切な投稿です！本当にありがとうございました！',
      item: {
        name: '眼鏡',
        place: '4号館',
        foundAt: '2026/10/12 18:00',
        feature: '',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=200&q=80',
      },
    },
    202: {
      senderName: 'ゆうき',
      sentAt: '2026/10/11 13:00',
      body: '英単語帳を拾ってくれてありがとうございました。\nテスト前だったので本当に助かりました！',
      item: {
        name: '英単語ターゲット1900',
        place: '図書館',
        foundAt: '2026/10/10 16:30',
        feature: '表紙に付箋がたくさん貼ってある',
        image: null,
      },
    },
  };
  const message = dummyMessages[id] ?? dummyMessages[201];
  const { item } = message;

  return (
    <div className="message-detail-page-wrapper">
      {/* 9:16比率のスマホ枠 */}
      <div className="message-detail-mobile-container">
        {/* ヘッダー */}
        <header className="message-detail-header">
          <button
            className="message-detail-back-btn"
            onClick={() => navigate(-1)} // 遷移元（G012 通知 / G032 メッセージ一覧）に戻る
            aria-label="戻る"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 className="message-detail-title">感謝メッセージ詳細</h1>
        </header>

        {/* 本文エリア */}
        <div className="message-detail-content">
          {/* 感謝メッセージ */}
          <section className="message-detail-card">
            <div className="message-detail-sender">
              <div className="message-detail-avatar">
                <AvatarIcon />
              </div>
              <div className="message-detail-sender-info">
                <p className="message-detail-sender-name">{message.senderName}</p>
                <p className="message-detail-sent-at">{message.sentAt}</p>
              </div>
            </div>
            <p className="message-detail-body">{message.body}</p>
          </section>

          {/* 対象の落とし物 */}
          <h2 className="message-detail-section-title">落とし物詳細</h2>
          <section className="message-detail-card message-detail-item-card">
            <div className="message-detail-item-img-wrapper">
              {item.image && !imageFailed ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="message-detail-item-img"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <ImagePlaceholder />
              )}
            </div>
            <div className="message-detail-item-info">
              <h3 className="message-detail-item-name">{item.name}</h3>
              <dl className="message-detail-item-list">
                <div className="message-detail-item-row">
                  <dt>発見場所</dt>
                  <dd>{item.place}</dd>
                </div>
                <div className="message-detail-item-row">
                  <dt>発見日時</dt>
                  <dd>{item.foundAt}</dd>
                </div>
                <div className="message-detail-item-row">
                  <dt>特徴</dt>
                  <dd>{item.feature || '特になし'}</dd>
                </div>
              </dl>
            </div>
          </section>
        </div>

        {/* ボトムナビゲーション（フッター） */}
        <BottomNav active="mypage" />
      </div>
    </div>
  );
}
