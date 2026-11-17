import { useParams } from 'react-router-dom'
import './StudentMessageComplete.css'

// G037 メッセージ送信完了画面（studentMessageComplete）
// ※ 仮の画面。外部設計書 G037 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: なし
export default function StudentMessageComplete() {
  // URL の :id の部分を読み取る（例: /mypage/applications/3/message/complete → "3"）
  const { id } = useParams()

  return (
    <main className="page">
      <h1>メッセージ送信完了（G037・仮）</h1>
      <p>この画面はこれから作ります。</p>
      {/* ルーティング確認用の表示。中身を作るときに消す */}
      <p>id: {id}</p>
    </main>
  )
}
