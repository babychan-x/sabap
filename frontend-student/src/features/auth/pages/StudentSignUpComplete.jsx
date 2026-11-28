import './StudentSignUpComplete.css'

import { useNavigate } from 'react-router-dom'
import ScreenLayout from '../../../components/ScreenLayout'

export default function StudentSignUpComplete() {
  const navigate = useNavigate()

  // ログイン画面（G001）へ遷移
  const backToLogin = () => {
    navigate('/login')
  }

  return (
    <ScreenLayout
      steps={2}
      stepsLabel="登録の手順"
      contentClassName="page signup-complete"
    >
      <h1 className="signup-complete__header">
        新規登録完了
      </h1>


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
    </ScreenLayout>
  )
}
