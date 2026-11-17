import { useParams } from 'react-router-dom'
import './StudentApprovalDetail.css'

// G014 承認詳細画面（studentApprovalDetail）
// ※ 仮の画面。外部設計書 G014 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: E-2
export default function StudentApprovalDetail() {
  // URL の :id の部分を読み取る（例: /applications/3/approval → "3"）
  const { id } = useParams()

  return (
    <main className="page">
      <h1>承認詳細（G014・仮）</h1>
      <p>この画面はこれから作ります。</p>
      {/* ルーティング確認用の表示。中身を作るときに消す */}
      <p>id: {id}</p>
    </main>
  )
}
