// G030 編集確認画面（studentMyPostEditConfirm）
// 主なAPI（仮）: G-3 投稿の編集（PUT /api/student/my-items/{id}。「編集完了する」で実行）
// 置き場所: src/features/mypage/pages/StudentMyPostEditConfirm.jsx（App.jsx: /mypage/posts/:id/edit/confirm）
// 見た目は G019（StudentApplyConfirm）の確認画面に合わせている（カードは G028）。
//
// 【G029（投稿編集画面）との受け渡し】
//   G029 から router の state で form を受け取る。
//     form = { title, category, foundAt（'2026-10-12T18:00' の形）, place, storage, feature, photos: [{ key, src, file? }] }
//   「戻る」では、同じ form を state で G029 に返す（G029 の入力内容が残る。設計書どおり）。
//   replace: true にして、G029 → G030 → G029 と履歴が増えていかないようにする。

import { useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { updateMyPost } from '../../../api/myPosts'
import PhotoSlider from '../../../components/PhotoSlider'
import ProgressSteps from '../../../components/ProgressSteps'
import { formatDateTime } from '../../../utils/date'
import { STORAGE_STATUS_LABELS } from '../../../utils/labels'
import './StudentMyPostEditConfirm.css'

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  edit: (postId) => `/mypage/posts/${postId}/edit`, // G029 投稿編集
  complete: (postId) => `/mypage/posts/${postId}/edit/complete`, // G031 編集完了
}

// 保存APIのエラー → 画面に出す文（文言は設計書に記載なし。仮）
const SUBMIT_ERRORS = {
  NOT_FOUND: 'この投稿は見つかりませんでした。削除された可能性があります。',
  NOT_EDITABLE: 'この投稿は、学生厚生に到着済みのため編集できません。',
}
const DEFAULT_SUBMIT_ERROR = '保存できませんでした。時間をおいて、もう一度お試しください。'

export default function StudentMyPostEditConfirm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams() // /mypage/posts/:id/edit/confirm の投稿ID
  const form = location.state?.form // G029 で入力した内容

  const [submitting, setSubmitting] = useState(false) // 保存中は二重に押せないようにする
  const [submitError, setSubmitError] = useState('')

  // G029 を通らずに、この画面の URL を直接開いたとき（入力内容がない）は、G029 に戻す
  if (!form) {
    return <Navigate to={ROUTES.edit(id)} replace />
  }

  // イベント1: 戻るボタン押下 → 入力した内容を保持したまま G029 に戻る
  const handleBack = () => {
    navigate(ROUTES.edit(id), { state: { form }, replace: true })
  }

  // イベント3: 編集完了ボタン押下 → 投稿を更新して G031 へ
  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      await updateMyPost(id, form)
      // replace: 編集完了のあとに「戻る」で、この確認画面（もう一度保存できる画面）に戻らないようにする
      navigate(ROUTES.complete(id), { replace: true })
    } catch (err) {
      setSubmitError(SUBMIT_ERRORS[err.message] ?? DEFAULT_SUBMIT_ERROR)
      setSubmitting(false)
    }
  }

  return (
    <div className="my-post-edit-confirm-page-wrapper">
      {/* スマホ枠 */}
      <div className="my-post-edit-confirm-mobile-container">
        {/* ヘッダー */}
        <header className="my-post-edit-confirm-header">
          {/* 入出力項目1: 戻る（イベント1） */}
          <button className="my-post-edit-confirm-back-btn" onClick={handleBack} disabled={submitting} aria-label="戻る">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          {/* タイトルは設計書に記載なし（旧スライドの文言） */}
          <h1 className="my-post-edit-confirm-title">編集内容の確認</h1>
        </header>

        {/* 入出力項目2: 進行状況表示（この画面では「確認」を強調） */}
        <ProgressSteps current={1} label="編集の手順" />

        {/* 本文エリア（ここだけスクロールする。特徴が長いときも、スクロールで全文を読める） */}
        <div className="my-post-edit-confirm-content">
          <section className="my-post-edit-confirm-card">
            {/* 入出力項目3: 画像（編集後の写真。スワイプで切り替え・位置表示つき。イベント2） */}
            <PhotoSlider images={form.photos.map((photo) => photo.src)} alt={form.title} />

            <div className="my-post-edit-confirm-body">
              {/* 入出力項目4: 落とし物名（G029 のタイトル） */}
              <h2 className="my-post-edit-confirm-item-name">{form.title}</h2>

              <dl className="my-post-edit-confirm-list">
                {/* 入出力項目5: カテゴリー */}
                <div className="my-post-edit-confirm-row">
                  <dt>カテゴリー</dt>
                  <dd>{form.category}</dd>
                </div>
                {/* 入出力項目6: 拾得日時（例: 2026/10/12 15:00） */}
                <div className="my-post-edit-confirm-row">
                  <dt>拾得日時</dt>
                  <dd>{formatDateTime(form.foundAt)}</dd>
                </div>
                {/* 入出力項目7: 拾得場所 */}
                <div className="my-post-edit-confirm-row">
                  <dt>拾得場所</dt>
                  <dd>{form.place}</dd>
                </div>
                {/* 入出力項目8: 保管場所（G029 で選んだもの） */}
                <div className="my-post-edit-confirm-row">
                  <dt>保管場所</dt>
                  <dd>{STORAGE_STATUS_LABELS[form.storage] ?? form.storage}</dd>
                </div>
                {/* 入出力項目9: 特徴（未入力なら「特になし」。改行もそのまま表示） */}
                <div className="my-post-edit-confirm-row">
                  <dt>特徴</dt>
                  <dd className="my-post-edit-confirm-feature">{form.feature || '特になし'}</dd>
                </div>
              </dl>
            </div>
          </section>
        </div>

        {/* 入出力項目10: 編集完了する（イベント3。下に固定） */}
        <div className="my-post-edit-confirm-footer">
          {submitError && (
            <p className="my-post-edit-confirm-submit-error" role="alert">
              {submitError}
            </p>
          )}
          <button type="button" className="my-post-edit-confirm-submit-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? '保存中…' : '編集完了する'}
          </button>
        </div>
      </div>
    </div>
  )
}
