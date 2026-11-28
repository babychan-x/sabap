import './StudentMyPostEdit.css'

// G029 投稿編集画面（studentMyPostEdit）
// ※ 仮の画面。外部設計書 G029 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: G-2 自分の投稿の詳細（api/myPosts.js の getMyPost。登録済みの値を初期表示する。仮データは mock/myPosts.js）
// 置き場所: src/features/mypage/pages/StudentMyPostEdit.jsx（App.jsx: /mypage/posts/:id/edit）
//
// 【G030（編集確認画面）との受け渡し】
//   「確認画面へ」を押すと、入力内容を router の state（form）に入れて G030 へ移る。
//     form = { itemName, itemCategory, foundAt（'2026-10-12T18:00' の形）, foundLocation, itemStatus, itemDescription,
//              postImages: [{ key, url, file? }] }（項目名は mock/myPosts.js と同じ。写真だけ、外す・足すために key と file を持つ）
//   G030 の「戻る」では、その form を次のように G029 に返すと、入力内容が保持される（設計書どおり）。
//     navigate(`/mypage/posts/${id}/edit`, { state: { form } })

import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getMyPost } from '../../../api/myPosts';
import ScreenLayout from '../../../components/ScreenLayout';
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

// 入力内容のチェック。エラーがあった項目だけ、メッセージを入れて返す。
// ※ エラーの文言は設計書に記載がないため仮。
function validate(form) {
  const errors = {};
  if (!form.itemCategory) errors.itemCategory = 'カテゴリーを選択してください';
  if (!form.foundAt) {
    errors.foundAt = '発見日時を入力してください';
  } else if (new Date(form.foundAt) > new Date()) {
    errors.foundAt = '未来の日時は指定できません';
  }
  if (!form.foundLocation) errors.foundLocation = '発見場所を選択してください';
  if (!form.itemStatus) errors.itemStatus = '現在の保管場所を選択してください';
  if (!form.itemName.trim()) {
    errors.itemName = 'タイトルを入力してください';
  } else if (form.itemName.length > MAX_TITLE) {
    errors.itemName = `${MAX_TITLE}文字以内で入力してください`;
  }
  if (form.itemDescription.length > MAX_FEATURE) {
    errors.itemDescription = `${MAX_FEATURE}文字以内で入力してください`;
  }
  if (form.postImages.length === 0) errors.postImages = '写真を1枚以上追加してください';
  return errors;
}

// 取得した投稿（mock/myPosts.js の形）を、入力欄の初めの値（form）に変える
function toEditForm(post) {
  return {
    itemName: post.itemName,
    itemCategory: post.itemCategory,
    foundAt: post.foundAt.slice(0, 16), // 日時入力欄に合わせて「年-月-日T時:分」にする
    foundLocation: post.foundLocation,
    // 「現在の保管場所」は、保管場所ステータス（item_status）を選ぶもの（仮。DB のどの列か要確認）
    itemStatus: post.itemStatus,
    itemDescription: post.itemDescription,
    // 登録済みの写真（file がない = 前からある写真）
    postImages: post.postImageUrls.map((url, index) => ({ key: `saved-${index}`, url })),
  };
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
    <ScreenLayout title="投稿を編集する" onBack={onBack}>
      <p className="my-post-edit-empty">{message}</p>
    </ScreenLayout>
  );
}

