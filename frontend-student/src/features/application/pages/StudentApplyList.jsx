// G033 受け取り申請一覧画面（studentApplyList）
// 主なAPI（仮）: E-1 受け取り申請一覧（GET /api/student/applications）、申請を既読にする（パスは仮）
// 置き場所: src/features/application/pages/StudentApplyList.jsx（App.jsx: /mypage/applications）
// 見た目は G027（StudentMyPostList）の一覧に合わせている。

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApplications, markApplicationRead } from '../../../api/applications'
import BottomNav from '../../../components/BottomNav'
import { formatDateTime } from '../../../utils/date'
import './StudentApplyList.css'

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  mypage: '/mypage', // G024 マイページ
  approvalDetail: (applicationId) => `/applications/${applicationId}/approval`, // G014 承認詳細
  handedOverDetail: (applicationId) => `/mypage/applications/${applicationId}/handed-over`, // G034 受け渡し済み詳細
}

// 申請状況のバッジ（ピル型）。設計書 G033 の5種類
//   「取り下げ済み」は、取り下げ機能が削除済みだが、設計書の文言どおり残している（2026/11/24 ユーザーが決定。第12章 9）
//   色は設計書に記載なし（仮）
const BADGES = {
  PENDING: { label: '承認待ち', className: 'pending' },
  APPROVED: { label: '承認', className: 'approved' },
  REJECTED: { label: '却下', className: 'rejected' },
  HANDED_OVER: { label: '済', className: 'handed-over' },
  WITHDRAWN: { label: '取り下げ済み', className: 'withdrawn' },
}

// バッジの種類を決める（受け渡し済みなら「済」、それ以外は申請状況のまま）
const badgeKey = (application) => (application.handedOver ? 'HANDED_OVER' : application.status)

// 結果（承認・却下）が出ていて、まだ確認していない申請に NEW マークを付ける
const isNew = (application) =>
  !application.resultRead && (application.status === 'APPROVED' || application.status === 'REJECTED')

// 案内文（文言は設計書に記載なし。旧スライドの文言）
const guideText = (application) => {
  if (application.handedOver) {
    return application.messageSent ? '' : '感謝メッセージを送信しましょう'
  }
  if (application.status === 'APPROVED') return '受け取り期限を確認してください'
  return ''
}

// イベント2の遷移先: 受け渡し済み → G034、それ以外（承認済み・却下済み・承認待ち・取り下げ済み） → G014
//   承認待ちは設計書に記載なし。2026/11/24 ユーザーが G014 に決定（仮）。取り下げ済みも G014（仮）
const detailPath = (application) =>
  application.handedOver ? ROUTES.handedOverDetail(application.id) : ROUTES.approvalDetail(application.id)

// 落とし物の写真（写真がないとき／読み込めないときは、灰色の枠にアイコン。G027 と同じ）
function Thumbnail({ src, alt }) {
  const [failed, setFailed] = useState(false)

  if (src && !failed) {
    return <img src={src} alt={alt} className="apply-list-img" onError={() => setFailed(true)} />
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  )
}

export default function StudentApplyList() {
  const navigate = useNavigate()

  // 取得結果（loading: 読み込み中かどうか）
  const [result, setResult] = useState({ loading: true, applications: [], error: '' })

  useEffect(() => {
    let ignore = false

    getApplications()
      .then((applications) => {
        if (!ignore) setResult({ loading: false, applications, error: '' })
      })
      .catch(() => {
        // 文言は設計書に記載なし（仮）
        if (!ignore) setResult({ loading: false, applications: [], error: '読み込めませんでした。時間をおいて、もう一度お試しください。' })
      })

    return () => {
      ignore = true
    }
  }, [])

  // イベント2: 申請カード選択 → 既読にして（NEW マークを消す）、申請状況に応じた詳細画面へ
  const handleSelect = (application) => {
    if (isNew(application)) {
      // 既読にできなくても、詳細画面は開く（失敗しても画面は止めない。仮）
      markApplicationRead(application.id).catch(() => {})
    }
    navigate(detailPath(application))
  }

  const { loading, applications, error } = result

  return (
    <div className="apply-list-page-wrapper">
      {/* スマホ枠 */}
      <div className="apply-list-mobile-container">
        {/* ヘッダー */}
        <header className="apply-list-header">
          {/* 入出力項目1: 戻る（イベント1 → G024 マイページ） */}
          <button className="apply-list-back-btn" onClick={() => navigate(ROUTES.mypage)} aria-label="戻る">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          {/* タイトルは設計書に記載なし（旧スライドの文言） */}
          <h1 className="apply-list-title">受け取り申請一覧</h1>
        </header>

        {/* 入出力項目2: 受け取り申請一覧（ここだけスクロールする） */}
        <div className="apply-list">
          {loading && <p className="apply-list-message">読み込み中…</p>}

          {!loading && error && (
            <p className="apply-list-message error" role="alert">{error}</p>
          )}

          {!loading && !error && applications.length === 0 && (
            // 文言は設計書に記載なし（仮）
            <p className="apply-list-message">受け取り申請はまだありません。</p>
          )}

          {!loading &&
            applications.map((application) => {
              const badge = BADGES[badgeKey(application)]
              const guide = guideText(application)
              const name = application.item?.name ?? ''
              return (
                // 入出力項目3: 申請カード（イベント2）
                <button
                  key={application.id}
                  type="button"
                  className="apply-list-item"
                  onClick={() => handleSelect(application)}
                >
                  {/* 落とし物の画像（結果を未確認なら、左上に NEW マーク） */}
                  <div className="apply-list-img-wrapper">
                    <Thumbnail src={application.item?.image} alt={name} />
                    {isNew(application) && <span className="apply-list-new">NEW</span>}
                  </div>

                  <div className="apply-list-info">
                    <div className="apply-list-name-row">
                      {/* 申請状況のバッジ */}
                      {badge && <span className={`apply-list-badge ${badge.className}`}>{badge.label}</span>}
                      <p className="apply-list-name">{name}</p>
                    </div>
                    {/* 案内文（承認済み／受け渡し済みで感謝メッセージ未送信のときだけ） */}
                    {guide && <p className="apply-list-guide">{guide}</p>}
                    {/* 申請日時 */}
                    <p className="apply-list-date">{formatDateTime(application.appliedAt)}</p>
                  </div>

                  <svg className="apply-list-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 6 15 12 9 18"></polyline>
                  </svg>
                </button>
              )
            })}
        </div>

        {/* 入出力項目4〜6: 下タブ（共通部品 BottomNav。イベント3〜5: ホーム→G011、投稿→G021、マイページ→G024）。マイページから来る画面なので「マイページ」を選択中にする */}
        <BottomNav active="mypage" />
      </div>
    </div>
  )
}
