import './StudentChangePasswordComplete.css'

// G026 パスワード変更完了画面（studentChangePasswordComplete）
// ※ 仮の画面。外部設計書 G026 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: なし（G025 でパスワードを変更したあとに表示するだけの画面）
// 置き場所: src/features/mypage/pages/StudentChangePasswordComplete.jsx（App.jsx: /mypage/password/complete）

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentChangePasswordComplete.css';

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  mypage: '/mypage', // G024 マイページ
};

export default function StudentChangePasswordComplete() {
  const navigate = useNavigate();

  return (
    <div className="change-password-complete-page-wrapper">
      {/* 9:16比率のスマホ枠 */}
      <div className="change-password-complete-mobile-container">
        {/* ヘッダー（完了画面なので戻るボタンはなし） */}
        <header className="change-password-complete-header">
          <h1 className="change-password-complete-title">再設定完了</h1>
        </header>

        {/* メッセージ */}
        <main className="change-password-complete-main">
          <div className="change-password-complete-icon" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="5 12.5 10 17.5 19 7.5"></polyline>
            </svg>
          </div>
          <h2 className="change-password-complete-heading">
            再設定が
            <br />
            完了しました
          </h2>
          <p className="change-password-complete-text">
            パスワードの再設定が正常に完了しました。
            <br />
            引き続きシステムをご利用いただけます。
          </p>
        </main>

        {/* ボタン */}
        <div className="change-password-complete-footer">
          <button
            className="change-password-complete-btn"
            onClick={() => navigate(ROUTES.mypage)}
          >
            マイページに戻る
          </button>
        </div>
      </div>
    </div>
  );
}