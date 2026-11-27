// G035 メッセージ記述画面（studentMessageWrite）
// 主なAPI（仮）: なし（送信は G036 で行う）
// 置き場所: src/features/message/pages/StudentMessageWrite.jsx（App.jsx: /mypage/applications/:id/message）
// 見た目は G018（StudentApply）の入力画面に合わせている（もとは G029 の入力欄）。
//
// 【G036（メッセージ確認画面）との受け渡し】
//   「確認画面へ」を押すと、入力内容を router の state（form）に入れて G036 へ移る。
//     form = { body: 'メッセージ内容' }
//   G036 の「戻る」では、その form を次のように G035 に返すと、入力内容が残る（設計書どおり）。
//     navigate(`/mypage/applications/${id}/message`, { state: { form }, replace: true })
//   replace: true にするのは、G035 の「戻る」（ひとつ前の画面 = G034 に戻る）が正しく動くようにするため（G018・G019 と同じ）。

import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ProgressSteps from '../../../components/ProgressSteps'
import './StudentMessageWrite.css'

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  handedOverDetail: (applicationId) => `/mypage/applications/${applicationId}/handed-over`, // G034 受け渡し済み詳細
  confirm: (applicationId) => `/mypage/applications/${applicationId}/message/confirm`, // G036 メッセージ確認
}

// 入力の決まり: メッセージ内容は必須・140文字以下
//   外部設計書は文字数「未定」。DB設計書の「1〜140文字」に合わせた（2026/11/25 ユーザーが決定。第12章 10）
const MAX_BODY = 140

const EMPTY_FORM = { messageBody: '' }

export default function StudentMessageWrite() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams() // /mypage/applications/:id/message の申請ID

  // 入力内容。G036 から戻ってきたときは、そのとき入力していた内容（location.state.form）を使う
  const [form, setForm] = useState(() => location.state?.form ?? EMPTY_FORM)
  const [errorMessage, setErrorMessage] = useState('')

  // メッセージを書き換えたとき（エラー表示を消す）
  const handleBodyChange = (e) => {
    setForm((prev) => ({ ...prev, messageBody: e.target.value }))
    setErrorMessage('')
  }

  // イベント1: 戻るボタン押下 → 入力内容を破棄して、G034（受け渡し済み詳細）に戻る。
  // ひとつ前の画面（G034）に戻る。URL を直接開いたときなど、戻る先がないときは G034 を開く。
  const handleBack = () => {
    if (location.key === 'default') {
      navigate(ROUTES.handedOverDetail(id), { replace: true })
    } else {
      navigate(-1)
    }
  }

  // イベント2: 確認画面へ → 未入力ならエラーを出してとどまる。問題なければ G036 へ
  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.messageBody.trim() === '') {
      // 文言は設計書に記載なし（仮）
      setErrorMessage('メッセージを入力してください。')
      return
    }
    navigate(ROUTES.confirm(id), { state: { form } })
  }

  return (
    <div className="message-write-page-wrapper">
      {/* スマホ枠 */}
      <div className="message-write-mobile-container">
        {/* ヘッダー */}
        <header className="message-write-header">
          {/* 入出力項目1: 戻る（イベント1） */}
          <button className="message-write-back-btn" onClick={handleBack} aria-label="戻る">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          {/* タイトルは設計書に記載なし（旧スライドの文言） */}
          <h1 className="message-write-title">感謝メッセージを書く</h1>
        </header>

        {/* 入出力項目2: 進行状況表示（この画面では「入力」を強調） */}
        <ProgressSteps current={0} label="送信の手順" />

        <form className="message-write-form" onSubmit={handleSubmit} noValidate>
          <div className="message-write-content">
            {/* 入出力項目3: メッセージ内容（必須・140文字以下） */}
            <div className="message-write-field">
              <div className="message-write-label-row">
                <span className="message-write-badge required">必須</span>
                <label className="message-write-label" htmlFor="message-write-body">
                  メッセージ内容
                </label>
                <span className="message-write-counter">
                  {form.messageBody.length}/{MAX_BODY}
                </span>
              </div>
              <div className={`message-write-input-wrapper ${errorMessage ? 'has-error' : ''}`}>
                <textarea
                  id="message-write-body"
                  className="message-write-textarea"
                  // 案内の文は設計書に記載なし（仮）
                  placeholder="落とし物を届けてくれた方へ、感謝の気持ちを書きましょう"
                  maxLength={MAX_BODY}
                  value={form.messageBody}
                  onChange={handleBodyChange}
                  aria-invalid={errorMessage ? true : undefined}
                  aria-describedby={errorMessage ? 'message-write-error' : undefined}
                />
              </div>
              {/* 入出力項目4: エラーメッセージ */}
              {errorMessage && (
                <p id="message-write-error" className="message-write-error" role="alert">
                  {errorMessage}
                </p>
              )}
            </div>
          </div>

          {/* 入出力項目5: 確認画面へ（イベント2。下に固定） */}
          <div className="message-write-footer">
            <button type="submit" className="message-write-submit-btn">
              確認画面へ
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
