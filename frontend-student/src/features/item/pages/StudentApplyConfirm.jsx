import { useParams } from 'react-router-dom'
import './StudentApplyConfirm.css'

// G019 申請確認画面（studentApplyConfirm）
// ※ 仮の画面。外部設計書 G019 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: E-3（「受け取り申請する」で実行）
export default function StudentApplyConfirm() {
  // URL の :id の部分を読み取る（例: /items/3/apply/confirm → "3"）
  const { id } = useParams()

  return (
    <main className="page">
      <h1>申請確認（G019・仮）</h1>
      <p>この画面はこれから作ります。</p>
      {/* ルーティング確認用の表示。中身を作るときに消す */}
      <p>id: {id}</p>
    </main>
  )
}
