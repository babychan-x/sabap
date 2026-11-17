import { useParams } from 'react-router-dom'
import './StudentMessageDetail.css'

// G013 メッセージ詳細画面（studentMessageDetail）
// ※ 仮の画面。外部設計書 G013 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: D-2
export default function StudentMessageDetail() {
  // URL の :id の部分を読み取る（例: /messages/3 → "3"）
  const { id } = useParams()

  return (
    <main className="page">
      <h1>メッセージ詳細（G013・仮）</h1>
      <p>この画面はこれから作ります。</p>
      {/* ルーティング確認用の表示。中身を作るときに消す */}
      <p>id: {id}</p>
    </main>
  )
}
