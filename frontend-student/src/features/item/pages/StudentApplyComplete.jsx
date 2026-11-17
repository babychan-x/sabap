import { useParams } from 'react-router-dom'
import './StudentApplyComplete.css'

// G020 申請完了画面（studentApplyComplete）
// ※ 仮の画面。外部設計書 G020 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: なし
export default function StudentApplyComplete() {
  // URL の :id の部分を読み取る（例: /items/3/apply/complete → "3"）
  const { id } = useParams()

  return (
    <main className="page">
      <h1>申請完了（G020・仮）</h1>
      <p>この画面はこれから作ります。</p>
      {/* ルーティング確認用の表示。中身を作るときに消す */}
      <p>id: {id}</p>
    </main>
  )
}
