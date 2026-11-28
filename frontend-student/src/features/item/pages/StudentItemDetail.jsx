// G015 申請結果詳細画面・G017 落とし物詳細画面（studentItemDetail）。G015 と G017 は同じ画面（2026/11/24 確定）
// 主なAPI（仮）: B-2 落とし物詳細（src/api/items.js の getItem）
// 置き場所: src/features/item/pages/StudentItemDetail.jsx（App.jsx: /items/:id）
// 見た目は G028（StudentMyPostDetail）に合わせている。

import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getItem } from '../../../api/items'
import PhotoSlider from '../../../components/PhotoSlider'
import { daysUntil, formatDateTime } from '../../../utils/date'
import { STORAGE_STATUS_LABELS } from '../../../utils/labels'
import './StudentItemDetail.css'
import ScreenLayout from '../../../components/ScreenLayout'

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  home: '/home', // G011 投稿一覧
  apply: (postId) => `/items/${postId}/apply`, // G018 受け取り申請
}

// 保管期限を強調する日数（入出力項目10: 期限まで30日以内）
const DEADLINE_WARNING_DAYS = 30

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
    if (item.itemStatus === 'RETURNED') hideReason = 'この落とし物は、すでに受け渡し済みです。'
    else if (item.itemStatus === 'DISPOSED') hideReason = 'この落とし物は、すでに処分済みです。'
    else if (item.hasMyApplication) hideReason = 'この落とし物には、すでに受け取り申請をしています。'
  }

  // 入出力項目10: 期限まで30日以内なら強調する（期限を過ぎていても強調）
  const deadlineDays = item ? daysUntil(item.storageDeadline) : null
  const deadlineSoon = deadlineDays !== null && deadlineDays <= DEADLINE_WARNING_DAYS

  return (
    <ScreenLayout
      title="落とし物の詳細"
      onBack={handleBack}
      background="gray"
      footer={
        !hideReason && (
          <div className="item-detail-footer">
            <button type="button" className="item-detail-apply-btn" onClick={() => navigate(ROUTES.apply(item.postId))}>
              受け取り申請する
            </button>
          </div>
        )
      }
    >
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
              <PhotoSlider key={item.postId} images={item.postImageUrls} alt={item.itemName} />

              <div className="item-detail-body">
                {/* 入出力項目4: 落とし物名 */}
                <h2 className="item-detail-item-name">{item.itemName}</h2>

                <dl className="item-detail-list">
                  {/* 入出力項目5: カテゴリー */}
                  <div className="item-detail-row">
                    <dt>カテゴリー</dt>
                    <dd>{item.itemCategory}</dd>
                  </div>
                  {/* 入出力項目6: 拾得日時 */}
                  <div className="item-detail-row">
                    <dt>拾得日時</dt>
                    <dd>{formatDateTime(item.foundAt)}</dd>
                  </div>
                  {/* 入出力項目7: 拾得場所 */}
                  <div className="item-detail-row">
                    <dt>拾得場所</dt>
                    <dd>{item.foundLocation}</dd>
                  </div>
                  {/* 入出力項目8: 保管場所（ステータスと補足欄を併せて表示） */}
                  <div className="item-detail-row">
                    <dt>保管場所</dt>
                    <dd>
                      <span className={`item-detail-status ${item.itemStatus.toLowerCase()}`}>
                        {STORAGE_STATUS_LABELS[item.itemStatus]}
                      </span>
                      {item.storageLocation && <span className="item-detail-note">{item.storageLocation}</span>}
                    </dd>
                  </div>
                  {/* 入出力項目9: 特徴（未入力なら「特になし」） */}
                  <div className="item-detail-row">
                    <dt>特徴</dt>
                    <dd>{item.itemDescription || '特になし'}</dd>
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

        </>
      )}
    </ScreenLayout>
  )
}
