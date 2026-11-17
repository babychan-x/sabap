import { useParams } from 'react-router-dom'
import './StudentItemDetail.css'

// G017 落とし物詳細画面（studentItemDetail）
// ※ 仮の画面。外部設計書 G017 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: B-2
export default function StudentItemDetail() {
  // URL の :id の部分を読み取る（例: /items/3 → "3"）
  const { id } = useParams()

  return (
    <main className="page">
      <h1>落とし物詳細（G017・仮）</h1>
      <p>この画面はこれから作ります。</p>
      {/* ルーティング確認用の表示。中身を作るときに消す */}
      <p>id: {id}</p>
    </main>
  )
}
