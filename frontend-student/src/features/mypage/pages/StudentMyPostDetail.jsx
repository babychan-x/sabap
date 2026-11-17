import { useParams } from 'react-router-dom'
import './StudentMyPostDetail.css'

// G028 自分の投稿詳細画面（studentMyPostDetail）
// ※ 仮の画面。外部設計書 G028 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: G-2
export default function StudentMyPostDetail() {
  // URL の :id の部分を読み取る（例: /mypage/posts/3 → "3"）
  const { id } = useParams()

  return (
    <main className="page">
      <h1>自分の投稿詳細（G028・仮）</h1>
      <p>この画面はこれから作ります。</p>
      {/* ルーティング確認用の表示。中身を作るときに消す */}
      <p>id: {id}</p>
    </main>
  )
}
