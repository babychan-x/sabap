import './StudentResetPasswordRequest.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScreenLayout from '../../../components/ScreenLayout'
import { sendResetMail } from '../../../api/auth'

// G007 既存メールアドレス入力画面（studentResetPasswordRequest）
// 主なAPI（仮）: A-5 再設定メールの送信（sendResetMail。api/auth.js）
// 11/28: 「試運転用」（入力に関係なく G008 へ進む）をやめて、入力チェックと送信をつないだ

// 送信APIのエラー → 画面に出す文（文言は設計書に記載なし。仮）
const SEND_ERRORS = {
  NOT_REGISTERED: 'このメールアドレスは登録されていません。',
}
const DEFAULT_SEND_ERROR = 'メールを送信できませんでした。時間をおいて、もう一度お試しください。'

export default function StudentResetPasswordRequest() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  // 送信中は、ボタンを押せないようにする
  const [sending, setSending] = useState(false)

  // ログイン画面（G001）へ戻る
  const backToLogin = () => {
    navigate('/login')
  }

  // イベント2: メールを送信する → G008（入力チェックは、前にコメントにしてあった処理を戻した）
  const sendButton = async (e) => {
    e.preventDefault()
    if (sending) return

    const inputEmail = email.trim()

    // 未入力の場合
    if (!inputEmail) {
      setErrorMessage('メールアドレスを入力してください。')
      return
    }

    // メールアドレスの形式を確認
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(inputEmail)) {
      setErrorMessage('正しいメールアドレスを入力してください。')
      return
    }

    // 文字数の確認（設計書: 254文字以下）
    if (inputEmail.length > 254) {
      setErrorMessage('メールアドレスは254文字以内で入力してください。')
      return
    }

    // 入力内容に問題がなければ、メールを送信して G008 へ
    setErrorMessage('')
    setSending(true)
    try {
      await sendResetMail(inputEmail)
      navigate('/reset-password/mail-sent')
    } catch (err) {
      // 形式が不正・未登録のときは、この画面にエラーを出す（設計書 G007 イベント2）
      setErrorMessage(SEND_ERRORS[err.message] ?? DEFAULT_SEND_ERROR)
      setSending(false)
    }
  }

  return (
    <ScreenLayout
      contentClassName="page reset-password-request"
    >

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
            disabled={sending}
          >
            {sending ? '送信中…' : 'メールを送信する'}
          </button>
        </div>
      </form>
    </ScreenLayout>
  )
}
