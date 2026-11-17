import { useParams } from 'react-router-dom'
import './StudentMyPostEdit.css'

// G029 投稿編集（入力）画面（studentMyPostEdit）
// ※ 仮の画面。外部設計書 G029 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: G-2
export default function StudentMyPostEdit() {
  // URL の :id の部分を読み取る（例: /mypage/posts/3/edit → "3"）
  const { id } = useParams()

  return (
    <main className="page">
      <h1>投稿編集（入力）（G029・仮）</h1>
      <p>この画面はこれから作ります。</p>
      {/* ルーティング確認用の表示。中身を作るときに消す */}
      <p>id: {id}</p>
    </main>
  )
}
