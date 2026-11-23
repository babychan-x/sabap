import './StudentMyPostEdit.css'

// G029 投稿編集画面（studentMyPostEdit）
// ※ 仮の画面。外部設計書 G029 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: 投稿内容の取得（登録済みの値を初期表示する）（API一覧表の番号に合わせて書き換える）
// 置き場所: src/features/mypage/pages/StudentMyPostEdit.jsx（App.jsx: /mypage/posts/:id/edit）
//
// 【G030（編集確認画面）との受け渡し】
//   「確認画面へ」を押すと、入力内容を router の state（form）に入れて G030 へ移る。
//   G030 の「戻る」では、その form を次のように G029 に返すと、入力内容が保持される（設計書どおり）。
//     navigate(`/mypage/posts/${id}/edit`, { state: { form } })

import React, { useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './StudentMyPostEdit.css';

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  detail: (postId) => `/mypage/posts/${postId}`, // G028 投稿詳細
  confirm: (postId) => `/mypage/posts/${postId}/edit/confirm`, // G030 編集確認
};

// ---------------------------------------------------------------
// 選択肢・文字数の決まり
// ※ カテゴリーと発見場所の選択肢は、設計書に一覧がないため仮。
// ※ 現在の保管場所は、要件定義書 4.1 の「学生厚生未到着／学生厚生到着済み」の2つ。
// ---------------------------------------------------------------
const CATEGORIES = ['財布', 'スマホ', '傘', 'メガネ', 'その他'];
const PLACES = ['1号館', '2号館', '3号館', '4号館', '5号館', 'S号館', '体育館', '食堂', '図書館', 'その他'];
const STORAGE_OPTIONS = [
  { value: 'NOT_ARRIVED', label: '学生厚生未到着' },
  { value: 'ARRIVED', label: '学生厚生到着済み' },
];
const MAX_TITLE = 50; // タイトルは50文字以内
const MAX_FEATURE = 200; // 特徴の説明は200文字以内
const MAX_PHOTOS = 4; // 写真は最大4枚
const STEPS = ['入力', '確認', '完了'];

// 入力内容のチェック。エラーがあった項目だけ、メッセージを入れて返す。
// ※ エラーの文言は設計書に記載がないため仮。
function validate(form) {
  const errors = {};
  if (!form.category) errors.category = 'カテゴリーを選択してください';
  if (!form.foundAt) {
    errors.foundAt = '発見日時を入力してください';
  } else if (new Date(form.foundAt) > new Date()) {
    errors.foundAt = '未来の日時は指定できません';
  }
  if (!form.place) errors.place = '発見場所を選択してください';
  if (!form.storage) errors.storage = '現在の保管場所を選択してください';
  if (!form.title.trim()) {
    errors.title = 'タイトルを入力してください';
  } else if (form.title.length > MAX_TITLE) {
    errors.title = `${MAX_TITLE}文字以内で入力してください`;
  }
  if (form.feature.length > MAX_FEATURE) {
    errors.feature = `${MAX_FEATURE}文字以内で入力してください`;
  }
  if (form.photos.length === 0) errors.photos = '写真を1枚以上追加してください';
  return errors;
}

