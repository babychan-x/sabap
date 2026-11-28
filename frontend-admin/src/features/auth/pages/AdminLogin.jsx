// G040 ログイン画面（adminLogin）
// 主なAPI（仮）: H-1 管理者ログイン（loginAdmin。api/auth.js）
// 置き場所: src/features/auth/pages/AdminLogin.jsx（App.jsx: /login）
// 見た目: 旧スライド a-01（レイアウトの参考）。色・入力欄・ボタンは管理者用の共通 CSS（G025〜G029 と同じ値）。
// 11/28 作成（ユーザーとClaude）

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginAdmin } from '../../../api/auth'
import './AdminLogin.css'

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  home: '/home', // G048 管理者ホーム
  resetPasswordRequest: '/reset-password/request', // G041 既存メールアドレス入力
}

// 入力チェック（設計書 G040: メールアドレスは必須・254文字以下、パスワードは必須・8〜64文字）。
// 問題があればエラー文を返し、なければ空文字を返す。文言は学生用 G001 と同じ（設計書に記載なし。仮）
function validate(email, password) {
  if (email.trim() === '') return 'メールアドレスを入力してください。'
  if (email.trim().length > 254) return 'メールアドレスは254文字以下で入力してください。'
  if (password === '') return 'パスワードを入力してください。'
  if (password.length < 8 || password.length > 64) return 'パスワードは8〜64文字で入力してください。'
  return ''
}

// フォルダと虫めがねのアイコン（旧スライド a-01 の絵をもとにした）
function LogoIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M6 16a4 4 0 0 1 4-4h14l5 6h25a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" fill="#3b82f6" />
      <path d="M6 24h52v24a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" fill="#60a5fa" />
      <circle cx="40" cy="38" r="9" fill="#ffffff" stroke="#1d4ed8" strokeWidth="4" />
      <line x1="46.5" y1="44.5" x2="55" y2="53" stroke="#1d4ed8" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

// 人のアイコン（メールアドレス欄）
function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  )
}

// 鍵のアイコン（パスワード欄）
function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  )
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // errorMessage: 項目5 エラーメッセージ。loading: 通信中（ボタンを押せなくする）
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // イベント1: ログイン → G048（adminHome）
  async function handleSubmit(e) {
    e.preventDefault()
    if (loading) return
    const message = validate(email, password)
    if (message) {
      setErrorMessage(message)
      return
    }

    setLoading(true)
    setErrorMessage('')
    try {
      await loginAdmin(email.trim(), password)
      // replace: ログインしたあとに「戻る」で、ログイン画面に戻らないようにする
      navigate(ROUTES.home, { replace: true })
    } catch {
      // 認証に失敗・無効化された管理者のときは、どちらが誤りかを区別しない（設計書 G040 項目5。文言は G001 と同じ・仮）
      setErrorMessage('メールアドレスまたはパスワードが違います。')
      setLoading(false)
    }
  }

  return (
    <div className="admin-page login-page">
      <main className="admin-main login-main">
        <div className="admin-container-narrow">
          {/* システム名（文言は旧スライド a-01。設計書に記載なし） */}
          <header className="login-header">
            <div className="login-logo">
              <LogoIcon />
            </div>
            <h1 className="login-title">
              TDU 落とし物
              <br />
              投稿システム管理
            </h1>
            <p className="login-lead">落とし物投稿システムの管理ができます</p>
          </header>

          <form className="admin-card login-card" onSubmit={handleSubmit} noValidate>
            {/* 項目5: エラーメッセージ（失敗したときだけ） */}
            {errorMessage && (
              <p id="login-error" className="admin-error-summary" role="alert">
                {errorMessage}
              </p>
            )}

            {/* 項目1: メールアドレス */}
            <div className="admin-field">
              <label className="admin-label" htmlFor="email">
                メールアドレス
              </label>
              <div className={`admin-input-wrapper login-input-wrapper ${errorMessage ? 'has-error' : ''}`}>
                <span className="login-input-icon">
                  <UserIcon />
                </span>
                <input
                  id="email"
                  type="email"
                  className="admin-input"
                  placeholder="メールアドレスを入力"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrorMessage('')
                  }}
                  aria-invalid={errorMessage ? 'true' : 'false'}
                  aria-describedby={errorMessage ? 'login-error' : undefined}
                />
              </div>
            </div>

            {/* 項目2: パスワード（伏せ字） */}
            <div className="admin-field">
              <label className="admin-label" htmlFor="password">
                パスワード
              </label>
              <div className={`admin-input-wrapper login-input-wrapper ${errorMessage ? 'has-error' : ''}`}>
                <span className="login-input-icon">
                  <LockIcon />
                </span>
                <input
                  id="password"
                  type="password"
                  className="admin-input"
                  placeholder="パスワードを入力"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrorMessage('')
                  }}
                  aria-invalid={errorMessage ? 'true' : 'false'}
                  aria-describedby={errorMessage ? 'login-error' : undefined}
                />
              </div>
            </div>

            {/* 項目3: ログイン（イベント1） */}
            <button type="submit" className="admin-btn admin-btn-primary admin-btn-large admin-btn-block login-submit" disabled={loading}>
              {loading ? 'ログイン中…' : 'ログイン'}
            </button>

            {/* 項目4: パスワードを忘れた方はこちら（イベント2 → G041） */}
            <p className="login-reset">
              <Link to={ROUTES.resetPasswordRequest} className="login-reset-link">
                パスワードを忘れた方はこちら
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}
