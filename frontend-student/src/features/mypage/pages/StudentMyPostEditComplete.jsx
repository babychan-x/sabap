import { useParams } from 'react-router-dom'
import './StudentMyPostEditComplete.css'

// G031 編集完了画面（studentMyPostEditComplete）
// ※ 仮の画面。外部設計書 G031 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: なし
export default function StudentMyPostEditComplete() {
  // URL の :id の部分を読み取る（例: /mypage/posts/3/edit/complete → "3"）
  const { id } = useParams()

  return (
    <main className="page">
      <h1>編集完了（G031・仮）</h1>
      <p>この画面はこれから作ります。</p>
      {/* ルーティング確認用の表示。中身を作るときに消す */}
      <p>id: {id}</p>
    </main>
  )
}
