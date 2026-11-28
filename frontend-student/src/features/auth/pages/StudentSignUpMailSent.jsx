import { useNavigate } from 'react-router-dom'
import './StudentSignUpMailSent.css'
import ScreenLayout from '../../../components/ScreenLayout'

// G003 メール送信完了画面（studentSignUpMailSent）
// 外部設計書 第2.0版 G003 に対応。入力欄はなく、ボタンが1つだけの画面。
export default function StudentSignUpMailSent() {
  const navigate = useNavigate()

  return (
    <ScreenLayout
      contentClassName="page"
    >
      <h1 className="mail-sent__title">
        メール送信が
        <br />
        完了しました
      </h1>
      <p className="mail-sent__text">
        パスワード設定用URLが送信されました。
        <br />
        届かない場合は時間を空けたのち
        <br />
        再度ご送信ください。
      </p>

      {/* イベント1: ログイン画面に戻る → G001（studentLogin） */}
      <button
        type="button"
        className="btn btn--primary"
        onClick={() => navigate('/login')}
      >
        ログイン画面に戻る
      </button>
    </ScreenLayout>
  )
}