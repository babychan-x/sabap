import './StudentMyPage.css'

// G024 マイページ画面（studentMyPage）
// 主なAPI（仮）: F-1 マイページ（getMe。api/me.js）。「新着〇件」は E-1 受け取り申請一覧（getApplications）から数える
// 11/28: 画面の中の仮データをやめて、api から取る形にした（仮データは mock/me.js・mock/applications.js）

import { useEffect, useState } from 'react'
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
import ScreenLayout from '../../../components/ScreenLayout'
import { getMe } from '../../../api/me'
import { getApplications, isNewResult } from '../../../api/applications'

export default function StudentMyPage() {
  const navigate = useNavigate()

  // ログイン中の人の情報（F-1）。me = { nickname, iconNumber }。読み込むまでは null
  const [me, setMe] = useState(null)
  const [error, setError] = useState('')
  // 受け取り申請一覧の「新着〇件」= G033 で NEW マークが付く申請（結果が出ていて、まだ見ていない申請）の数
  // ※ 「新着〇件」は外部設計書に無い（前の画面にあったので残した。G024-3）
  const [newRequestCount, setNewRequestCount] = useState(0)

  useEffect(() => {
    let ignore = false // 画面を離れたあとに届いた結果は使わない
    getMe()
      .then((data) => {
        if (!ignore) setMe(data)
      })
      .catch(() => {
        if (!ignore) setError('読み込めませんでした。時間をおいて、もう一度お試しください。')
      })
    // 件数は読めなくても、画面は使えるので、エラーは出さない（0件のまま。仮）
    getApplications()
      .then((applications) => {
        if (!ignore) setNewRequestCount(applications.filter(isNewResult).length)
      })
      .catch(() => {})
    return () => {
      ignore = true
    }
  }, [])

  const nickname = me ? me.nickname : ''
  // アイコンの画像は未定（users.icon_number は番号だけ）。いまは全員、仮の人型アイコンを出す
  const userIcon = null

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
    <ScreenLayout
      title="マイページ"
      bottomNav="mypage"
      contentClassName="page mypage"
    >

      {/* スクロール可能なコンテンツ部分 */}
      <main className="mypage__content">

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

          {/* ニックネーム（読み込み中は「…」） */}
          <p className="mypage__nickname">
            ニックネーム：{me ? nickname : '…'}
          </p>

        </div>

        {/* 読み込めなかったとき */}
        {error && (
          <p className="mypage__error" role="alert">
            {error}
          </p>
        )}

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

    </ScreenLayout>
  )
}

