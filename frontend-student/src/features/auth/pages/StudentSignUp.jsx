import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendSignUpMail } from '../../../api/auth'
import './StudentSignUp.css'
import ScreenLayout from '../../../components/ScreenLayout'

// G002 新規メールアドレス入力画面（studentSignUp）
// 外部設計書 第2.0版 G002 に対応。
export default function StudentSignUp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // 入力チェック（サーバー側でも同じチェックをする）
  function validate() {
    if (email.trim() === '') return 'メールアドレスを入力してください。'
    if (email.length > 254) return 'メールアドレスは254文字以下で入力してください。'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'メールアドレスの形式が正しくありません。'
    }
    return ''
  }

  // イベント2: メールを送信する → G003（studentSignUpMailSent）
  async function handleSubmit(e) {
    e.preventDefault()
    const message = validate()
    if (message) {
      setErrorMessage(message)
      return
    }

    setLoading(true)
    setErrorMessage('')
    try {
      await sendSignUpMail(email.trim())
      navigate('/signup/mail-sent')
    } catch (err) {
      // 設計書: 形式不正・大学指定ドメインでない・登録済み の場合は自画面にエラーを表示
      if (err.message === 'INVALID_DOMAIN') {
        setErrorMessage('大学指定のメールアドレスを入力してください。')
      } else if (err.message === 'ALREADY_REGISTERED') {
        setErrorMessage('このメールアドレスは既に登録されています。')
      } else {
        setErrorMessage('メールを送信できませんでした。時間を空けて再度お試しください。')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScreenLayout
      contentClassName="page"
    >
      {/* イベント1: 戻る → G001（studentLogin）。入力内容は破棄 */}
      <button
        type="button"
        className="btn btn--link signup__back"
        onClick={() => navigate('/login')}
      >
        ← 戻る
      </button>

      <h1 className="signup__title">新規登録</h1>
      <p className="signup__lead">
        学内メールアドレスを入力してください。
        <br />
        パスワード設定用のURLをお送りします。
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <label className="form-label" htmlFor="email">
          メールアドレス
        </label>
        <input
          id="email"
          className="form-input"
          type="email"
          autoComplete="email"
          maxLength={254}
          placeholder="学内メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {errorMessage && (
          <p className="form-error" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          className="btn btn--primary signup__submit"
          disabled={loading}
        >
          {loading ? '送信中…' : 'メールを送信する'}
        </button>
      </form>
    </ScreenLayout>
  )
}