// ラベル（必須／任意のバッジ付き）と、エラー表示をまとめた入力欄の枠
function Field({ label, required, htmlFor, error, counter, children }) {
  return (
    <div className="my-post-edit-field">
      <div className="my-post-edit-label-row">
        <span className={`my-post-edit-badge ${required ? 'required' : 'optional'}`}>
          {required ? '必須' : '任意'}
        </span>
        <label className="my-post-edit-label" htmlFor={htmlFor}>
          {label}
        </label>
        {counter && <span className="my-post-edit-counter">{counter}</span>}
      </div>
      {children}
      {error && (
        <p className="my-post-edit-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// プルダウン（右の「⌵」付き）
function SelectBox({ id, value, onChange, error, children }) {
  return (
    <div className={`my-post-edit-select-wrapper ${error ? 'has-error' : ''}`}>
      <select id={id} className="my-post-edit-select" value={value} onChange={onChange}>
        {children}
      </select>
      <svg className="my-post-edit-select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>
  );
}

// 見つからない／編集できないときの画面
function MessagePage({ message, onBack }) {
  return (
    <div className="my-post-edit-page-wrapper">
      <div className="my-post-edit-mobile-container">
        <header className="my-post-edit-header">
          <button className="my-post-edit-back-btn" onClick={onBack} aria-label="戻る">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 className="my-post-edit-title">投稿を編集する</h1>
        </header>
        <p className="my-post-edit-empty">{message}</p>
      </div>
    </div>
  );
}

export default function StudentMyPostEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // /mypage/posts/:id/edit の投稿ID
  const contentRef = useRef(null);
  const fileInputRef = useRef(null);

  // 登録済みの内容の仮データ（G027・G028 の仮データの投稿ID 1〜6 に対応）
  // 日時は「年-月-日T時:分」の形（日時入力欄に合わせている）。
  // photos が空のものは、写真を追加しないと「確認画面へ」に進めない（入力チェックの確認用）。
  // TODO: API で投稿を取得する（見つからないときの表示は仕様に記載なし）
  const glassesImage = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80';
  const dummyPosts = {
    1: { status: 'NOT_ARRIVED', category: 'メガネ', foundAt: '2026-10-12T18:00', place: '4号館', storage: 'NOT_ARRIVED', title: '眼鏡', feature: '', photos: [{ key: 'p1', src: glassesImage }] },
    2: { status: 'NOT_ARRIVED', category: 'その他', foundAt: '2026-10-12T15:00', place: '2号館', storage: 'NOT_ARRIVED', title: 'ボールペン三本', feature: 'ピンク・水色・黄色のペンが1本ずつ', photos: [] },
    3: { status: 'ARRIVED', category: '傘', foundAt: '2026-09-12T13:00', place: '体育館', storage: 'ARRIVED', title: '折りたたみ傘(白)', feature: '', photos: [] },
    4: { status: 'RETURNED', category: 'その他', foundAt: '2026-06-12T13:00', place: '体育館', storage: 'ARRIVED', title: '水筒ボトル(透明)', feature: '蓋にコルクが付いている', photos: [] },
    5: { status: 'ARRIVED', category: 'その他', foundAt: '2026-03-11T13:00', place: '1号館', storage: 'ARRIVED', title: 'キーホルダーと鍵', feature: 'クマのキーホルダーと鍵2本', photos: [] },
    6: { status: 'NOT_ARRIVED', category: 'その他', foundAt: '2026-06-12T13:00', place: '食堂', storage: 'NOT_ARRIVED', title: '充電ケーブル', feature: 'ケーブルは白色', photos: [] },
  };
  const post = dummyPosts[id];

  // 入力内容。G030 から戻ってきたときは、そのとき入力していた内容（location.state.form）を使う。
  const [form, setForm] = useState(() => {
    if (location.state?.form) return location.state.form;
    if (!post) return null;
    const initial = { ...post };
    delete initial.status; // status は入力欄ではないので除く
    return initial;
  });
  const [errors, setErrors] = useState({});

  // 仮データにないIDのときは、別の投稿を代わりに出さず「見つかりません」を表示する
  if (!post) {
    return (
      <MessagePage
        message="投稿が見つかりませんでした"
        onBack={() => navigate('/mypage/posts')}
      />
    );
  }

  // 保管場所が「学生厚生未到着」のときだけ編集できる（要件定義書 4.1 より。要確認）
  if (post.status !== 'NOT_ARRIVED') {
    return (
      <MessagePage
        message="この投稿は、学生厚生に到着済みのため編集できません"
        onBack={() => navigate(ROUTES.detail(id))}
      />
    );
  }

  // 入力したとき：値を更新して、その項目のエラー表示を消す
  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // 写真を追加したとき（最大4枚まで）
  const handleAddPhotos = (e) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ''; // 同じ写真をもう一度選べるようにする
    const room = MAX_PHOTOS - form.photos.length;
    if (files.length === 0 || room <= 0) return;

    const added = files.slice(0, room).map((file) => ({
      key: `${file.name}-${file.lastModified}-${Math.random()}`,
      src: URL.createObjectURL(file),
      file,
    }));
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...added] }));
    setErrors((prev) => ({ ...prev, photos: undefined }));
  };

  // 写真を外したとき
  const handleRemovePhoto = (key) => {
    setForm((prev) => ({ ...prev, photos: prev.photos.filter((p) => p.key !== key) }));
  };

  // 「確認画面へ」を押したとき：問題がなければ G030 へ、あればこの画面にとどまる
  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    navigate(ROUTES.confirm(id), { state: { form } });
  };

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div className="my-post-edit-page-wrapper">
      {/* 9:16比率のスマホ枠 */}
      <div className="my-post-edit-mobile-container">
        {/* ヘッダー */}
        <header className="my-post-edit-header">
          <button
            className="my-post-edit-back-btn"
            onClick={() => navigate(ROUTES.detail(id))}
            aria-label="戻る"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 className="my-post-edit-title">投稿を編集する</h1>
        </header>

        {/* 進行状況（入力 → 確認 → 完了。この画面では「入力」を強調） */}
        <ol className="my-post-edit-steps" aria-label="編集の手順">
          {STEPS.map((label, index) => (
            <React.Fragment key={label}>
              {index > 0 && <li className="my-post-edit-step-line" aria-hidden="true" />}
              <li
                className={`my-post-edit-step ${index === 0 ? 'current' : ''}`}
                aria-current={index === 0 ? 'step' : undefined}
              >
                <span className="my-post-edit-step-circle">{index + 1}</span>
                <span className="my-post-edit-step-label">{label}</span>
              </li>
            </React.Fragment>
          ))}
        </ol>

        <form className="my-post-edit-form" onSubmit={handleSubmit} noValidate>
          <div className="my-post-edit-content" ref={contentRef}>
            {/* エラーメッセージ表示部（入力内容に不備があるときだけ表示） */}
            {hasErrors && (
              <p className="my-post-edit-error-banner" role="alert">
                入力内容に不備があります。赤く表示した項目を確認してください。
              </p>
            )}

            <h2 className="my-post-edit-section-title">基本情報</h2>

            <Field label="カテゴリー" required htmlFor="edit-category" error={errors.category}>
              <SelectBox id="edit-category" value={form.category} onChange={handleChange('category')} error={errors.category}>
                <option value="">選択してください</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </SelectBox>
            </Field>

            <Field label="発見日時" required htmlFor="edit-found-at" error={errors.foundAt}>
              <div className={`my-post-edit-input-wrapper ${errors.foundAt ? 'has-error' : ''}`}>
                <input
                  id="edit-found-at"
                  className="my-post-edit-input"
                  type="datetime-local"
                  value={form.foundAt}
                  onChange={handleChange('foundAt')}
                />
              </div>
            </Field>

            <Field label="発見場所" required htmlFor="edit-place" error={errors.place}>
              <SelectBox id="edit-place" value={form.place} onChange={handleChange('place')} error={errors.place}>
                <option value="">選択してください</option>
                {PLACES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </SelectBox>
            </Field>

            <Field label="現在の保管場所" required htmlFor="edit-storage" error={errors.storage}>
              <SelectBox id="edit-storage" value={form.storage} onChange={handleChange('storage')} error={errors.storage}>
                <option value="">選択してください</option>
                {STORAGE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </SelectBox>
            </Field>

            <h2 className="my-post-edit-section-title">落とし物の情報</h2>

            <Field
              label="タイトル"
              required
              htmlFor="edit-title"
              error={errors.title}
              counter={`${form.title.length}/${MAX_TITLE}`}
            >
              <div className={`my-post-edit-input-wrapper ${errors.title ? 'has-error' : ''}`}>
                <input
                  id="edit-title"
                  className="my-post-edit-input"
                  type="text"
                  placeholder="例：黒い折り畳み財布"
                  maxLength={MAX_TITLE}
                  value={form.title}
                  onChange={handleChange('title')}
                  autoComplete="off"
                />
              </div>
            </Field>

            <Field
              label="特徴の説明"
              htmlFor="edit-feature"
              error={errors.feature}
              counter={`${form.feature.length}/${MAX_FEATURE}`}
            >
              <div className={`my-post-edit-input-wrapper textarea ${errors.feature ? 'has-error' : ''}`}>
                <textarea
                  id="edit-feature"
                  className="my-post-edit-textarea"
                  placeholder="落とし物の特徴や状態などを記入してください"
                  maxLength={MAX_FEATURE}
                  value={form.feature}
                  onChange={handleChange('feature')}
                />
              </div>
            </Field>

            <Field label="写真" required error={errors.photos}>
              <div className="my-post-edit-photos">
                {form.photos.map((photo, index) => (
                  <div className="my-post-edit-photo" key={photo.key}>
                    <img src={photo.src} alt={`写真${index + 1}`} className="my-post-edit-photo-img" />
                    <button
                      type="button"
                      className="my-post-edit-photo-remove"
                      onClick={() => handleRemovePhoto(photo.key)}
                      aria-label={`写真${index + 1}を外す`}
                    >
                      ×
                    </button>
                  </div>
                ))}

                {form.photos.length < MAX_PHOTOS && (
                  <button
                    type="button"
                    className={`my-post-edit-add-photo ${errors.photos ? 'has-error' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M9 3 7.17 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                    </svg>
                    <span>
                      写真を追加する
                      <br />
                      （最大{MAX_PHOTOS}枚まで）
                    </span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="my-post-edit-file-input"
                onChange={handleAddPhotos}
              />
            </Field>

            <button type="submit" className="my-post-edit-submit-btn">
              確認画面へ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}