import './StudentChangePassword.css'

// G025 パスワード変更画面（studentChangePassword）
// ※ 仮の画面。外部設計書 G025 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: 現在のパスワードの照合と、新しいパスワードへの変更（API一覧表の番号に合わせて書き換える）
// 置き場所: src/features/mypage/pages/StudentChangePassword.jsx（App.jsx: /mypage/password）

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentChangePassword.css';
import ScreenLayout from '../../../components/ScreenLayout';

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  mypage: '/mypage', // G024 マイページ
  complete: '/mypage/password/complete', // G026 パスワード変更完了
};

// ---------------------------------------------------------------
// 新しいパスワードのルール（画面の説明文：半角英字・数字を含む8文字以上、使える記号は !@_#$%&*）
// ※ 文字数の上限・エラーメッセージの文言は設計書に記載がないため仮。
// ---------------------------------------------------------------
const PASSWORD_PATTERN = /^[A-Za-z0-9!@_#$%&*]{8,}$/;
const HAS_LETTER = /[A-Za-z]/;
const HAS_DIGIT = /[0-9]/;

function validate(values) {
  const errors = {};
  if (!values.current) {
    errors.current = '現在のパスワードを入力してください';
  }
  if (!values.next) {
    errors.next = '新しいパスワードを入力してください';
  } else if (
    !PASSWORD_PATTERN.test(values.next) ||
    !HAS_LETTER.test(values.next) ||
    !HAS_DIGIT.test(values.next)
  ) {
    errors.next = '半角英字・数字を含む8文字以上で入力してください（使える記号：!@_#$%&*）';
  }
  if (!values.confirm) {
    errors.confirm = '確認用のパスワードを入力してください';
  } else if (values.next && values.confirm !== values.next) {
    errors.confirm = '新しいパスワードが一致しません';
  }
  return errors;
}

// 鍵のイラスト
function LockIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M20 29 V21 a12 12 0 0 1 24 0 V29"
        fill="none"
        stroke="#1f5da8"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <rect x="10" y="28" width="44" height="30" rx="6" fill="#1f5da8" />
      <circle cx="32" cy="40" r="5" fill="#ffffff" />
      <rect x="30" y="43" width="4" height="9" rx="2" fill="#ffffff" />
    </svg>
  );
}

// 目のアイコン（隠しているときは斜線あり）
function EyeIcon({ hidden }) {
  return hidden ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}

// パスワード入力欄1つ分（ラベル・入力・表示切り替え・エラー）
function PasswordField({ id, label, placeholder, value, onChange, show, onToggle, error, autoComplete }) {
  return (
    <div className="change-password-field">
      <label className="change-password-label" htmlFor={id}>
        {label}
      </label>
      <div className={`change-password-input-wrapper ${error ? 'has-error' : ''}`}>
        <input
          id={id}
          className="change-password-input"
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={error ? 'true' : 'false'}
        />
        <button
          type="button"
          className="change-password-eye-btn"
          onClick={onToggle}
          aria-label={show ? 'パスワードを隠す' : 'パスワードを表示する'}
        >
          <EyeIcon hidden={!show} />
        </button>
      </div>
      {error && (
        <p className="change-password-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function StudentChangePassword() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [errors, setErrors] = useState({});

  // 入力したとき：値を更新して、その欄のエラー表示を消す
  const handleChange = (key) => (e) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // 目のアイコンを押したとき：パスワードの表示／非表示を切り替える
  const handleToggle = (key) => () => {
    setShow((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 「パスワードを変更する」を押したとき
  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    // TODO: API（現在のパスワードの照合と変更）を呼ぶ
    //   現在のパスワードが違うときは、次のようにエラーを出して、この画面にとどまる
    //   setErrors({ current: '現在のパスワードが正しくありません' });
    navigate(ROUTES.complete);
  };

  return (
    <ScreenLayout
      title="パスワード再設定"
      onBack={() => navigate(ROUTES.mypage)}
      footer={
        <div className="change-password-footer">
          {/* 送信ボタンは下に固定するため、フォームの外にある。form="…" でフォームとつなぐ */}
          <button type="submit" form="change-password-form" className="change-password-submit-btn">
            パスワードを変更する
          </button>
        </div>
      }
    >
      <form id="change-password-form" className="change-password-form" onSubmit={handleSubmit} noValidate>
        {/* 入力エリア */}
        <div className="change-password-content">
          <div className="change-password-lock">
            <LockIcon />
          </div>
          <h2 className="change-password-heading">新しいパスワードを設定してください</h2>
          <p className="change-password-hint">
            半角英字・数字を含む8文字以上（記号 !@_#$%&*の使用可能）
          </p>

          <PasswordField
            id="current-password"
            label="現在のパスワード"
            placeholder="現在のパスワードを入力"
            value={values.current}
            onChange={handleChange('current')}
            show={show.current}
            onToggle={handleToggle('current')}
            error={errors.current}
            autoComplete="current-password"
          />
          <PasswordField
            id="new-password"
            label="新しいパスワード"
            placeholder="新しいパスワードを入力"
            value={values.next}
            onChange={handleChange('next')}
            show={show.next}
            onToggle={handleToggle('next')}
            error={errors.next}
            autoComplete="new-password"
          />
          <PasswordField
            id="confirm-password"
            label="新しいパスワード（確認用）"
            placeholder="もう一度入力してください"
            value={values.confirm}
            onChange={handleChange('confirm')}
            show={show.confirm}
            onToggle={handleToggle('confirm')}
            error={errors.confirm}
            autoComplete="new-password"
          />
        </div>

      </form>
    </ScreenLayout>
  );
}