import { useSearchParams } from 'react-router-dom'
import './StudentSearchResult.css'

// G016 検索結果一覧画面（studentSearchResult）
// ※ 仮の画面。外部設計書 G016 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: B-1
export default function StudentSearchResult() {
  // URL の ?keyword=〇〇 の部分を読み取る
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword')

  return (
    <main className="page">
      <h1>検索結果一覧（G016・仮）</h1>
      <p>この画面はこれから作ります。</p>
      {/* ルーティング確認用の表示。中身を作るときに消す */}
      <p>keyword: {keyword ?? '（なし）'}</p>
    </main>
  )
}
