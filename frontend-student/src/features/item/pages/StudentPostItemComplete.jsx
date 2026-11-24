import './StudentPostItemComplete.css'

// G023 投稿完了画面（studentPostItemComplete）

import { useNavigate } from "react-router-dom";

function StudentPostItemComplete() {
  const navigate = useNavigate();

  // イベント1：トップに戻る
  const backToTop = () => {
    navigate("/home");
  };

  return (
    <main className="post-complete">
      <h1 className="post-complete__title">投稿完了</h1>

      {/* 進行状況表示 */}
      <div
        id="stepIndicator"
        className="post-complete__steps"
      >
        <div className="post-complete__step">
          <span className="post-complete__step-number">
            1
          </span>
          <span>入力</span>
        </div>

        <div className="post-complete__step-line"></div>

        <div className="post-complete__step">
          <span className="post-complete__step-number">
            2
          </span>
          <span>確認</span>
        </div>

        <div className="post-complete__step-line"></div>

        <div
          className="post-complete__step post-complete__step--active"
          aria-current="step"
        >
          <span className="post-complete__step-number">
            3
          </span>
          <span>完了</span>
        </div>
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
