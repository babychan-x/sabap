// G019 申請確認画面（studentApplyConfirm）
// 主なAPI（仮）: B-2 落とし物詳細（画像・名前の表示）、E-3 受け取り申請（「受け取り申請する」で実行）
// 置き場所: src/features/item/pages/StudentApplyConfirm.jsx（App.jsx: /items/:id/apply/confirm）
// 見た目は G028（StudentMyPostDetail）のカードに合わせている。
//
// 【G018 との受け渡し】
//   G018 から router の state で form = { applicationReason, applicationImages } を受け取る。
//   「戻る」では、同じ form を state で G018 に返す（replace: true。G018 の説明を参照）。

import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { createApplication } from '../../../api/applications'
import { getItem } from '../../../api/items'
import PhotoSlider from '../../../components/PhotoSlider'
import './StudentApplyConfirm.css'
import ScreenLayout from '../../../components/ScreenLayout'

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  apply: (postId) => `/items/${postId}/apply`, // G018 受け取り申請
  complete: (postId) => `/items/${postId}/apply/complete`, // G020 申請完了
}

// 申請APIのエラー → 画面に出す文（文言は設計書に記載なし。仮）
const SUBMIT_ERRORS = {
  ALREADY_APPLIED: 'この落とし物には、すでに受け取り申請をしています。',
  NOT_APPLICABLE: 'この落とし物は、受け渡し済みまたは処分済みのため、申請できません。',
  NOT_FOUND: 'この落とし物は見つかりませんでした。削除された可能性があります。',
}
const DEFAULT_SUBMIT_ERROR = '申請できませんでした。時間をおいて、もう一度お試しください。'

export default function StudentApplyConfirm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams() // /items/:id/apply/confirm の落とし物ID
  const form = location.state?.form // G018 で入力した内容

  // 落とし物（画像・名前）の取得結果。「どのIDの結果か」と一緒に持つ
  const [itemResult, setItemResult] = useState({ id: null, item: null, error: '' })
  const itemLoading = itemResult.id !== id

  const [submitting, setSubmitting] = useState(false) // 申請中は二重に押せないようにする
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!form) return // 入力内容がないときは、下の <Navigate> で G018 に戻すので取得しない
    let ignore = false

    getItem(id)
      .then((item) => {
        if (!ignore) setItemResult({ id, item, error: '' })
      })
      .catch((err) => {
        if (!ignore) setItemResult({ id, item: null, error: SUBMIT_ERRORS[err.message] ?? DEFAULT_SUBMIT_ERROR })
      })

    return () => {
      ignore = true
    }
  }, [id, form])

  // G018 を通らずに、この画面の URL を直接開いたとき（入力内容がない）は、G018 に戻す
  if (!form) {
    return <Navigate to={ROUTES.apply(id)} replace />
  }

  // イベント1: 戻るボタン押下 → 入力した内容を保持したまま G018 に戻る
  const handleBack = () => {
    navigate(ROUTES.apply(id), { state: { form }, replace: true })
  }

  // イベント2: 受け取り申請ボタン押下 → 申請を登録（承認待ち）して G020 へ
  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      await createApplication(id, form)
      // replace: 申請完了のあとに「戻る」で、この確認画面（もう一度申請できる画面）に戻らないようにする
      navigate(ROUTES.complete(id), { replace: true })
    } catch (err) {
      setSubmitError(SUBMIT_ERRORS[err.message] ?? DEFAULT_SUBMIT_ERROR)
      setSubmitting(false)
    }
  }

  const item = itemLoading ? null : itemResult.item

  return (
    <ScreenLayout
      title="申請内容の確認"
      onBack={handleBack}
      backDisabled={submitting}
      steps={1}
      stepsLabel="申請の手順"
      background="gray"
      footer={
        <div className="apply-confirm-footer">
          {submitError && (
            <p className="apply-confirm-submit-error" role="alert">
              {submitError}
            </p>
          )}
          <button
            type="button"
            className="apply-confirm-submit-btn"
            onClick={handleSubmit}
            // 落とし物を読み込めていないときと、申請中は押せない
            disabled={!item || submitting}
          >
            {submitting ? '申請中…' : '受け取り申請する'}
          </button>
        </div>
      }
    >
      {/* 本文エリア（ここだけスクロールする） */}
      <div className="apply-confirm-content">
        {itemLoading && <p className="apply-confirm-message">読み込み中…</p>}

        {!itemLoading && itemResult.error && (
          <p className="apply-confirm-message error" role="alert">{itemResult.error}</p>
        )}

        {item && (
          <section className="apply-confirm-card">
            {/* 入出力項目3: 画像（複数枚なら位置表示つき） */}
            <PhotoSlider key={item.postId} images={item.postImageUrls} alt={item.itemName} />

            <div className="apply-confirm-body">
              {/* 入出力項目4: 落とし物名 */}
              <h2 className="apply-confirm-item-name">{item.itemName}</h2>

              <dl className="apply-confirm-list">
                {/* 入出力項目5: 申請理由（G018 で入力した理由。改行もそのまま表示） */}
                <div className="apply-confirm-row">
                  <dt>理由</dt>
                  <dd className="apply-confirm-reason">{form.applicationReason}</dd>
                </div>
              </dl>
            </div>
          </section>
        )}
      </div>

    </ScreenLayout>
  )
}
