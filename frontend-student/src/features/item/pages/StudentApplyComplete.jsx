// G020 申請完了画面（studentApplyComplete）
// 主なAPI（仮）: なし（G019 で申請を登録したあとに表示するだけの画面）
// 置き場所: src/features/item/pages/StudentApplyComplete.jsx（App.jsx: /items/:id/apply/complete）
// 見た目は G026（StudentChangePasswordComplete）の完了画面に合わせている。

import { useNavigate } from 'react-router-dom'
import './StudentApplyComplete.css'
import ScreenLayout from '../../../components/ScreenLayout'

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  home: '/home', // G011 投稿一覧
}

export default function StudentApplyComplete() {
  const navigate = useNavigate()

  return (
    <ScreenLayout
      title="申請完了"
      steps={2}
      stepsLabel="申請の手順"
      footer={
        <div className="apply-complete-footer">
          <button type="button" className="apply-complete-btn" onClick={() => navigate(ROUTES.home)}>
            トップに戻る
          </button>
        </div>
      }
    >
      {/* メッセージ（文言は設計書に記載なし。旧スライドの文言） */}
      <main className="apply-complete-main">
        <div className="apply-complete-icon" aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="5 12.5 10 17.5 19 7.5"></polyline>
          </svg>
        </div>
        <h2 className="apply-complete-heading">
          申請が
          <br />
          完了しました
        </h2>
        <p className="apply-complete-text">
          申請内容は、マイページの
          <br />
          「受け取り申請一覧」から確認できます。
        </p>
      </main>

    </ScreenLayout>
  )
}
