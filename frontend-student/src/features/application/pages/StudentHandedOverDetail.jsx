// G034 受け渡し済み詳細画面（studentHandedOverDetail）
// 主なAPI（仮）: E-2 申請の詳細（GET /api/student/applications/{id}）
// 置き場所: src/features/application/pages/StudentHandedOverDetail.jsx（App.jsx: /mypage/applications/:id/handed-over）
// 見た目は G014（StudentApprovalDetail）と G019（StudentApplyConfirm）のカードに合わせている。

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getApplication } from '../../../api/applications'
import PhotoSlider from '../../../components/PhotoSlider'
import { formatDateTime } from '../../../utils/date'
import './StudentHandedOverDetail.css'

// ---------------------------------------------------------------
// 遷移先のパス（App.jsx のルーティングと同じ）
// ---------------------------------------------------------------
const ROUTES = {
  applyList: '/mypage/applications', // G033 受け取り申請一覧
  messageWrite: (applicationId) => `/mypage/applications/${applicationId}/message`, // G035 メッセージ記述
}

// 読み込めないときの文（設計書に記載なし。仮）
const LOAD_ERRORS = {
  NOT_FOUND: 'この申請は見つかりませんでした。',
  NOT_HANDED_OVER: 'この申請は、まだ受け渡しが済んでいません。',
}
const DEFAULT_LOAD_ERROR = '読み込めませんでした。時間をおいて、もう一度お試しください。'

export default function StudentHandedOverDetail() {
  const navigate = useNavigate()
  const { id } = useParams() // /mypage/applications/:id/handed-over の申請ID

  // 取得結果。「どのIDの結果か」と一緒に持つ（別の申請を開いた直後は「読み込み中」になる）
  const [result, setResult] = useState({ id: null, application: null, error: '' })
  const loading = result.id !== id

  useEffect(() => {
    let ignore = false

    getApplication(id)
      .then((application) => {
        if (ignore) return
        // 受け渡し済みでない申請を、URL を直接入力して開いたとき（仮）
        if (!application.handedOver) {
          setResult({ id, application: null, error: LOAD_ERRORS.NOT_HANDED_OVER })
          return
        }
        setResult({ id, application, error: '' })
      })
      .catch((err) => {
        if (!ignore) setResult({ id, application: null, error: LOAD_ERRORS[err.message] ?? DEFAULT_LOAD_ERROR })
      })

    return () => {
      ignore = true
    }
  }, [id])

  const application = loading ? null : result.application
  const item = application?.item

  return (
    <div className="handed-over-page-wrapper">
      {/* スマホ枠 */}
      <div className="handed-over-mobile-container">
        {/* ヘッダー */}
        <header className="handed-over-header">
          {/* 入出力項目1: 戻る（イベント1 → G033 受け取り申請一覧） */}
          <button className="handed-over-back-btn" onClick={() => navigate(ROUTES.applyList)} aria-label="戻る">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          {/* タイトルは設計書に記載なし（旧スライドの文言。G014 と同じ） */}
          <h1 className="handed-over-title">申請結果の詳細</h1>
        </header>

        {/* 本文エリア（ここだけスクロールする） */}
        <div className="handed-over-content">
          {loading && <p className="handed-over-message">読み込み中…</p>}

          {!loading && result.error && (
            <p className="handed-over-message error" role="alert">{result.error}</p>
          )}

          {application && (
            <section className="handed-over-card">
              {/* 入出力項目2・3: 画像（スワイプで切り替え。イベント2）と画像位置表示 */}
              <PhotoSlider key={application.id} images={item?.images ?? []} alt={item?.name ?? ''}>
                {/* 入出力項目4: 申請結果スタンプ（「受け渡し済」） */}
                <span className="handed-over-stamp">受け渡し済</span>
              </PhotoSlider>

              <div className="handed-over-body">
                {/* 入出力項目5: 落とし物名 */}
                <h2 className="handed-over-item-name">{item?.name}</h2>

                <dl className="handed-over-list">
                  {/* 入出力項目6: カテゴリー */}
                  <div className="handed-over-row">
                    <dt>カテゴリー</dt>
                    <dd>{item?.category}</dd>
                  </div>
                  {/* 入出力項目7: 拾得日時 */}
                  <div className="handed-over-row">
                    <dt>拾得日時</dt>
                    <dd>{item ? formatDateTime(item.foundAt) : ''}</dd>
                  </div>
                  {/* 入出力項目8: 拾得場所 */}
                  <div className="handed-over-row">
                    <dt>拾得場所</dt>
                    <dd>{item?.foundPlace}</dd>
                  </div>
                  {/* 入出力項目9: 特徴（未入力なら「特になし」） */}
                  <div className="handed-over-row">
                    <dt>特徴</dt>
                    <dd>{item?.features || '特になし'}</dd>
                  </div>
                  {/* 入出力項目10: 申請理由（申請時に入力した内容。改行もそのまま表示） */}
                  <div className="handed-over-row">
                    <dt>申請理由</dt>
                    <dd className="handed-over-reason">{application.reason}</dd>
                  </div>
                </dl>
              </div>
            </section>
          )}
        </div>

        {/* 入出力項目11: 感謝メッセージを書く（イベント3 → G035。下に固定） */}
        {application && (
          <div className="handed-over-footer">
            <button
              type="button"
              className="handed-over-message-btn"
              onClick={() => navigate(ROUTES.messageWrite(application.id))}
              // 感謝メッセージを送信済みなら押せない（設計書に記載なし。仮）
              disabled={application.messageSent}
            >
              {application.messageSent ? '感謝メッセージは送信済みです' : '感謝メッセージを書く'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
