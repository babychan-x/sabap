import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { verifySignUpToken } from '../../../api/auth'
import ProgressSteps from '../../../components/ProgressSteps'
import './StudentSignUpForm.css'

// アイコンの選択肢（仮）。
// 外部設計書には「複数のアイコン画像から1つを選択」とあるだけで、画像と個数は未定。
// 本物の画像が決まったら、ここだけ差し替える。
const ICONS = [
  { id: 'icon1', label: '1', color: '#f4a261' },
  { id: 'icon2', label: '2', color: '#e9c46a' },
  { id: 'icon3', label: '3', color: '#8ab17d' },
  { id: 'icon4', label: '4', color: '#5fa8d3' },
  { id: 'icon5', label: '5', color: '#9b8ac4' },
  { id: 'icon6', label: '6', color: '#d98fa7' },
]

// G004 情報登録画面（studentSignUpForm）
// 外部設計書 第2.0版 G004 に対応。メールのリンク（?token=...）から開く画面。
export default function StudentSignUpForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // G005 から「戻る」で来たとき、入力内容が location.state に入っている（なければ空）
  const { state } = useLocation()
  const token = searchParams.get('token') ?? ''
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState(state?.nickname ?? '')
  const [password, setPassword] = useState(state?.password ?? '')
  const [passwordConfirm, setPasswordConfirm] = useState(state?.password ?? '')
  const [icon, setIcon] = useState(state?.icon?.id ?? '')
  const [errorMessage, setErrorMessage] = useState('')
  const [checking, setChecking] = useState(true)

  // イベント2: 画面を開いた時点でリンクの有効性を確認。無効なら G039（studentLinkError）へ
  useEffect(() => {
    verifySignUpToken(token)
      .then((result) => {
        setEmail(result.email)
        setChecking(false)
      })
      .catch(() => navigate('/link-error', { replace: true }))
  }, [token, navigate])

  // 入力チェック（サーバー側でも同じチェックをする）
  function validate() {
    if (nickname.trim() === '') return 'ニックネームを入力してください。'
    if (nickname.length > 20) return 'ニックネームは20文字以下で入力してください。'
    if (password === '') return 'パスワードを入力してください。'
    if (password.length < 8 || password.length > 64) {
      return 'パスワードは8〜64文字で入力してください。'
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return 'パスワードは半角英字と数字を含めてください。'
    }
    if (passwordConfirm === '') return '確認用パスワードを入力してください。'
    if (password !== passwordConfirm) return 'パスワードが一致しません。'
    if (icon === '') return 'アイコンを選択してください。'
    return ''
  }

  // イベント1: 登録する → G005（studentSignUpConfirm）
  function handleSubmit(e) {
    e.preventDefault()
    const message = validate()
    if (message) {
      setErrorMessage(message)
      return
    }
    // 入力内容を、次の画面（G005）へ渡す。URLには載せない（パスワードが含まれるため）
    navigate('/signup/confirm', {
      state: {
        token,
        email,
        nickname: nickname.trim(),
        password,
        icon: ICONS.find((item) => item.id === icon),
      },
    })
  }

  if (checking) {
    return (
      <main className="page">
        <p className="signup-form__checking">リンクを確認しています…</p>
      </main>
    )
  }

  return (
    <main className="page">
      {/* 進行状況（見た目は G029 と同じ共通部品 ProgressSteps） */}
      <div className="signup-form__steps">
        <ProgressSteps current={0} label="登録の手順" />
      </div>
      <h1 className="signup-form__title">情報登録</h1>

      <form onSubmit={handleSubmit} noValidate>
        <label className="form-label" htmlFor="nickname">
          ニックネーム
        </label>
        <input
          id="nickname"
          className="form-input"
          type="text"
          maxLength={20}
          placeholder="他の利用者に表示される名前"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <label className="form-label" htmlFor="password">
          パスワード
        </label>
        <input
          id="password"
          className="form-input"
          type="password"
          autoComplete="new-password"
          maxLength={64}
          placeholder="半角英字・数字を含む8文字以上"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="form-label" htmlFor="passwordConfirm">
          パスワード（確認用）
        </label>
        <input
          id="passwordConfirm"
          className="form-input"
          type="password"
          autoComplete="new-password"
          maxLength={64}
          placeholder="もう一度入力"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />

        <fieldset className="signup-form__icons">
          <legend className="form-label">アイコン</legend>
          <div className="signup-form__icon-list">
            {ICONS.map((item) => (
              <label key={item.id} className="signup-form__icon">
                <input
                  type="radio"
                  name="icon"
                  value={item.id}
                  checked={icon === item.id}
                  onChange={() => setIcon(item.id)}
                />
                <span
                  className="signup-form__icon-image"
                  style={{ background: item.color }}
                >
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {errorMessage && (
          <p className="form-error" role="alert">
            {errorMessage}
          </p>
        )}

        <button type="submit" className="btn btn--primary signup-form__submit">
          登録する
        </button>
      </form>
    </main>
  )
}
