import { useSearchParams } from 'react-router-dom'
import './StudentResetPassword.css'

// G009 パスワード再設定画面（studentResetPassword）
// ※ 仮の画面。外部設計書 G009 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: A-6, A-7
export default function StudentResetPassword() {
  // URL の ?token=〇〇 の部分を読み取る
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  return (
    <main className="page">
      <h1>パスワード再設定（G009・仮）</h1>
      <p>この画面はこれから作ります。</p>
      {/* ルーティング確認用の表示。中身を作るときに消す */}
      <p>token: {token ?? '（なし）'}</p>
    </main>
  )
}
