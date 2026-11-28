// G018 受け取り申請画面（studentApply）
// 主なAPI（仮）: なし（申請の登録は G019 で行う）
// 置き場所: src/features/item/pages/StudentApply.jsx（App.jsx: /items/:id/apply）
// 見た目は G029（StudentMyPostEdit）の入力欄・写真の追加に合わせている。
//
// 【G019（申請確認画面）との受け渡し】
//   「確認画面へ」を押すと、入力内容を router の state（form）に入れて G019 へ移る。
//     form = { applicationReason: '申請理由', applicationImages: [{ key, url（表示用URL）, file（写真のファイル） }] }
//     （項目名は mock/applications.js と同じ考え方。DB は applications.reason と application_images）
//   G019 の「戻る」では、その form を次のように G018 に返すと、入力内容が残る（設計書どおり）。
//     navigate(`/items/${id}/apply`, { state: { form }, replace: true })
//   replace: true にするのは、G018 の「戻る」（ひとつ前の画面 = G017 に戻る）が正しく動くようにするため。

import { useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import './StudentApply.css'
import ScreenLayout from '../../../components/ScreenLayout'

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  detail: (postId) => `/items/${postId}`, // G017 落とし物詳細
  confirm: (postId) => `/items/${postId}/apply/confirm`, // G019 申請確認
}

// 入力の決まり（内部設計書 第8章: 申請理由は必須・1000文字以下、写真は任意・最大4枚）
const MAX_REASON = 1000
const MAX_PHOTOS = 4

const EMPTY_FORM = { applicationReason: '', applicationImages: [] }

export default function StudentApply() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams() // /items/:id/apply の落とし物ID
  const fileInputRef = useRef(null)

  // 入力内容。G019 から戻ってきたときは、そのとき入力していた内容（location.state.form）を使う
  const [form, setForm] = useState(() => location.state?.form ?? EMPTY_FORM)
  const [errorMessage, setErrorMessage] = useState('')

  // 申請理由を書き換えたとき
  const handleReasonChange = (e) => {
    setForm((prev) => ({ ...prev, applicationReason: e.target.value }))
    setErrorMessage('')
  }

  // イベント2: 写真追加（最大4枚まで。4枚あるときは追加ボタン自体を出さない）
  const handleAddPhotos = (e) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = '' // 同じ写真をもう一度選べるようにする
    const room = MAX_PHOTOS - form.applicationImages.length
    if (files.length === 0 || room <= 0) return

    const added = files.slice(0, room).map((file) => ({
      key: `${file.name}-${file.lastModified}-${Math.random()}`,
      url: URL.createObjectURL(file), // 画面に表示するための一時的なURL
      file,
    }))
    setForm((prev) => ({ ...prev, applicationImages: [...prev.applicationImages, ...added] }))
  }

  // 写真を外したとき（設計書に記載なし。第12章 16 の案で「×」で外せるようにした）
  const handleRemovePhoto = (key) => {
    setForm((prev) => ({ ...prev, applicationImages: prev.applicationImages.filter((p) => p.key !== key) }))
  }

  // イベント1: 戻るボタン押下 → 入力内容を破棄して、G017（落とし物詳細）に戻る。
  // ひとつ前の画面（G017）に戻る。URL を直接開いたときなど、戻る先がないときは G017 を開く。
  const handleBack = () => {
    if (location.key === 'default') {
      navigate(ROUTES.detail(id), { replace: true })
    } else {
      navigate(-1)
    }
  }

  // イベント3: 確認画面へ → 理由が未入力ならエラーを出してとどまる。問題なければ G019 へ
  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.applicationReason.trim() === '') {
      // 文言は設計書に記載なし（仮）
      setErrorMessage('理由を入力してください。')
      return
    }
    navigate(ROUTES.confirm(id), { state: { form } })
  }

  return (
    <ScreenLayout
      title="受け取り申請をする"
      onBack={handleBack}
      steps={0}
      stepsLabel="申請の手順"
      footer={
        <div className="apply-footer">
          {/* 送信ボタンは下に固定するため、フォームの外にある。form="…" でフォームとつなぐ */}
          <button type="submit" form="apply-form" className="apply-submit-btn">
            確認画面へ
          </button>
        </div>
      }
    >
      <form id="apply-form" className="apply-form" onSubmit={handleSubmit} noValidate>
        <div className="apply-content">
          {/* 入出力項目3: 申請理由（必須・1000文字以下） */}
          <div className="apply-field">
            <div className="apply-label-row">
              <span className="apply-badge required">必須</span>
              <label className="apply-label" htmlFor="apply-reason">
                理由
              </label>
              <span className="apply-counter">
                {form.applicationReason.length}/{MAX_REASON}
              </span>
            </div>
            <div className={`apply-input-wrapper ${errorMessage ? 'has-error' : ''}`}>
              <textarea
                id="apply-reason"
                className="apply-textarea"
                placeholder="落とした日時、落とした場所、落とし物の特徴など、本人確認に必要な情報をすべて記入してください"
                maxLength={MAX_REASON}
                value={form.applicationReason}
                onChange={handleReasonChange}
                aria-invalid={errorMessage ? true : undefined}
                aria-describedby={errorMessage ? 'apply-error' : undefined}
              />
            </div>
            {/* 入出力項目5: エラーメッセージ */}
            {errorMessage && (
              <p id="apply-error" className="apply-error" role="alert">
                {errorMessage}
              </p>
            )}
          </div>

          {/* 入出力項目4: 写真（任意・最大4枚。追加した写真は一覧で表示） */}
          <div className="apply-field">
            <div className="apply-label-row">
              <span className="apply-badge optional">任意</span>
              <span className="apply-label" id="apply-photo-label">
                写真（所持していたときの写真など）
              </span>
              <span className="apply-counter">
                {form.applicationImages.length}/{MAX_PHOTOS}枚
              </span>
            </div>
            <div className="apply-photos" role="group" aria-labelledby="apply-photo-label">
              {form.applicationImages.map((photo, index) => (
                <div className="apply-photo" key={photo.key}>
                  <img src={photo.url} alt={`写真${index + 1}`} className="apply-photo-img" />
                  <button
                    type="button"
                    className="apply-photo-remove"
                    onClick={() => handleRemovePhoto(photo.key)}
                    aria-label={`写真${index + 1}を外す`}
                  >
                    ×
                  </button>
                </div>
              ))}

              {form.applicationImages.length < MAX_PHOTOS && (
                <button type="button" className="apply-add-photo" onClick={() => fileInputRef.current?.click()}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M9 3 7.17 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                  <span>
                    写真を追加する
                    <br />
                    （最大{MAX_PHOTOS}枚まで）
                  </span>
                </button>
              )}
            </div>
            {/* 端末の写真選択画面を開くための、見えない入力欄 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="apply-file-input"
              onChange={handleAddPhotos}
            />
          </div>
        </div>

      </form>
    </ScreenLayout>
  )
}
