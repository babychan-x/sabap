import { useParams } from 'react-router-dom'
import './StudentMyPostEditConfirm.css'

// G030 編集確認画面（studentMyPostEditConfirm）
// ※ 仮の画面。外部設計書 G030 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: G-3（「編集完了する」で実行）
export default function StudentMyPostEditConfirm() {
  // URL の :id の部分を読み取る（例: /mypage/posts/3/edit/confirm → "3"）
  const { id } = useParams()

  return (
    <main className="page">
      <h1>編集確認（G030・仮）</h1>
      <p>この画面はこれから作ります。</p>
      {/* ルーティング確認用の表示。中身を作るときに消す */}
      <p>id: {id}</p>
    </main>
  )
}
