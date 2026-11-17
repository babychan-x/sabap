import { useParams } from 'react-router-dom'
import './StudentHandedOverDetail.css'

// G034 受け渡し済み詳細画面（studentHandedOverDetail）
// ※ 仮の画面。外部設計書 G034 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: E-2
export default function StudentHandedOverDetail() {
  // URL の :id の部分を読み取る（例: /mypage/applications/3/handed-over → "3"）
  const { id } = useParams()

  return (
    <main className="page">
      <h1>受け渡し済み詳細（G034・仮）</h1>
      <p>この画面はこれから作ります。</p>
      {/* ルーティング確認用の表示。中身を作るときに消す */}
      <p>id: {id}</p>
    </main>
  )
}
