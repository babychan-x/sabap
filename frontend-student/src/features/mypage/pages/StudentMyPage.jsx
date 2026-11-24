import './StudentMyPage.css'

// G024 マイページ画面（studentMyPage）

import { useNavigate } from 'react-router-dom'
import {
  UserRound,
  Send,
  MessageSquare,
  MailOpen,
  KeyRound,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import BottomNav from '../../../components/BottomNav'

export default function StudentMyPage() {
  const navigate = useNavigate()

  // ユーザー情報（試運転用の仮データ）
  // TODO: バックエンドからログイン中のユーザー情報を取得する
  const nickname = 'りんご'
  const userIcon = null
  const newRequestCount = 2

  // 自分の投稿一覧（G027）
  const myPost = () => {
    navigate('/mypage/posts')
  }

  // 受け取り申請一覧（G033）
  const myRequests = () => {
    navigate('/mypage/applications')
  }

  // 感謝メッセージボックス（G032）
  const thankYouMessages = () => {
    navigate('/mypage/messages')
  }

  // パスワード再設定（G025）
  const resetPassword = () => {
    navigate('/mypage/password')
  }

  // ログアウト確認画面（G038）
  const logout = () => {
    navigate('/mypage/logout')
  }

  return (
    <div className="page mypage">

      {/* スクロール可能なコンテンツ部分 */}
      <main className="mypage__content">

        {/* 画面タイトル */}
        <h1 className="mypage__header">
          マイページ
        </h1>

        {/* ユーザー情報 */}
        <div className="mypage__profile">

          {/* ユーザーアイコン */}
          <div className="mypage__user-icon">
            {userIcon ? (
              <img
                src={userIcon}
                alt="ユーザーアイコン"
              />
            ) : (
              <UserRound size={48} aria-hidden="true" />
            )}
          </div>

          {/* ニックネーム */}
          <p className="mypage__nickname">
            ニックネーム：{nickname}
          </p>

        </div>

        {/* メニュー一覧 */}
        <div className="mypage__menu">

          {/* 自分の投稿一覧 */}
          <button
            type="button"
            className="mypage__menu-button"
            onClick={myPost}
          >
            <Send className="mypage__menu-icon" />
            <span className="mypage__menu-label">
              自分の投稿一覧
            </span>
            <ChevronRight className="mypage__arrow" />
          </button>

          {/* 受け取り申請一覧 */}
          <button
            type="button"
            className="mypage__menu-button"
            onClick={myRequests}
          >
            <MessageSquare className="mypage__menu-icon" />
            <span className="mypage__menu-label">
              受け取り申請一覧
            </span>

            {/* 新着がある場合のみ件数を表示 */}
            {newRequestCount > 0 && (
              <span className="mypage__new-count">
                新着{newRequestCount}件
              </span>
            )}

            <ChevronRight className="mypage__arrow" />
          </button>

          {/* 感謝メッセージボックス */}
          <button
            type="button"
            className="mypage__menu-button"
            onClick={thankYouMessages}
          >
            <MailOpen className="mypage__menu-icon" />
            <span className="mypage__menu-label">
              感謝メッセージボックス
            </span>
            <ChevronRight className="mypage__arrow" />
          </button>

          {/* パスワード再設定 */}
          <button
            type="button"
            className="mypage__menu-button"
            onClick={resetPassword}
          >
            <KeyRound className="mypage__menu-icon" />
            <span className="mypage__menu-label">
              パスワード再設定
            </span>
            <ChevronRight className="mypage__arrow" />
          </button>

          {/* ログアウト */}
          <button
            type="button"
            className="mypage__menu-button"
            onClick={logout}
          >
            <LogOut className="mypage__menu-icon" />
            <span className="mypage__menu-label">
              ログアウト
            </span>
            <ChevronRight className="mypage__arrow" />
          </button>

        </div>
      </main>

      {/* 共通の下部ナビゲーション */}
      <BottomNav active="mypage" />

    </div>
  )
}

