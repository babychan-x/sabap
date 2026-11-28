import './StudentResetPassword.css'

// G009 パスワード再設定画面（studentResetPassword）
// 主なAPI（仮）: A-6 再設定リンクの検証（verifyResetToken。開いたとき）、A-7 パスワード再設定（resetPassword）。api/auth.js
// 11/28: 「試運転用」（入力に関係なく G010 へ進む）をやめて、リンクの検証・入力チェック・送信をつないだ

import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ScreenLayout from '../../../components/ScreenLayout'
import { resetPassword, verifyResetToken } from '../../../api/auth'

const ROUTES = {
  complete: '/reset-password/complete', // G010 再設定完了
  linkError: '/link-error', // G039 リンクエラー
}

// 新しいパスワードのルール（設計書 G009: 半角英字・数字を含む8〜64文字。使える記号は画面の説明文の !@_#$%&*）
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9!@_#$%&*]{8,64}$/

export default function StudentResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // 再設定用URLのトークン
  const token = searchParams.get('token')

  // 入力内容
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // パスワードの表示・非表示
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // エラーメッセージ
  const [errorMessage, setErrorMessage] = useState('')
  // 送信中は、ボタンを押せないようにする
  const [sending, setSending] = useState(false)

  // 開いたとき: 再設定用URLのトークンを検証する（A-6）。無効・期限切れなら G039 へ（CLAUDE.md §5 の型）
  useEffect(() => {
    let ignore = false // 画面を離れたあとに届いた結果は使わない
    verifyResetToken(token).catch(() => {
      if (!ignore) navigate(ROUTES.linkError, { replace: true })
    })
    return () => {
      ignore = true
    }
  }, [token, navigate])

  // イベント1: パスワードを変更する → G010（入力チェックは、前にコメントにしてあった処理を戻した）
  const changeButton = async (e) => {
    e.preventDefault()
    if (sending) return

    // 未入力チェック
    if (!password || !confirmPassword) {
      setErrorMessage('パスワードを入力してください。')
      return
    }

    // パスワードの形式チェック
    // 半角英字・数字をそれぞれ1文字以上含む8〜64文字
    // 使用可能な記号：! @ _ # $ % & *
    if (!PASSWORD_PATTERN.test(password)) {
      setErrorMessage(
        'パスワードは半角英字・数字を含む8〜64文字で入力してください。'
      )
      return
    }

    // 確認用パスワードとの一致チェック
    if (password !== confirmPassword) {
      setErrorMessage('パスワードが一致しません。')
      return
    }

    // 入力内容に問題がなければ、新しいパスワードを登録する（A-7）。
    // 使った再設定用URLを無効にするのは、サーバーの仕事（設計書 G009 イベント1）
    setErrorMessage('')
    setSending(true)
    try {
      await resetPassword(token, password)
      navigate(ROUTES.complete, { replace: true })
    } catch (err) {
      // 再設定用URLが期限切れ・無効のときは G039 へ（設計書 G009 イベント1）
      if (err.message === 'LINK_INVALID') {
        navigate(ROUTES.linkError, { replace: true })
        return
      }
      // それ以外（通信できなかったなど）は、この画面にエラーを出す（文言は設計書に記載なし。仮）
      setErrorMessage('パスワードを変更できませんでした。時間をおいて、もう一度お試しください。')
      setSending(false)
    }
  }

  return (
    <ScreenLayout
      contentClassName="page reset-password"
    >

      {/* 画面タイトル */}
      <h1 className="reset-password__header">
        パスワード再設定
      </h1>

      {/* 鍵アイコン */}
      <div className="reset-password__icon">
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
      <div className="reset-password__description">
        <h2>新しいパスワードを設定してください</h2>
        <p>
          半角英字・数字を含む8文字以上
          （記号 !@_#$%&* の使用可能）
        </p>
      </div>

      {/* パスワード入力フォーム */}
      <form
        className="reset-password__form"
        onSubmit={changeButton}
        noValidate
      >

        {/* エラーメッセージ */}
        {errorMessage && (
          <p
            className="form-error reset-password__error"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {/* 新しいパスワード */}
        <label
          htmlFor="password"
          className="form-label"
        >
          新しいパスワード
        </label>

        <div className="reset-password__input-wrapper">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            className="form-input"
            placeholder="新しいパスワードを入力"
            value={password}
            maxLength={64}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrorMessage('')
            }}
          />

          <button
            type="button"
            className="reset-password__toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword
                ? 'パスワードを非表示にする'
                : 'パスワードを表示する'
            }
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>

        {/* 新しいパスワード（確認用） */}
        <label
          htmlFor="confirmPassword"
          className="form-label reset-password__confirm-label"
        >
          新しいパスワード（確認用）
        </label>

        <div className="reset-password__input-wrapper">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            className="form-input"
            placeholder="もう一度入力してください"
            value={confirmPassword}
            maxLength={64}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              setErrorMessage('')
            }}
          />

          <button
            type="button"
            className="reset-password__toggle"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            aria-label={
              showConfirmPassword
                ? '確認用パスワードを非表示にする'
                : '確認用パスワードを表示する'
            }
          >
             {showConfirmPassword? <EyeOff size={22} />: <Eye size={22} />}
          </button>
        </div>

        {/* パスワード変更ボタン */}
        <div className="reset-password__footer">
          <button
            type="submit"
            className="btn btn--primary"
            disabled={sending}
          >
            {sending ? '変更中…' : 'パスワードを変更する'}
          </button>
        </div>
      </form>
    </ScreenLayout>
  )
}

