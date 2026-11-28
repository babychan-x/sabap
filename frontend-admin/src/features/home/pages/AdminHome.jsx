// G048 管理者ホーム画面（adminHome）
// 主なAPI（仮）: H-7 ホーム用の情報（getMe。api/me.js。管理者の氏名・メールアドレス）
// 置き場所: src/features/home/pages/AdminHome.jsx（App.jsx: /home）
// 見た目: 旧スライド a-09（レイアウトの参考。メニューのカードを3列に並べる）。色・カードは管理者用の共通 CSS。
// 11/28 作成（ユーザーとClaude）

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminHeader from '../../../components/AdminHeader'
import { getMe } from '../../../api/me'
import './AdminHome.css'

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  postList: '/posts', // G060 投稿一覧
  applyList: '/applications', // G049 申請一覧
  handoverList: '/handovers', // G053 受け渡し一覧
  messageList: '/messages', // G051 メッセージ一覧
  invite: '/invite', // G055 招待
  deactivate: '/deactivate', // G057 無効化先入力
  changePassword: '/password', // G062 パスワード再設定
  logout: '/logout', // G064 ログアウト確認
}

// ---------------------------------------------------------------
// メニューのアイコン（線の絵。旧スライド a-09 の絵をもとにした）
// ---------------------------------------------------------------
const ICON_PROPS = {
  width: 36,
  height: 36,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const ICONS = {
  // 紙飛行機（投稿一覧）
  send: (
    <svg {...ICON_PROPS}>
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  ),
  // 吹き出し（受け取り申請一覧）
  chat: (
    <svg {...ICON_PROPS}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      <line x1="8" y1="10" x2="8.01" y2="10"></line>
      <line x1="12" y1="10" x2="12.01" y2="10"></line>
      <line x1="16" y1="10" x2="16.01" y2="10"></line>
    </svg>
  ),
  // 荷札（受け渡し物一覧）
  tag: (
    <svg {...ICON_PROPS}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
      <line x1="7" y1="7" x2="7.01" y2="7"></line>
    </svg>
  ),
  // 封筒（感謝メッセージ一覧）
  mail: (
    <svg {...ICON_PROPS}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  // 人と＋（管理者アカウントの招待）
  userPlus: (
    <svg {...ICON_PROPS}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="8.5" cy="7" r="4"></circle>
      <line x1="20" y1="8" x2="20" y2="14"></line>
      <line x1="23" y1="11" x2="17" y2="11"></line>
    </svg>
  ),
  // 人と×（管理者アカウントの無効化）
  userX: (
    <svg {...ICON_PROPS}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="8.5" cy="7" r="4"></circle>
      <line x1="18" y1="8" x2="23" y2="13"></line>
      <line x1="23" y1="8" x2="18" y2="13"></line>
    </svg>
  ),
  // 鍵（パスワード再設定）
  key: (
    <svg {...ICON_PROPS}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
    </svg>
  ),
  // 扉と矢印（ログアウト）
  logout: (
    <svg {...ICON_PROPS}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  ),
}

// ---------------------------------------------------------------
// メニュー（項目3〜10。並び順は設計書の入出力項目一覧表のとおり）
//   label: ボタンの文字（設計書の項目名）、description: 補足の1行（設計書に記載なし・仮）
// ---------------------------------------------------------------
const MENUS = [
  { id: 'goPostList', label: '投稿一覧', description: '落とし物の投稿を確認・非表示にする', icon: 'send', to: ROUTES.postList }, // イベント1 → G060
  { id: 'goApplyList', label: '受け取り申請一覧', description: '申請を確認して、承認・却下する', icon: 'chat', to: ROUTES.applyList }, // イベント2 → G049
  { id: 'goHandoverList', label: '受け渡し物一覧', description: '承認済みの落とし物を受け渡す', icon: 'tag', to: ROUTES.handoverList }, // イベント3 → G053
  { id: 'goMessageList', label: '感謝メッセージ一覧', description: '送られたメッセージを確認する', icon: 'mail', to: ROUTES.messageList }, // イベント4 → G051
  { id: 'goInviteAdmin', label: '管理者アカウントの招待', description: '新しい管理者に登録用のメールを送る', icon: 'userPlus', to: ROUTES.invite }, // イベント5 → G055
  { id: 'goDeactivateAdmin', label: '管理者アカウントの無効化', description: '管理者がログインできないようにする', icon: 'userX', to: ROUTES.deactivate }, // イベント6 → G057
  { id: 'goChangePassword', label: 'パスワード再設定', description: '自分のパスワードを変更する', icon: 'key', to: ROUTES.changePassword }, // イベント7 → G062
  { id: 'logoutButton', label: 'ログアウト', description: 'この端末からログアウトする', icon: 'logout', to: ROUTES.logout, muted: true }, // イベント8 → G064
]

export default function AdminHome() {
  const navigate = useNavigate()

  // ログイン中の管理者（H-7）。me = { adminName, email }。読み込むまでは null
  const [me, setMe] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false // 画面を離れたあとに届いた結果は使わない
    getMe()
      .then((data) => {
        if (!ignore) setMe(data)
      })
      .catch(() => {
        if (!ignore) setError('管理者の情報を読み込めませんでした。時間をおいて、もう一度お試しください。')
      })
    return () => {
      ignore = true
    }
  }, [])

  // 項目1: 「○○ のホーム」（設計書の形）。項目2: メールアドレス
  const title = me ? `${me.adminName} のホーム` : 'ホーム'
  const subtitle = me ? me.email : error ? '' : '読み込み中…'

  return (
    <div className="admin-page">
      {/* ホームなので、戻るボタンは出さない */}
      <AdminHeader title={title} subtitle={subtitle} />

      <main className="admin-main">
        <div className="admin-container">
          {error && (
            <p className="admin-error-summary" role="alert">
              {error}
            </p>
          )}

          <nav aria-label="管理メニュー">
            <ul className="admin-grid admin-grid-3 home-menu">
              {MENUS.map((menu) => (
                <li key={menu.id}>
                  <button
                    type="button"
                    id={menu.id}
                    className={`home-menu-card ${menu.muted ? 'muted' : ''}`}
                    onClick={() => navigate(menu.to)}
                  >
                    <span className="home-menu-icon">{ICONS[menu.icon]}</span>
                    <span className="home-menu-label">{menu.label}</span>
                    <span className="home-menu-description">{menu.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
    </div>
  )
}
