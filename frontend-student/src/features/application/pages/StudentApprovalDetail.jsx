import './StudentApprovalDetail.css'

// G014 承認詳細画面（studentApprovalDetail）
// ※ 仮の画面。外部設計書 G014 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: E-2 申請の詳細（api/applications.js の getApplication。仮データは mock/applications.js と mock/items.js）

// 置き場所: src/features/application/pages/StudentApprovalDetail.jsx（App.jsx: /applications/:id/approval）

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getApplication } from '../../../api/applications';
import { formatDateTime } from '../../../utils/date';
import './StudentApprovalDetail.css';
import ScreenLayout from '../../../components/ScreenLayout';

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

  // 取得した申請（どの ID の結果かも一緒に持つ。ID が変わったら「読み込み中」に戻る）
  //   application: 申請（applicationStatus・applicationReason・pickupDeadline・pickupLocation など）
  //   application.post: 申請した落とし物（itemName・itemCategory など。mock/items.js の形）
  //   項目名と DB の列の対応は mock/applications.js・mock/items.js の先頭に書いてある
  const [result, setResult] = useState(null); // { applicationId, application, error }

  // 画面を開いたとき（ID が変わったとき）に、申請を取得する
  useEffect(() => {
    let ignore = false; // 画面を離れたあとに届いた結果は使わない
    getApplication(id)
      .then((application) => {
        if (!ignore) setResult({ applicationId: id, application, error: '' });
      })
      .catch((err) => {
        // 文言は設計書に記載なし（仮）
        const error = err.message === 'NOT_FOUND'
          ? '申請結果が見つかりませんでした'
          : '読み込めませんでした。時間をおいて、もう一度お試しください。';
        if (!ignore) setResult({ applicationId: id, application: null, error });
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  const loading = result?.applicationId !== id;
  const application = loading ? null : result.application;
  const post = application?.post;

  // 読み込み中・見つからないときは、別の落とし物を代わりに出さず、文言だけを表示する
  if (!application || !post) {
    return (
      <ScreenLayout
        title="申請結果の詳細"
        onBack={() => navigate(-1)}
        background="gray"
      >
        <p className="approval-detail-empty" role={loading ? undefined : 'alert'}>
          {loading ? '読み込み中…' : result.error || '申請結果が見つかりませんでした'}
        </p>
      </ScreenLayout>
    );
  }

  const stamp = STAMPS[application.applicationStatus];

  // 写真がない落とし物は、灰色の枠を1枚出す（G028 と同じ）
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

  return (
    <ScreenLayout
      title="申請結果の詳細"
      onBack={() => navigate(-1)}
      background="gray"
    >
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
              {images.map((src, index) => (
                <div className="approval-detail-slide" key={index}>
                  {!src || failedImages.includes(index) ? (
                    <ImagePlaceholder />
                  ) : (
                    <img
                      src={src}
                      alt={`${post.itemName}の写真${index + 1}`}
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
          {images.length > 1 && (
            <div className="approval-detail-dots">
              {images.map((_, index) => (
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
            <h2 className="approval-detail-item-name">{post.itemName}</h2>

            <dl className="approval-detail-list">
              <div className="approval-detail-row">
                <dt>カテゴリー</dt>
                <dd>{post.itemCategory}</dd>
              </div>
              <div className="approval-detail-row">
                <dt>発見日時</dt>
                <dd>{formatDateTime(post.foundAt)}</dd>
              </div>
              <div className="approval-detail-row">
                <dt>発見場所</dt>
                <dd>{post.foundLocation}</dd>
              </div>
              <div className="approval-detail-row">
                <dt>特徴</dt>
                <dd>{post.itemDescription || '特になし'}</dd>
              </div>
              <div className="approval-detail-row">
                <dt>申請理由</dt>
                <dd className="approval-detail-reason">{application.applicationReason}</dd>
              </div>
            </dl>

            {/* 承認されたときだけ、受け取りの期限と場所を表示（却下のときは出さない：要確認） */}
            {application.applicationStatus === 'APPROVED' && (
              <div className="approval-detail-pickup">
                <div className="approval-detail-pickup-row">
                  <span className="approval-detail-pickup-label">期限</span>
                  <span className="approval-detail-pickup-value">
                    {application.pickupDeadline ? formatDateTime(application.pickupDeadline) : ''}
                  </span>
                </div>
                <div className="approval-detail-pickup-row">
                  <span className="approval-detail-pickup-label">受取場所</span>
                  <span className="approval-detail-pickup-value">{application.pickupLocation}</span>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </ScreenLayout>
  );
}