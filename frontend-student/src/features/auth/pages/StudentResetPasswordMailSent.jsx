import './StudentResetPasswordMailSent.css'
import { useNavigate } from 'react-router-dom'
import ScreenLayout from '../../../components/ScreenLayout'


// G008 メール送信完了画面（studentResetPasswordMailSent）

export default function StudentResetPasswordMailSent() {
  const navigate = useNavigate()

  // ログイン画面（G001）へ遷移
  const backToLogin = () => {
    navigate('/login')
  }

  return (
    <ScreenLayout
      contentClassName="page reset-password-mail-sent"
    >

      {/* メール送信完了メッセージ */}
      <div className="reset-password-mail-sent__message">
        <h1>
          メール送信が<br />
          完了しました
        </h1>

        <p>
          パスワード再設定用URLが送信されました。<br />
          届かない場合は時間を空けたのち再度ご送信ください。
        </p>
      </div>

      {/* ログイン画面へ戻る */}
      <div className="reset-password-mail-sent__footer">
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

