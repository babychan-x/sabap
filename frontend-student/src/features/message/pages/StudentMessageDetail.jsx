import './StudentMessageDetail.css'

// G013 メッセージ詳細画面（studentMessageDetail）
// ※ 仮の画面。外部設計書 G013 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: D-2 メッセージ詳細（api/messages.js の getMessage。仮データは mock/messages.js と mock/myPosts.js）

// G013 メッセージ画面（studentMessageDetail）
// ※ 仮の画面。外部設計書 G013 の入出力項目・イベントに合わせて中身を作る。
// 置き場所: src/features/message/pages/StudentMessageDetail.jsx（App.jsx: /messages/:id）

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMessage } from '../../../api/messages';
import BottomNav from '../../../components/BottomNav';
import { formatDateTime } from '../../../utils/date';
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

  // 取得したメッセージ（どの ID の結果かも一緒に持つ。ID が変わったら「読み込み中」に戻る）
  //   message: senderNickname・messageBody・sentAt など。message.post: 対象の落とし物（itemName など）
  //   項目名と DB の列の対応は mock/messages.js・mock/myPosts.js の先頭に書いてある
  // ※ 前は、仮データに無い ID のときに 201 の内容を出していた。いまは「見つかりません」を出す
  const [result, setResult] = useState(null); // { messageId, message, error }

  // 画面を開いたとき（ID が変わったとき）に、メッセージを取得する
  useEffect(() => {
    let ignore = false; // 画面を離れたあとに届いた結果は使わない
    getMessage(id)
      .then((message) => {
        if (!ignore) setResult({ messageId: id, message, error: '' });
      })
      .catch((err) => {
        // 文言は設計書に記載なし（仮）
        const error = err.message === 'NOT_FOUND'
          ? 'メッセージが見つかりませんでした'
          : '読み込めませんでした。時間をおいて、もう一度お試しください。';
        if (!ignore) setResult({ messageId: id, message: null, error });
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  const loading = result?.messageId !== id;
  const message = loading ? null : result.message;
  const item = message?.post; // 対象の落とし物

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
          {/* 読み込み中・見つからないときは、文言だけを表示する（文言は仮） */}
          {!message && (
            <p className="message-detail-empty" role={loading ? undefined : 'alert'}>
              {loading ? '読み込み中…' : result.error}
            </p>
          )}

          {message && (
            <>
              {/* 感謝メッセージ */}
              <section className="message-detail-card">
                <div className="message-detail-sender">
                  <div className="message-detail-avatar">
                    <AvatarIcon />
                  </div>
                  <div className="message-detail-sender-info">
                    <p className="message-detail-sender-name">{message.senderNickname}</p>
                    <p className="message-detail-sent-at">{formatDateTime(message.sentAt)}</p>
                  </div>
                </div>
                <p className="message-detail-body">{message.messageBody}</p>
              </section>

              {/* 対象の落とし物 */}
              {item && (
                <>
                  <h2 className="message-detail-section-title">落とし物詳細</h2>
                  <section className="message-detail-card message-detail-item-card">
                    <div className="message-detail-item-img-wrapper">
                      {item.postImageUrls[0] && !imageFailed ? (
                        <img
                          src={item.postImageUrls[0]}
                          alt={item.itemName}
                          className="message-detail-item-img"
                          onError={() => setImageFailed(true)}
                        />
                      ) : (
                        <ImagePlaceholder />
                      )}
                    </div>
                    <div className="message-detail-item-info">
                      <h3 className="message-detail-item-name">{item.itemName}</h3>
                      <dl className="message-detail-item-list">
                        <div className="message-detail-item-row">
                          <dt>発見場所</dt>
                          <dd>{item.foundLocation}</dd>
                        </div>
                        <div className="message-detail-item-row">
                          <dt>発見日時</dt>
                          <dd>{formatDateTime(item.foundAt)}</dd>
                        </div>
                        <div className="message-detail-item-row">
                          <dt>特徴</dt>
                          <dd>{item.itemDescription || '特になし'}</dd>
                        </div>
                      </dl>
                    </div>
                  </section>
                </>
              )}
            </>
          )}
        </div>

        {/* ボトムナビゲーション（フッター） */}
        <BottomNav active="mypage" />
      </div>
    </div>
  );
}
