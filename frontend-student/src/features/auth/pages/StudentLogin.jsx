import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// 【確認用・仮】本来の処理に戻すときは、下の行のコメントを外す
// import { loginStudent } from '../../../api/auth'
import './StudentLogin.css'

// G001 ログイン画面（studentLogin）
// 外部設計書 第2.0版 G001 の入出力項目・イベントに対応。
export default function StudentLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // 【確認用・仮】本来の処理に戻すときは、下の2行を消して、その下の2行のコメントを外す
  const [errorMessage] = useState('')
  const [loading] = useState(false)
  // const [errorMessage, setErrorMessage] = useState('')
  // const [loading, setLoading] = useState(false)

  // 【確認用・仮】画面の確認のため、今は何を入力しても（空でも）G011 へ進む。
  // 本来の処理に戻すときは、この handleSubmit を消して、下のコメントアウト（validate と handleSubmit）を外す。
  function handleSubmit(e) {
    e.preventDefault()
    navigate('/home')
  }

  /* ---------- 本来の処理（ここから） ----------

  // 入力チェック。問題があればエラー文を返し、なければ空文字を返す。
  // （サーバー側でも同じチェックをする。ここは使いやすさのため）
  function validate() {
    if (email.trim() === '') return 'メールアドレスを入力してください。'
    if (email.length > 254) return 'メールアドレスは254文字以下で入力してください。'
    if (password === '') return 'パスワードを入力してください。'
    if (password.length < 8 || password.length > 64) {
      return 'パスワードは8〜64文字で入力してください。'
    }
    return ''
  }

  // イベント1: ログイン → G011（studentHome）
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
      await loginStudent(email.trim(), password)
      navigate('/home')
    } catch {
      // メールとパスワードのどちらが誤りかは区別しない（G001の仕様）
      setErrorMessage('メールアドレスまたはパスワードが違います。')
    } finally {
      setLoading(false)
    }
  }

  ---------- 本来の処理（ここまで） ---------- */

  return (
    <main className="page">
      <header className="login__header">
        <h1 className="login__title">
          TDU落とし物
          <br />
          投稿システム
        </h1>
        <p className="login__lead">落とし物の投稿・検索ができます</p>
      </header>

      <form className="login__form" onSubmit={handleSubmit} noValidate>
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

        <label className="form-label" htmlFor="password">
          パスワード
        </label>
        <input
          id="password"
          className="form-input"
          type="password"
          autoComplete="current-password"
          maxLength={64}
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMessage && (
          <p className="form-error" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          className="btn btn--primary login__submit"
          disabled={loading}
        >
          {loading ? 'ログイン中…' : 'ログイン'}
        </button>

        {/* イベント3: パスワードを忘れた方 → G007 */}
        <button
          type="button"
          className="btn btn--link login__reset"
          onClick={() => navigate('/reset-password/request')}
        >
          パスワードを忘れた方はこちら
        </button>

        {/* イベント2: 新規登録 → G002（studentSignUp） */}
        <button
          type="button"
          className="btn btn--secondary login__signup"
          onClick={() => navigate('/signup')}
        >
          新規登録
        </button>
      </form>
    </main>
  )
}
