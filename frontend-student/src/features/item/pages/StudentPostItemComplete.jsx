import './StudentPostItemComplete.css'

// G023 投稿完了画面（studentPostItemComplete）

import { useNavigate } from "react-router-dom";
import ProgressSteps from "../../../components/ProgressSteps";

function StudentPostItemComplete() {
  const navigate = useNavigate();

  // イベント1：トップに戻る
  const backToTop = () => {
    navigate("/home");
  };

  return (
    <main className="post-complete">
      <h1 className="post-complete__title">投稿完了</h1>

      {/* 進行状況表示（見た目は G029 と同じ共通部品 ProgressSteps） */}
      <div
        id="stepIndicator"
        className="post-complete__steps"
      >
        <ProgressSteps current={2} label="投稿の手順" />
      </div>

      {/* 投稿完了メッセージ */}
      <div className="post-complete__message">
        <h2>
          投稿が
          <br />
          完了しました
        </h2>

        <p>
          投稿内容はマイページの「投稿一覧」から
          <br />
          いつでも編集・削除が可能です。
        </p>
      </div>

      {/* トップに戻るボタン */}
      <div className="post-complete__actions">
        <button
          id="backToTop"
          type="button"
          className="post-complete__button"
          onClick={backToTop}
        >
          トップに戻る
        </button>
      </div>
    </main>
  );
}

export default StudentPostItemComplete;
