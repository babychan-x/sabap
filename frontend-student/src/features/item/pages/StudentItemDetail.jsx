// G015 申請結果詳細画面・G017 落とし物詳細画面（studentItemDetail）。G015 と G017 は同じ画面（2026/11/24 確定）
// 主なAPI（仮）: B-2 落とし物詳細（src/api/items.js の getItem）
// 置き場所: src/features/item/pages/StudentItemDetail.jsx（App.jsx: /items/:id）
// 見た目は G028（StudentMyPostDetail）に合わせている。

import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getItem } from '../../../api/items'
import { daysUntil, formatDateTime } from '../../../utils/date'
import { STORAGE_STATUS_LABELS } from '../../../utils/labels'
import './StudentItemDetail.css'

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  home: '/home', // G011 投稿一覧
  apply: (itemId) => `/items/${itemId}/apply`, // G018 受け取り申請
}

// 保管期限を強調する日数（入出力項目10: 期限まで30日以内）
const DEADLINE_WARNING_DAYS = 30

// 写真がないとき／読み込めないときの表示（G028 と同じ）
function ImagePlaceholder() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  )
}

// 入出力項目2・3: 写真（スワイプで切り替え）と、画像位置表示
function PhotoSlider({ images, alt }) {
  const sliderRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [failedImages, setFailedImages] = useState([]) // 読み込みに失敗した写真の番号

  // 写真が0枚のときも、灰色の枠を1つ出す
  const slides = images.length > 0 ? images : [null]

  // イベント2: 画像スワイプ → 何枚目かを調べて、画像位置表示を更新する
  const handleScroll = () => {
    const slider = sliderRef.current
    if (!slider) return
    setActiveIndex(Math.round(slider.scrollLeft / slider.clientWidth))
  }

  // 点を押したとき、その写真まで動かす（スワイプできないPCのため）
  const handleDotClick = (index) => {
    const slider = sliderRef.current
    if (!slider) return
    slider.scrollTo({ left: index * slider.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="item-detail-photo-area">
      <div className="item-detail-slider" ref={sliderRef} onScroll={handleScroll}>
        {slides.map((src, index) => (
          <div className="item-detail-slide" key={index}>
            {src && !failedImages.includes(index) ? (
              <img
                src={src}
                alt={`${alt}の写真${index + 1}`}
                className="item-detail-img"
                onError={() => setFailedImages((prev) => [...prev, index])}
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>
        ))}
      </div>

      {/* 画像位置表示: 写真が2枚以上のときだけ、「1 / 3」と点を出す */}
      {slides.length > 1 && (
        <>
          <span className="item-detail-photo-count" aria-live="polite">
            {activeIndex + 1} / {slides.length}
          </span>
          <div className="item-detail-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`item-detail-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`${index + 1}枚目の写真を表示`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function StudentItemDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams() // /items/:id の落とし物ID

  // 取得結果。「どのIDの結果か」と一緒に持つ（id と違えば読み込み中）
  const [result, setResult] = useState({ id: null, item: null, error: '' })
  const loading = result.id !== id

  useEffect(() => {
    let ignore = false // 古い取得の結果が、あとから届いても使わないための目印

    getItem(id)
      .then((item) => {
        if (!ignore) setResult({ id, item, error: '' })
      })
      .catch((err) => {
        if (ignore) return
        // 文言は設計書に記載なし（仮）
        const error =
          err.message === 'NOT_FOUND'
            ? 'この落とし物は見つかりませんでした。削除された可能性があります。'
            : '読み込めませんでした。時間をおいて、もう一度お試しください。'
        setResult({ id, item: null, error })
      })

    return () => {
      ignore = true
    }
  }, [id])

  // イベント1: 戻るボタン押下 → 遷移元の画面（G012 / G011 / G016）に戻る。
  // URL を直接開いたときなど、戻る先の履歴がないときは G011（ホーム）へ（仮）。
  const handleBack = () => {
    if (location.key === 'default') {
      navigate(ROUTES.home)
    } else {
      navigate(-1)
    }
  }

  const item = loading ? null : result.item

  // イベント3の非表示条件: 受け渡し済み・処分済み・申請済みのときは「受け取り申請する」を出さない
  let hideReason = ''
  if (item) {
    if (item.storageStatus === 'RETURNED') hideReason = 'この落とし物は、すでに受け渡し済みです。'
    else if (item.storageStatus === 'DISPOSED') hideReason = 'この落とし物は、すでに処分済みです。'
    else if (item.alreadyApplied) hideReason = 'この落とし物には、すでに受け取り申請をしています。'
  }

  // 入出力項目10: 期限まで30日以内なら強調する（期限を過ぎていても強調）
  const deadlineDays = item ? daysUntil(item.storageDeadline) : null
  const deadlineSoon = deadlineDays !== null && deadlineDays <= DEADLINE_WARNING_DAYS

  return (
    <div className="item-detail-page-wrapper">
      {/* スマホ枠 */}
      <div className="item-detail-mobile-container">
        {/* ヘッダー */}
        <header className="item-detail-header">
          <button className="item-detail-back-btn" onClick={handleBack} aria-label="戻る">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          {/* 画面のタイトルは設計書に記載なし（仮。画面名から） */}
          <h1 className="item-detail-title">落とし物の詳細</h1>
        </header>

        {loading && <p className="item-detail-message">読み込み中…</p>}

        {!loading && result.error && (
          <p className="item-detail-message error" role="alert">{result.error}</p>
        )}

        {item && (
          <>
            {/* 本文エリア（ここだけスクロールする） */}
            <div className="item-detail-content">
              <section className="item-detail-card">
                {/* key を付けて、別の落とし物を開いたときに写真の位置を1枚目に戻す */}
                <PhotoSlider key={item.id} images={item.images} alt={item.name} />

                <div className="item-detail-body">
                  {/* 入出力項目4: 落とし物名 */}
                  <h2 className="item-detail-item-name">{item.name}</h2>

                  <dl className="item-detail-list">
                    {/* 入出力項目5: カテゴリー */}
                    <div className="item-detail-row">
                      <dt>カテゴリー</dt>
                      <dd>{item.category}</dd>
                    </div>
                    {/* 入出力項目6: 拾得日時 */}
                    <div className="item-detail-row">
                      <dt>拾得日時</dt>
                      <dd>{formatDateTime(item.foundAt)}</dd>
                    </div>
                    {/* 入出力項目7: 拾得場所 */}
                    <div className="item-detail-row">
                      <dt>拾得場所</dt>
                      <dd>{item.foundPlace}</dd>
                    </div>
                    {/* 入出力項目8: 保管場所（ステータスと補足欄を併せて表示） */}
                    <div className="item-detail-row">
                      <dt>保管場所</dt>
                      <dd>
                        <span className={`item-detail-status ${item.storageStatus.toLowerCase()}`}>
                          {STORAGE_STATUS_LABELS[item.storageStatus]}
                        </span>
                        {item.storageNote && <span className="item-detail-note">{item.storageNote}</span>}
                      </dd>
                    </div>
                    {/* 入出力項目9: 特徴（未入力なら「特になし」） */}
                    <div className="item-detail-row">
                      <dt>特徴</dt>
                      <dd>{item.features || '特になし'}</dd>
                    </div>
                    {/* 入出力項目10: 保管期限（30日以内は強調） */}
                    <div className="item-detail-row">
                      <dt>保管期限</dt>
                      <dd className={deadlineSoon ? 'item-detail-deadline-soon' : undefined}>
                        {formatDateTime(item.storageDeadline)} まで
                      </dd>
                    </div>
                  </dl>
                </div>
              </section>

              {/* ボタンを出さない理由（設計書は「非表示」とだけ書いてある。理由の文は仮） */}
              {hideReason && <p className="item-detail-notice">{hideReason}</p>}
            </div>

            {/* 入出力項目11: 受け取り申請する（イベント3 → G018 studentApply） */}
            {!hideReason && (
              <div className="item-detail-footer">
                <button type="button" className="item-detail-apply-btn" onClick={() => navigate(ROUTES.apply(item.id))}>
                  受け取り申請する
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
