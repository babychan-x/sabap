// G023 投稿完了画面（studentPostItemComplete）
// 主なAPI（仮）: なし（G022 で投稿したあとに表示するだけの画面）
// 置き場所: src/features/item/pages/StudentPostItemComplete.jsx（App.jsx: /post/complete）
// 見た目・アニメーションは G031（StudentMyPostEditComplete。編集完了画面）と同じにした（2026/11/28）。

import { useNavigate } from 'react-router-dom'
import './StudentPostItemComplete.css'
import ScreenLayout from '../../../components/ScreenLayout'

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  home: '/home', // G011 投稿一覧（ホーム）
}

export default function StudentPostItemComplete() {
  const navigate = useNavigate()

  // イベント1: トップに戻る → G011（studentHome）
  const backToTop = () => {
    navigate(ROUTES.home)
  }

  return (
    <ScreenLayout
      title="投稿完了"
      steps={2}
      stepsLabel="投稿の手順"
      footer={
        <div className="post-complete-footer">
          <button id="backToTop" type="button" className="post-complete-btn" onClick={backToTop}>
            トップに戻る
          </button>
        </div>
      }
    >
      {/* 投稿完了メッセージ */}
      <main className="post-complete-main">
        <div className="post-complete-icon" aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="5 12.5 10 17.5 19 7.5"></polyline>
          </svg>
        </div>
        <h2 className="post-complete-heading">
          投稿が
          <br />
          完了しました
        </h2>
        <p className="post-complete-text">
          投稿内容はマイページの「投稿一覧」から
          <br />
          いつでも編集・削除が可能です。
        </p>
      </main>
    </ScreenLayout>
  )
}
