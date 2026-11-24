// G016 検索結果一覧画面（studentSearchResult）
// 主なAPI（仮）: B-1 落とし物一覧・検索（src/api/items.js の getItems）
// 置き場所: src/features/item/pages/StudentSearchResult.jsx（App.jsx: /search?keyword=）
// 見た目は G011（StudentHome）・G027（StudentMyPostList）に合わせている。

import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getItems } from '../../../api/items'
import { formatDateTime } from '../../../utils/date'
import { STORAGE_STATUS_LABELS } from '../../../utils/labels'
import './StudentSearchResult.css'

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  home: '/home', // G011 投稿一覧
  post: '/post', // G021 落とし物投稿
  mypage: '/mypage', // G024 マイページ
  // イベント3の遷移先「G015（申請結果詳細）」は、G017（落とし物詳細）と同じ画面（2026/11/24 確定）
  itemDetail: (itemId) => `/items/${itemId}`, // G015・G017 studentItemDetail
}

// キーワードの最大文字数（入出力項目2: 50以下）
const KEYWORD_MAX_LENGTH = 50

// 落とし物の写真（写真がないとき／読み込めないときは、灰色の枠にアイコンを表示。G027 と同じ形）
function Thumbnail({ src, alt }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="search-result-img-wrapper">
      {src && !failed ? (
        <img src={src} alt={alt} className="search-result-img" onError={() => setFailed(true)} />
      ) : (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      )}
    </div>
  )
}

export default function StudentSearchResult() {
  const navigate = useNavigate()

  // URL の ?keyword=〇〇 が「いま表示している検索キーワード」。
  // URL に持たせておくと、詳細画面から「戻る」で帰ってきたときも同じ結果が出る。
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') ?? ''

  // 入力欄の文字（検索するまでは URL と違ってよい）
  const [input, setInput] = useState(keyword)

  // ブラウザの「戻る」などで URL のキーワードが変わったら、入力欄もそれに合わせる
  const [prevKeyword, setPrevKeyword] = useState(keyword)
  if (keyword !== prevKeyword) {
    setPrevKeyword(keyword)
    setInput(keyword)
  }

  // 検索結果。「どのキーワードの結果か」と一緒に持つ（keyword と違えば読み込み中）
  const [result, setResult] = useState({ keyword: null, items: [], error: '' })
  const loading = result.keyword !== keyword

  // キーワードが変わるたびに検索する（入出力項目3・4）
  useEffect(() => {
    let ignore = false // 古い検索の結果が、あとから届いても使わないための目印

    getItems({ keyword })
      .then((items) => {
        if (!ignore) setResult({ keyword, items, error: '' })
      })
      .catch(() => {
        if (!ignore) {
          // 文言は設計書に記載なし（仮）
          setResult({ keyword, items: [], error: '検索できませんでした。時間をおいて、もう一度お試しください。' })
        }
      })

    return () => {
      ignore = true
    }
  }, [keyword])

  // イベント2: キーワード検索 → G016（自画面）。URL を書き換えると、上の useEffect が検索する。
  // 設計書には検索ボタンがないので、入力欄で Enter（スマホは「検索」キー）を押したときに検索する。
  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams({ keyword: input.trim() })
  }

  return (
    <div className="search-result-page-wrapper">
      {/* スマホ枠 */}
      <div className="search-result-mobile-container">
        {/* ヘッダー */}
        <header className="search-result-header">
          {/* イベント1: 戻るボタン押下 → G011（studentHome） */}
          <button className="search-result-back-btn" onClick={() => navigate(ROUTES.home)} aria-label="戻る">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 className="search-result-title">検索結果一覧</h1>
        </header>

        {/* 入出力項目2: キーワード検索 */}
        <form className="search-result-search-section" role="search" onSubmit={handleSearch}>
          <div className="search-result-search-bar">
            <svg className="search-result-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="search"
              enterKeyHint="search"
              className="search-result-search-input"
              aria-label="キーワード検索"
              placeholder="キーワードで検索(例:財布、黒、図書館)"
              maxLength={KEYWORD_MAX_LENGTH}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </form>

        {/* 落とし物リスト */}
        <div className="search-result-list" aria-busy={loading}>
          {loading && <p className="search-result-message">検索中…</p>}

          {!loading && result.error && (
            <p className="search-result-message error" role="alert">{result.error}</p>
          )}

          {!loading && !result.error && (
            <>
              {/* 入出力項目3: 該当件数（例: 該当件数:4件） */}
              <p className="search-result-count" aria-live="polite">該当件数:{result.items.length}件</p>

              {/* 0件のときの文言は設計書に記載なし（仮） */}
              {result.items.length === 0 && (
                <p className="search-result-message">該当する落とし物はありませんでした。</p>
              )}

              {/* 入出力項目4・5: 落とし物一覧・落とし物カード */}
              {result.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="search-result-card"
                  // イベント3: 落とし物カード選択 → 落とし物詳細画面
                  onClick={() => navigate(ROUTES.itemDetail(item.id))}
                >
                  <Thumbnail src={item.images[0]} alt={item.name} />
                  <div className="search-result-info">
                    {/* button の中には見出し（h2）を入れられない決まりなので p にしている */}
                    <p className="search-result-name">{item.name}</p>
                    {/* 拾得日時・拾得場所 */}
                    <p className="search-result-date">{formatDateTime(item.foundAt)}</p>
                    <p className="search-result-place">{item.foundPlace}</p>
                  </div>
                  {/* 保管場所ステータス */}
                  <span className={`search-result-status ${item.storageStatus.toLowerCase()}`}>
                    {STORAGE_STATUS_LABELS[item.storageStatus]}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>

        {/* ボトムナビゲーション（入出力項目6〜8。G027 と同じ形。この画面はホームから来るので「ホーム」を選択中にする） */}
        <nav className="search-result-bottom-nav">
          {/* イベント4: ホームタブ押下 → G011 */}
          <Link to={ROUTES.home} className="search-result-nav-item active">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span>ホーム</span>
          </Link>
          {/* イベント5: 投稿タブ押下 → G021 */}
          <Link to={ROUTES.post} className="search-result-nav-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="3"></circle>
            </svg>
            <span>投稿</span>
          </Link>
          {/* イベント6: マイページタブ押下 → G024 */}
          <Link to={ROUTES.mypage} className="search-result-nav-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span>マイページ</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}
