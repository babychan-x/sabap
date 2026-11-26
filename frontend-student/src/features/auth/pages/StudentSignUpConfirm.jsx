import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { registerStudent } from '../../../api/auth'
import ProgressSteps from '../../../components/ProgressSteps'
import './StudentSignUpConfirm.css'

// 学籍番号の取り出し（仮）。
// 設計書は「入力内容から学籍番号を取り出して表示」とあるが、取り出し方は書いていない。
// 仮に「メールアドレスの @ より前」とする。本当のルールが分かったら、ここだけ直す。
function extractStudentNumber(email) {
  return email.split('@')[0]
}

// G005 情報確認画面（studentSignUpConfirm）
// 外部設計書 第2.0版 G005 に対応。表示するだけ。確定ボタンでAPIを呼ぶ。
export default function StudentSignUpConfirm() {
  const navigate = useNavigate()
  // G004 から渡された入力内容（token, email, nickname, password, icon）
  const { state: data } = useLocation()
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // URLを直接開いたなど、入力内容が無いときは、最初の画面へ戻す
  if (!data) {
    return <Navigate to="/login" replace />
  }

  const icon = data.icon

  // イベント2: 登録する → G006（studentSignUpComplete）
  async function handleRegister() {
    setLoading(true)
    setErrorMessage('')
    try {
      await registerStudent({
        token: data.token,
        nickname: data.nickname,
        password: data.password,
        icon: data.icon.id,
      })
      // replace: 履歴のこの画面を置き換える（戻るボタンでパスワード入りの画面に戻らないため）
      navigate('/signup/complete', { replace: true })
    } catch (err) {
      if (err.message === 'LINK_INVALID') {
        // 設計書: 期限切れ・無効ならリンクエラー画面へ
        navigate('/link-error', { replace: true })
      } else {
        setErrorMessage('登録できませんでした。時間を空けて再度お試しください。')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page">
      {/* 進行状況（見た目は G029 と同じ共通部品 ProgressSteps） */}
      <div className="signup-confirm__steps">
        <ProgressSteps current={1} label="登録の手順" />
      </div>
      <h1 className="signup-confirm__title">入力内容の確認</h1>

      <dl className="signup-confirm__list">
        <div className="signup-confirm__row">
          <dt>ニックネーム</dt>
          <dd>{data.nickname}</dd>
        </div>
        <div className="signup-confirm__row">
          <dt>メールアドレス</dt>
          <dd>{data.email}</dd>
        </div>
        <div className="signup-confirm__row">
          <dt>学籍番号</dt>
          <dd>{extractStudentNumber(data.email)}</dd>
        </div>
        <div className="signup-confirm__row">
          <dt>パスワード</dt>
          <dd>{'●'.repeat(data.password.length)}</dd>
        </div>
        <div className="signup-confirm__row">
          <dt>アイコン</dt>
          <dd>
            <span
              className="signup-confirm__icon"
              style={{ background: icon?.color }}
            >
              {icon?.label}
            </span>
          </dd>
        </div>
      </dl>

      {errorMessage && (
        <p className="form-error" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="button"
        className="btn btn--primary signup-confirm__submit"
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? '登録中…' : '登録する'}
      </button>

      {/* イベント1: 戻る → G004（studentSignUpForm）。入力内容を state で G004 に返す */}
      <button
        type="button"
        className="btn btn--secondary signup-confirm__back"
        onClick={() =>
          navigate(`/signup/form?token=${encodeURIComponent(data.token)}`, {
            state: data,
          })
        }
        disabled={loading}
      >
        戻る
      </button>
    </main>
  )
}
