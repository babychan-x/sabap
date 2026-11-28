import './StudentResetPassword.css'

// G009 パスワード再設定画面（studentResetPassword）

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ScreenLayout from '../../../components/ScreenLayout'

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

  // パスワード変更ボタン押下時
  const changeButton = (e) => {
    e.preventDefault()

    // ==========================================
    // 試運転用：入力内容に関係なくG010へ遷移
    // ==========================================
    navigate('/reset-password/complete')

    // ==========================================
    // 本来の処理（試運転中はコメントアウト）
    // ==========================================

    /*
    // 未入力チェック
    if (!password || !confirmPassword) {
      setErrorMessage('パスワードを入力してください。')
      return
    }

    // パスワードの形式チェック
    // 半角英字・数字をそれぞれ1文字以上含む8〜64文字
    // 使用可能な記号：! @ _ # $ % & *
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9!@_#$%&*]{8,64}$/

    if (!passwordPattern.test(password)) {
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

    // 入力内容に問題がなければエラーを消す
    setErrorMessage('')

    // TODO:
    // バックエンドと連携して以下を実施する
    // 1. tokenの有効性・有効期限を確認
    // 2. 新しいパスワードを登録
    // 3. 使用済みの再設定用URLを無効化
    // 4. 成功した場合のみG010へ遷移
    // 5. tokenが無効・期限切れの場合はG039へ遷移

    // API連携後に有効化する
    // navigate('/reset-password/complete')
    */
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
          >
            パスワードを変更する
          </button>
        </div>
      </form>
    </ScreenLayout>
  )
}

