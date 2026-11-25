import { useParams } from 'react-router-dom'
import './StudentMessageComplete.css'

// G037 メッセージ送信完了画面（studentMessageComplete）

import { useNavigate } from 'react-router-dom'
import ProgressSteps from '../../../components/ProgressSteps'

const ROUTES = {
  myPage: '/mypage',
}

export default function StudentMessageComplete() {
  const navigate = useNavigate()

  // イベント1：マイページに戻る
  const backToMyPage = () => {
    navigate(ROUTES.myPage, {
      replace: true,
    })
  }

  return (
    <div className="page message-complete">

      {/* ヘッダー */}
      <header className="message-complete__header">
        <h1 className="message-complete__title">
          送信完了
        </h1>
      </header>

      {/* 進行状況表示：「完了」を強調 */}
      <div className="message-complete__steps">
        <ProgressSteps
          current={2}
          label="送信の手順"
        />
      </div>

      {/* 完了メッセージ */}
      <main className="message-complete__content">
        <h2 className="message-complete__heading">
          送信が<br />
          完了しました
        </h2>

        <p className="message-complete__description">
          送信内容はマイページの「感謝メッセージボックス」
          からいつでも閲覧が可能です。
        </p>
      </main>

      {/* マイページに戻るボタン */}
      <div className="message-complete__footer">
        <button
          type="button"
          id="backToMyPage"
          className="btn btn--primary"
          onClick={backToMyPage}
        >
          マイページに戻る
        </button>
      </div>

    </div>
  )
}
