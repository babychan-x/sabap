import { useParams } from 'react-router-dom'
import './StudentMessageConfirm.css'

// G036 メッセージ確認画面（studentMessageConfirm）
// ※ 仮の画面。外部設計書 G036 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: D-3（「送信する」で実行）
export default function StudentMessageConfirm() {
  // URL の :id の部分を読み取る（例: /mypage/applications/3/message/confirm → "3"）
  const { id } = useParams()

  return (
    <main className="page">
      <h1>メッセージ確認（G036・仮）</h1>
      <p>この画面はこれから作ります。</p>
      {/* ルーティング確認用の表示。中身を作るときに消す */}
      <p>id: {id}</p>
    </main>
  )
}
