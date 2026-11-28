import './StudentLogoutConfirm.css'

// G038 ログアウト確認画面

import { useNavigate } from 'react-router-dom'
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

  // イベント2：ログアウト
  const logout = () => {

    // 試運転用：ログイン画面へ遷移
    navigate(ROUTES.login, {
      replace: true,
    })

    /*
    【認証機能との連携後の処理】

    1. サーバー側でログアウト処理を行う。
    2. セッションや認証トークンを無効化する。
    3. フロントエンドのログイン状態を破棄する。
    4. ログイン画面（G001）へ遷移する。

    navigate(ROUTES.login, {
      replace: true,
    })

    ※認証機能との連携時には、
      上の試運転用のnavigateを削除する。
    */
  }

  return (
    <ScreenLayout
      title="ログアウト"
      onBack={backToMyPage}
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
        >
          ログアウト
        </button>
      </div>

    </ScreenLayout>
  )
}
