import { useSearchParams } from 'react-router-dom'
import './StudentSignUpForm.css'

// G004 情報登録画面（studentSignUpForm）
// ※ 仮の画面。外部設計書 G004 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: A-3（開いた時に、URLの token でリンクを検証する）
export default function StudentSignUpForm() {
  // URL の ?token=〇〇 の部分を読み取る（例: /signup/form?token=abc → "abc"）
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  return (
    <main className="page">
      <h1>情報登録（G004・仮）</h1>
      <p>この画面はこれから作ります。</p>
      {/* ルーティング確認用の表示。中身を作るときに消す */}
      <p>token: {token ?? '（なし）'}</p>
    </main>
  )
}