export default function StudentMyPostEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // /mypage/posts/:id/edit の投稿ID
  const contentRef = useRef(null);
  const fileInputRef = useRef(null);

  // 登録済みの投稿（どの ID の結果かも一緒に持つ）。写真が無い投稿は、写真を追加しないと「確認画面へ」に進めない
  const [result, setResult] = useState(null); // { postId, post, error }

  // 入力内容。G030 から戻ってきたときは、そのとき入力していた内容（location.state.form）を使う。
  // そうでなければ、投稿を取得してから、登録済みの値を入れる（下の useEffect）。
  const [form, setForm] = useState(location.state?.form ?? null);
  const [errors, setErrors] = useState({});

  // 画面を開いたときに、投稿を取得する（G030 から戻ってきたときも、編集できるかを確かめるために取得する）
  useEffect(() => {
    let ignore = false; // 画面を離れたあとに届いた結果は使わない
    getMyPost(id)
      .then((post) => {
        if (ignore) return;
        setResult({ postId: id, post, error: '' });
        setForm((prev) => prev ?? toEditForm(post)); // 入力中の内容があれば、そのまま使う
      })
      .catch((err) => {
        // 文言は設計書に記載なし（仮）
        const error = err.message === 'NOT_FOUND'
          ? '投稿が見つかりませんでした'
          : '読み込めませんでした。時間をおいて、もう一度お試しください。';
        if (!ignore) setResult({ postId: id, post: null, error });
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  const current = result?.postId === id ? result : null; // いま開いている ID の結果だけを使う

  if (!current || (current.post && !form)) {
    return <MessagePage message="読み込み中…" onBack={() => navigate(ROUTES.detail(id))} />;
  }

  // 見つからない・読み込めないときは、別の投稿を代わりに出さず、文言だけを表示する
  const post = current.post;
  if (!post) {
    return (
      <MessagePage
        message={current.error}
        onBack={() => navigate('/mypage/posts')}
      />
    );
  }

  // 保管場所が「学生厚生未到着」のときだけ編集できる（要件定義書 4.1 より。要確認）
  if (post.itemStatus !== 'NOT_ARRIVED') {
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
    const room = MAX_PHOTOS - form.postImages.length;
    if (files.length === 0 || room <= 0) return;

    const added = files.slice(0, room).map((file) => ({
      key: `${file.name}-${file.lastModified}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
    }));
    setForm((prev) => ({ ...prev, postImages: [...prev.postImages, ...added] }));
    setErrors((prev) => ({ ...prev, postImages: undefined }));
  };

  // 写真を外したとき
  const handleRemovePhoto = (key) => {
    setForm((prev) => ({ ...prev, postImages: prev.postImages.filter((p) => p.key !== key) }));
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
    <ScreenLayout
      title="投稿を編集する"
      onBack={() => navigate(ROUTES.detail(id))}
      steps={0}
      stepsLabel="編集の手順"
      contentRef={contentRef /* エラーのときに、中身を一番上に戻すため */}
    >
      <form className="my-post-edit-form" onSubmit={handleSubmit} noValidate>
        <div className="my-post-edit-content">
          {/* エラーメッセージ表示部（入力内容に不備があるときだけ表示） */}
          {hasErrors && (
            <p className="my-post-edit-error-banner" role="alert">
              入力内容に不備があります。赤く表示した項目を確認してください。
            </p>
          )}

          <h2 className="my-post-edit-section-title">基本情報</h2>

          <Field label="カテゴリー" required htmlFor="edit-category" error={errors.itemCategory}>
            <SelectBox id="edit-category" value={form.itemCategory} onChange={handleChange('itemCategory')} error={errors.itemCategory}>
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

          <Field label="発見場所" required htmlFor="edit-place" error={errors.foundLocation}>
            <SelectBox id="edit-place" value={form.foundLocation} onChange={handleChange('foundLocation')} error={errors.foundLocation}>
              <option value="">選択してください</option>
              {PLACES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </SelectBox>
          </Field>

          <Field label="現在の保管場所" required htmlFor="edit-storage" error={errors.itemStatus}>
            <SelectBox id="edit-storage" value={form.itemStatus} onChange={handleChange('itemStatus')} error={errors.itemStatus}>
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
            error={errors.itemName}
            counter={`${form.itemName.length}/${MAX_TITLE}`}
          >
            <div className={`my-post-edit-input-wrapper ${errors.itemName ? 'has-error' : ''}`}>
              <input
                id="edit-title"
                className="my-post-edit-input"
                type="text"
                placeholder="例：黒い折り畳み財布"
                maxLength={MAX_TITLE}
                value={form.itemName}
                onChange={handleChange('itemName')}
                autoComplete="off"
              />
            </div>
          </Field>

          <Field
            label="特徴の説明"
            htmlFor="edit-feature"
            error={errors.itemDescription}
            counter={`${form.itemDescription.length}/${MAX_FEATURE}`}
          >
            <div className={`my-post-edit-input-wrapper textarea ${errors.itemDescription ? 'has-error' : ''}`}>
              <textarea
                id="edit-feature"
                className="my-post-edit-textarea"
                placeholder="落とし物の特徴や状態などを記入してください"
                maxLength={MAX_FEATURE}
                value={form.itemDescription}
                onChange={handleChange('itemDescription')}
              />
            </div>
          </Field>

          <Field label="写真" required error={errors.postImages}>
            <div className="my-post-edit-photos">
              {form.postImages.map((photo, index) => (
                <div className="my-post-edit-photo" key={photo.key}>
                  <img src={photo.url} alt={`写真${index + 1}`} className="my-post-edit-photo-img" />
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

              {form.postImages.length < MAX_PHOTOS && (
                <button
                  type="button"
                  className={`my-post-edit-add-photo ${errors.postImages ? 'has-error' : ''}`}
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
    </ScreenLayout>
  );
}