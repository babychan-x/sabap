import { useParams } from 'react-router-dom'
import './StudentMessageWrite.css'

// G035 メッセージ記述（入力）画面（studentMessageWrite）
// ※ 仮の画面。外部設計書 G035 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: なし
export default function StudentMessageWrite() {
  // URL の :id の部分を読み取る（例: /mypage/applications/3/message → "3"）
  const { id } = useParams()

  return (
    <main className="page">
      <h1>メッセージ記述（入力）（G035・仮）</h1>
      <p>この画面はこれから作ります。</p>
      {/* ルーティング確認用の表示。中身を作るときに消す */}
      <p>id: {id}</p>
    </main>
  )
}
