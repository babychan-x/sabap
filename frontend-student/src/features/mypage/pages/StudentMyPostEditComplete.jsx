// G031 編集完了画面（studentMyPostEditComplete）
// 主なAPI（仮）: なし（G030 で編集を保存したあとに表示するだけの画面）
// 置き場所: src/features/mypage/pages/StudentMyPostEditComplete.jsx（App.jsx: /mypage/posts/:id/edit/complete）
// 見た目は G026（StudentChangePasswordComplete）・G020（StudentApplyComplete）の完了画面に合わせている。

import { useNavigate } from 'react-router-dom'
import './StudentMyPostEditComplete.css'
import ScreenLayout from '../../../components/ScreenLayout'

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  myPostList: '/mypage/posts', // G027 自分の投稿一覧
}

export default function StudentMyPostEditComplete() {
  const navigate = useNavigate()

  return (
    <ScreenLayout
      title="編集完了"
      steps={2}
      stepsLabel="編集の手順"
      footer={
        <div className="my-post-edit-complete-footer">
          <button type="button" className="my-post-edit-complete-btn" onClick={() => navigate(ROUTES.myPostList)}>
            自分の投稿一覧に戻る
          </button>
        </div>
      }
    >
      {/* メッセージ（文言は設計書に記載なし。旧スライドの文言をもとにした・仮） */}
      <main className="my-post-edit-complete-main">
        <div className="my-post-edit-complete-icon" aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="5 12.5 10 17.5 19 7.5"></polyline>
          </svg>
        </div>
        <h2 className="my-post-edit-complete-heading">
          編集が
          <br />
          完了しました
        </h2>
        <p className="my-post-edit-complete-text">
          投稿内容は、マイページの「自分の投稿一覧」から
          <br />
          いつでも編集・削除できます。
        </p>
      </main>

    </ScreenLayout>
  )
}
