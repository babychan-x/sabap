// G031 編集完了画面（studentMyPostEditComplete）
// 主なAPI（仮）: なし（G030 で編集を保存したあとに表示するだけの画面）
// 置き場所: src/features/mypage/pages/StudentMyPostEditComplete.jsx（App.jsx: /mypage/posts/:id/edit/complete）
// 見た目は G026（StudentChangePasswordComplete）・G020（StudentApplyComplete）の完了画面に合わせている。

import { useNavigate } from 'react-router-dom'
import ProgressSteps from '../../../components/ProgressSteps'
import './StudentMyPostEditComplete.css'

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  myPostList: '/mypage/posts', // G027 自分の投稿一覧
}

export default function StudentMyPostEditComplete() {
  const navigate = useNavigate()

  return (
    <div className="my-post-edit-complete-page-wrapper">
      {/* スマホ枠 */}
      <div className="my-post-edit-complete-mobile-container">
        {/* ヘッダー（完了画面なので戻るボタンはなし。タイトルは旧スライドの文言） */}
        <header className="my-post-edit-complete-header">
          <h1 className="my-post-edit-complete-title">編集完了</h1>
        </header>

        {/* 入出力項目1: 進行状況表示（この画面では「完了」を強調） */}
        <ProgressSteps current={2} label="編集の手順" />

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

        {/* 入出力項目2: 自分の投稿一覧に戻る（イベント1 → G027 studentMyPostList） */}
        <div className="my-post-edit-complete-footer">
          <button type="button" className="my-post-edit-complete-btn" onClick={() => navigate(ROUTES.myPostList)}>
            自分の投稿一覧に戻る
          </button>
        </div>
      </div>
    </div>
  )
}
