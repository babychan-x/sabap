// G016 検索結果一覧画面（studentSearchResult）
// 主なAPI（仮）: B-1 落とし物一覧・検索（src/api/items.js の getItems）
// 置き場所: src/features/item/pages/StudentSearchResult.jsx（App.jsx: /search?keyword=）
// 見た目は G011（StudentHome）・G027（StudentMyPostList）に合わせている。

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getItems } from '../../../api/items'
import { formatDateTime } from '../../../utils/date'
import { STORAGE_STATUS_LABELS } from '../../../utils/labels'
import './StudentSearchResult.css'
import ScreenLayout from '../../../components/ScreenLayout'

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  home: '/home', // G011 投稿一覧
  post: '/post', // G021 落とし物投稿
  mypage: '/mypage', // G024 マイページ
  // イベント3の遷移先「G015（申請結果詳細）」は、G017（落とし物詳細）と同じ画面（2026/11/24 確定）
  itemDetail: (postId) => `/items/${postId}`, // G015・G017 studentItemDetail
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
    <ScreenLayout
      title="検索結果一覧"
      onBack={() => navigate(ROUTES.home)}
      bottomNav="home"
      subHeader={
        // 入出力項目2: キーワード検索（ヘッダーの下に固定する。前と同じ。落とし物リストだけがスクロールする）
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
      }
    >
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
                key={item.postId}
                type="button"
                className="search-result-card"
                // イベント3: 落とし物カード選択 → 落とし物詳細画面
                onClick={() => navigate(ROUTES.itemDetail(item.postId))}
              >
                <Thumbnail src={item.postImageUrls[0]} alt={item.itemName} />
                <div className="search-result-info">
                  {/* button の中には見出し（h2）を入れられない決まりなので p にしている */}
                  <p className="search-result-name">{item.itemName}</p>
                  {/* 拾得日時・拾得場所 */}
                  <p className="search-result-date">{formatDateTime(item.foundAt)}</p>
                  <p className="search-result-place">{item.foundLocation}</p>
                </div>
                {/* 保管場所ステータス */}
                <span className={`search-result-status ${item.itemStatus.toLowerCase()}`}>
                  {STORAGE_STATUS_LABELS[item.itemStatus]}
                </span>
              </button>
            ))}
          </>
        )}
      </div>

    </ScreenLayout>
  )
}
