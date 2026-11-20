import './StudentResetPasswordRequest.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// G007 既存メールアドレス入力画面（studentResetPasswordRequest）

export default function StudentResetPasswordRequest() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // ログイン画面（G001）へ戻る
  const backToLogin = () => {
    navigate('/login')
  }

  //試運転用
  // メール送信ボタン押下時
  const sendButton = (e) => {
    e.preventDefault()

    // 入力内容に関係なくG008へ遷移
    navigate('/reset-password/mail-sent')
  }

  // メール送信ボタン押下時
  //const sendButton = (e) => {
  //  e.preventDefault()

  //  const inputEmail = email.trim()

  //  // 未入力の場合
  //  if (!inputEmail) {
  //    setErrorMessage('メールアドレスを入力してください。')
  //    return
  //  }

    // メールアドレスの形式を確認
    //const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    //if (!emailPattern.test(inputEmail)) {
    //  setErrorMessage('正しいメールアドレスを入力してください。')
    //  return
    //}

    // 文字数の確認
    //if (inputEmail.length > 254) {
    //  setErrorMessage('メールアドレスは254文字以内で入力してください。')
    //  return
    //}

    // 入力内容に問題がなければG008へ遷移
    //setErrorMessage('')
    //navigate('/reset-password/mail-sent')
    //}

  return (
    <div className="page reset-password-request">

      {/* 戻るボタン */}
      <button
        type="button"
        className="reset-password-request__back"
        onClick={backToLogin}
      >
        ＜ パスワードを忘れた方
      </button>

      {/* 鍵アイコン */}
      <div className="reset-password-request__icon">
        <svg
          width="80"
          height="100"
          viewBox="0 0 80 100"
          aria-hidden="true"
        >
          <path
            d="M15 45 V30 A25 25 0 0 1 65 30 V45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
          />
          <rect
            x="0"
            y="43"
            width="80"
            height="55"
            fill="currentColor"
          />
          <circle cx="40" cy="68" r="9" fill="white" />
          <rect
            x="36"
            y="68"
            width="8"
            height="16"
            fill="white"
          />
        </svg>
      </div>

      {/* 説明文 */}
      <div className="reset-password-request__description">
        <h1>
          登録している学内メールアドレスを
          <br />
          入力してください
        </h1>
        <p>
          パスワード再設定用のURLを送信します
        </p>
      </div>

      {/* メールアドレス入力フォーム */}
      <form
        className="reset-password-request__form"
        onSubmit={sendButton}
        noValidate
      >
        <label
          htmlFor="email"
          className="form-label"
        >
          学内メールアドレス
        </label>

        <input
          type="email"
          id="email"
          name="email"
          className="form-input"
          placeholder="メールアドレスを入力"
          value={email}
          maxLength={255}
          onChange={(e) => {
            setEmail(e.target.value)
            setErrorMessage('')
          }}
          aria-invalid={!!errorMessage}
          aria-describedby={
            errorMessage ? 'email-error' : undefined
          }
        />

        {/* 入力内容に不備がある場合のみ表示 */}
        {errorMessage && (
          <p
            id="email-error"
            className="form-error"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {/* メール送信ボタン */}
        <div className="reset-password-request__footer">
          <button
            type="submit"
            className="btn btn--primary"
          >
            メールを送信する
          </button>
        </div>
      </form>
    </div>
  )
}
