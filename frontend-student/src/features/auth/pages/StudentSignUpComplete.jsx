import './StudentSignUpComplete.css'

import { useNavigate } from 'react-router-dom'

export default function StudentSignUpComplete() {
  const navigate = useNavigate()

  // ログイン画面（G001）へ遷移
  const backToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="page signup-complete">
      <h1 className="signup-complete__header">
        新規登録完了
      </h1>

      {/* 登録の進行状況 */}
      <div className="signup-complete__steps">
        <div className="signup-complete__step">
          <span className="signup-complete__circle">1</span>
          <span>入力</span>
        </div>

        <div className="signup-complete__line" />

        <div className="signup-complete__step">
          <span className="signup-complete__circle">2</span>
          <span>確認</span>
        </div>

        <div className="signup-complete__line" />

        <div className="signup-complete__step">
          <span className="signup-complete__circle signup-complete__circle--active">
            3
          </span>
          <span>完了</span>
        </div>
      </div>

      {/* 登録完了メッセージ */}
      <div className="signup-complete__message">
        <h2>
          新規登録が<br />
          完了しました
        </h2>
        <p>
          新規登録が正常に完了しました。<br />
          今後システムをご利用いただけます。
        </p>
      </div>

      {/* ログイン画面へ戻る */}
      <div className="signup-complete__footer">
        <button
          type="button"
          className="btn btn--primary"
          onClick={backToLogin}
        >
          ログイン画面に戻る
        </button>
      </div>
    </div>
  )
}
