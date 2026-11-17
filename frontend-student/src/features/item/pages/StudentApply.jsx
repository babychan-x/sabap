import { useParams } from 'react-router-dom'
import './StudentApply.css'

// G018 受け取り申請（入力）画面（studentApply）
// ※ 仮の画面。外部設計書 G018 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: なし
export default function StudentApply() {
  // URL の :id の部分を読み取る（例: /items/3/apply → "3"）
  const { id } = useParams()

  return (
    <main className="page">
      <h1>受け取り申請（入力）（G018・仮）</h1>
      <p>この画面はこれから作ります。</p>
      {/* ルーティング確認用の表示。中身を作るときに消す */}
      <p>id: {id}</p>
    </main>
  )
}
