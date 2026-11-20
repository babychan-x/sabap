import './StudentApprovalDetail.css'

// G014 承認詳細画面（studentApprovalDetail）
// ※ 仮の画面。外部設計書 G014 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: E-2

// 置き場所: src/features/application/pages/StudentApprovalDetail.jsx（App.jsx: /applications/:id/approval）

import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './StudentApprovalDetail.css';

// ---------------------------------------------------------------
// 写真にかさねるスタンプの設定
//   申請の結果ごとに、文字と色（className）を決める。
//   ※ 承認待ち・期限切れ・受け渡し済みの扱いは、設計書で決まったらここに足す。
// ---------------------------------------------------------------
const STAMPS = {
  APPROVED: { label: '承認', className: 'approved' },
  REJECTED: { label: '却下', className: 'rejected' },
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

export default function StudentApprovalDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // /applications/:id/approval の申請ID
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState([]); // 読み込みに失敗した写真の番号

  // 写真つきの仮データ（G012 の仮データの申請ID 101 / 102 / 103 に対応）
  // 写真は本来、投稿された画像（1〜4枚）。財布の仮データでは同じ写真を3枚並べている。
  // TODO: API で申請結果を取得する（見つからないときの表示は仕様に記載なし）
  const walletImage = 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80';
  const dummyApplications = {
    101: {
      status: 'APPROVED',
      itemName: '黒い折り畳み財布',
      category: '財布',
      foundAt: '2026/10/13 16:00',
      place: '1号館',
      feature: '',
      reason: '今日の15:30頃に、1号館のFI科演習室で講義を受けていました。そして、休憩時間に財布を出し入れしたので、置きっぱなしで演習室を出てしまった可能性があるから。\n中に学生証と〇〇神社のおみくじが入っていると思います。',
      images: [walletImage, walletImage, walletImage],
      deadline: '2026/10/27 16:00',
      pickupPlace: '学生厚生',
    },
    102: {
      status: 'REJECTED',
      itemName: 'iPhone(白)',
      category: 'スマホ',
      foundAt: '2026/10/13 15:00',
      place: '2号館',
      feature: '',
      reason: '2号館の教室で、白いケースのiPhoneを置き忘れたかもしれません。',
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'],
      deadline: '',
      pickupPlace: '',
    },
    103: {
      status: 'APPROVED',
      itemName: 'ピンクポーチ',
      category: 'その他',
      foundAt: '2026/10/13 13:00',
      place: '食堂',
      feature: 'ファスナーに白いクマのキーホルダーが付いている',
      reason: '昼休みに食堂で友達と話していて、テーブルに置いたまま教室へ戻ってしまいました。\n中にリップと目薬が入っています。',
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'],
      deadline: '2026/10/27 13:00',
      pickupPlace: '学生厚生',
    },
  };
  const application = dummyApplications[id];

  // 仮データにないIDのときは、別の落とし物を代わりに出さず「見つかりません」を表示する
  if (!application) {
    return (
      <div className="approval-detail-page-wrapper">
        <div className="approval-detail-mobile-container">
          <header className="approval-detail-header">
            <button
              className="approval-detail-back-btn"
              onClick={() => navigate(-1)}
              aria-label="戻る"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <h1 className="approval-detail-title">申請結果の詳細</h1>
          </header>
          <p className="approval-detail-empty">申請結果が見つかりませんでした</p>
        </div>
      </div>
    );
  }

  const stamp = STAMPS[application.status];

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

  return (
    <div className="approval-detail-page-wrapper">
      {/* 9:16比率のスマホ枠 */}
      <div className="approval-detail-mobile-container">
        {/* ヘッダー */}
        <header className="approval-detail-header">
          <button
            className="approval-detail-back-btn"
            onClick={() => navigate(-1)} // 遷移元（G012 通知 / G033 受け取り申請一覧）に戻る
            aria-label="戻る"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 className="approval-detail-title">申請結果の詳細</h1>
        </header>

        {/* 本文エリア */}
        <div className="approval-detail-content">
          <section className="approval-detail-card">
            {/* 写真（スワイプで切り替え）＋ スタンプ */}
            <div className="approval-detail-photo-area">
              <div
                className="approval-detail-slider"
                ref={sliderRef}
                onScroll={handleScroll}
              >
                {application.images.map((src, index) => (
                  <div className="approval-detail-slide" key={index}>
                    {failedImages.includes(index) ? (
                      <ImagePlaceholder />
                    ) : (
                      <img
                        src={src}
                        alt={`${application.itemName}の写真${index + 1}`}
                        className="approval-detail-img"
                        onError={() => setFailedImages((prev) => [...prev, index])}
                      />
                    )}
                  </div>
                ))}
              </div>
              {stamp && (
                <span className={`approval-detail-stamp ${stamp.className}`}>
                  {stamp.label}
                </span>
              )}
            </div>

            {/* 写真が2枚以上のときだけ点を表示 */}
            {application.images.length > 1 && (
              <div className="approval-detail-dots">
                {application.images.map((_, index) => (
                  <button
                    key={index}
                    className={`approval-detail-dot ${index === activeIndex ? 'active' : ''}`}
                    onClick={() => handleDotClick(index)}
                    aria-label={`${index + 1}枚目の写真を表示`}
                  />
                ))}
              </div>
            )}

            <div className="approval-detail-body">
              <h2 className="approval-detail-item-name">{application.itemName}</h2>

              <dl className="approval-detail-list">
                <div className="approval-detail-row">
                  <dt>カテゴリー</dt>
                  <dd>{application.category}</dd>
                </div>
                <div className="approval-detail-row">
                  <dt>発見日時</dt>
                  <dd>{application.foundAt}</dd>
                </div>
                <div className="approval-detail-row">
                  <dt>発見場所</dt>
                  <dd>{application.place}</dd>
                </div>
                <div className="approval-detail-row">
                  <dt>特徴</dt>
                  <dd>{application.feature || '特になし'}</dd>
                </div>
                <div className="approval-detail-row">
                  <dt>申請理由</dt>
                  <dd className="approval-detail-reason">{application.reason}</dd>
                </div>
              </dl>

              {/* 承認されたときだけ、受け取りの期限と場所を表示（却下のときは出さない：要確認） */}
              {application.status === 'APPROVED' && (
                <div className="approval-detail-pickup">
                  <div className="approval-detail-pickup-row">
                    <span className="approval-detail-pickup-label">期限</span>
                    <span className="approval-detail-pickup-value">{application.deadline}</span>
                  </div>
                  <div className="approval-detail-pickup-row">
                    <span className="approval-detail-pickup-label">受取場所</span>
                    <span className="approval-detail-pickup-value">{application.pickupPlace}</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}