// G032 メッセージ一覧画面（studentMessageList）
// 主なAPI（仮）: D-1 メッセージ一覧（GET /api/student/messages?box=received|sent）
// 置き場所: src/features/message/pages/StudentMessageList.jsx（App.jsx: /mypage/messages）
// 見た目は G027（StudentMyPostList）の一覧に合わせている。
//
// 【選択中のタブ】
//   URL の ?box=sent で覚える（受信のときは何も付けない）。
//   G013 から「戻る」で帰ってきたときに、見ていたタブのまま表示するため。

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getMessages } from '../../../api/messages'
import { formatDateTime } from '../../../utils/date'
import BottomNav from '../../../components/BottomNav'
import './StudentMessageList.css'

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  home: '/home', // G011 投稿一覧
  post: '/post', // G021 落とし物投稿
  mypage: '/mypage', // G024 マイページ
  messageDetail: (messageId) => `/messages/${messageId}`, // G013 メッセージ詳細
}

// タブ（入出力項目2・3）
const TABS = [
  { box: 'received', label: '受信メッセージ' },
  { box: 'sent', label: '送信メッセージ' },
]

// 0件のときの文（設計書に記載なし。仮）
const EMPTY_TEXTS = {
  received: '受け取ったメッセージはありません。',
  sent: '送ったメッセージはありません。',
}

// 送信者のアイコン（アイコンの仕様が決まるまでの仮。G013 の仮アイコンと同じ形）
// 色はニックネームから決める（同じ人はいつも同じ色）
const AVATAR_COLORS = [
  { bg: '#ffe4e6', fg: '#fda4af' }, // ピンク（G013 と同じ）
  { bg: '#dbeafe', fg: '#93c5fd' }, // 青
  { bg: '#dcfce7', fg: '#86efac' }, // 緑
  { bg: '#ffedd5', fg: '#fdba74' }, // オレンジ
  { bg: '#ede9fe', fg: '#c4b5fd' }, // むらさき
]

function Avatar({ name, src }) {
  const [failed, setFailed] = useState(false)

  if (src && !failed) {
    return <img src={src} alt="" className="message-list-thumb-img" onError={() => setFailed(true)} />
  }

  const sum = [...name].reduce((total, char) => total + char.charCodeAt(0), 0)
  const color = AVATAR_COLORS[sum % AVATAR_COLORS.length]
  return (
    <svg width="64" height="64" viewBox="0 0 56 56" aria-hidden="true">
      <rect width="56" height="56" fill={color.bg} />
      <circle cx="28" cy="22" r="10" fill={color.fg} />
      <path d="M6 56 C6 44 16 38 28 38 C40 38 50 44 50 56 Z" fill={color.fg} />
    </svg>
  )
}

// 落とし物の写真（写真がないとき／読み込めないときは、灰色の枠にアイコン。G027 と同じ）
function ItemImage({ src, alt }) {
  const [failed, setFailed] = useState(false)

  if (src && !failed) {
    return <img src={src} alt={alt} className="message-list-thumb-img" onError={() => setFailed(true)} />
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  )
}

export default function StudentMessageList() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  // 初期表示は「受信メッセージ」（設計書）
  const box = searchParams.get('box') === 'sent' ? 'sent' : 'received'

  // 取得結果。「どのタブの結果か」と一緒に持つ（タブを切り替えた直後は「読み込み中」になる）
  const [result, setResult] = useState({ box: null, messages: [], error: '' })
  const loading = result.box !== box

  useEffect(() => {
    let ignore = false

    getMessages(box)
      .then((messages) => {
        if (!ignore) setResult({ box, messages, error: '' })
      })
      .catch(() => {
        // 文言は設計書に記載なし（仮）
        if (!ignore) setResult({ box, messages: [], error: '読み込めませんでした。時間をおいて、もう一度お試しください。' })
      })

    return () => {
      ignore = true
    }
  }, [box])

  // イベント2・3: タブ押下 → 選んだ方の一覧を表示する（replace: タブの切り替えを履歴に残さない）
  const handleTabChange = (nextBox) => {
    setSearchParams(nextBox === 'sent' ? { box: 'sent' } : {}, { replace: true })
  }

  return (
    <div className="message-list-page-wrapper">
      {/* スマホ枠 */}
      <div className="message-list-mobile-container">
        {/* ヘッダー */}
        <header className="message-list-header">
          {/* 入出力項目1: 戻る（イベント1 → G024 マイページ） */}
          <button className="message-list-back-btn" onClick={() => navigate(ROUTES.mypage)} aria-label="戻る">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          {/* タイトルは設計書に記載なし（旧スライドの文言） */}
          <h1 className="message-list-title">感謝メッセージボックス</h1>
        </header>

        {/* 入出力項目2・3: 受信メッセージ／送信メッセージのタブ */}
        <div className="message-list-tabs" role="tablist" aria-label="メッセージの種類">
          {TABS.map((tab) => (
            <button
              key={tab.box}
              type="button"
              role="tab"
              aria-selected={box === tab.box}
              className={`message-list-tab ${box === tab.box ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.box)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 入出力項目4: メッセージ一覧（ここだけスクロールする） */}
        <div className="message-list" role="tabpanel">
          {loading && <p className="message-list-message">読み込み中…</p>}

          {!loading && result.error && (
            <p className="message-list-message error" role="alert">{result.error}</p>
          )}

          {!loading && !result.error && result.messages.length === 0 && (
            <p className="message-list-message">{EMPTY_TEXTS[box]}</p>
          )}

          {!loading &&
            result.messages.map((message) => {
              // 受信: 送信者のアイコン・ニックネーム／送信: 落とし物の画像・落とし物名
              const isReceived = box === 'received'
              const name = isReceived ? message.senderNickname : message.post?.itemName ?? ''
              return (
                // 入出力項目5: メッセージカード（イベント4 → G013 メッセージ詳細）
                <button
                  key={message.messageId}
                  type="button"
                  className="message-list-item"
                  onClick={() => navigate(ROUTES.messageDetail(message.messageId))}
                >
                  <div className={`message-list-thumb ${isReceived ? 'avatar' : ''}`}>
                    {isReceived ? (
                      <Avatar name={message.senderNickname} />
                    ) : (
                      <ItemImage src={message.post?.postImageUrls[0]} alt={name} />
                    )}
                  </div>
                  <div className="message-list-info">
                    <p className="message-list-name">{name}</p>
                    {/* 長いメッセージは1行で切って「…」を付ける（CSS） */}
                    <p className="message-list-body">{message.messageBody}</p>
                    <p className="message-list-date">{formatDateTime(message.sentAt)}</p>
                  </div>
                  <svg className="message-list-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 6 15 12 9 18"></polyline>
                  </svg>
                </button>
              )
            })}
        </div>

        {/* 入出力項目6〜8: 下タブ（共通部品 BottomNav。イベント5〜7: ホーム→G011、投稿→G021、マイページ→G024）。マイページから来る画面なので「マイページ」を選択中にする */}
        <BottomNav active="mypage" />
      </div>
    </div>
  )
}
