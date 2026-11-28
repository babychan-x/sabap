import './StudentResetPasswordComplete.css'

// G010 再設定完了画面（studentResetPasswordComplete）

import { useNavigate } from 'react-router-dom'
import ScreenLayout from '../../../components/ScreenLayout'

export default function StudentResetPasswordComplete() {
  const navigate = useNavigate()

  // ログイン画面（G001）へ遷移
  const backToLogin = () => {
    navigate('/login')
  }

  return (
    <ScreenLayout
      contentClassName="page reset-password-complete"
    >

      {/* 画面タイトル */}
      <h1 className="reset-password-complete__header">
        再設定完了
      </h1>

      {/* 再設定完了メッセージ */}
      <div className="reset-password-complete__message">
        <h2>
          再設定が<br />
          完了しました
        </h2>

        <p>
          パスワードの再設定が正常に完了しました。<br />
          引き続きシステムをご利用いただけます。
        </p>
      </div>

      {/* ログイン画面へ戻る */}
      <div className="reset-password-complete__footer">
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

