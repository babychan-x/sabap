import './StudentLogoutConfirm.css'

// G038 ログアウト確認画面
// 主なAPI（仮）: A-9 ログアウト（logoutStudent。api/auth.js）

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutStudent } from '../../../api/auth'
import { DoorOpen } from 'lucide-react'
import ScreenLayout from '../../../components/ScreenLayout'

const ROUTES = {
  myPage: '/mypage',
  login: '/login',
}

export default function StudentLogoutConfirm() {
  const navigate = useNavigate()

  // イベント1：ログアウトせずにマイページへ戻る
  const backToMyPage = () => {
    navigate(ROUTES.myPage, {
      replace: true,
    })
  }

  // ログアウト中は、ボタンを押せないようにする
  const [loggingOut, setLoggingOut] = useState(false)

  // イベント2：ログアウト → G001
  //   サーバーでログイン状態を消して（A-9）、ログイン画面へ（11/28 に「試運転用」をやめてつないだ）
  //   ※ 認証方式（セッションか JWT か）が未定。JWT なら、ここでフロントに持っているトークンも消す
  const logout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await logoutStudent()
    } catch {
      // 失敗しても（通信できなかったなど）、ログイン画面へ進む（仮）。
      //   この画面に残しても、利用者にできることが無いため
    }
    navigate(ROUTES.login, {
      replace: true,
    })
  }

  return (
    <ScreenLayout
      title="ログアウト"
      onBack={backToMyPage}
      backDisabled={loggingOut}
      contentClassName="page logout-confirm"
    >


      {/* ログアウト確認メッセージ */}
      <main className="logout-confirm__content">

        {/* ログアウトアイコン */}
        <div className="logout-confirm__icon">
          <DoorOpen
            size={88}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        <h2 className="logout-confirm__heading">
          ログアウトしますか？
        </h2>

        <p className="logout-confirm__description">
          ログアウトすると、この端末では
          <br />
          再度ログインするまでご利用いただけません。
        </p>

      </main>

      {/* ログアウトボタン */}
      <div className="logout-confirm__footer">
        <button
          type="button"
          id="logoutButton"
          className="btn btn--primary"
          onClick={logout}
          disabled={loggingOut}
        >
          {loggingOut ? 'ログアウト中…' : 'ログアウト'}
        </button>
      </div>

    </ScreenLayout>
  )
}
