import { useEffect, useId } from 'react'
import './AdminDialog.css'

// 管理者用のダイアログ（画面の上に重ねて出す、確認・完了の小さな窓）の「枠」。
// 見た目は学生用 G028 のダイアログ（D001・D002）と同じ。中身（文言・ボタン）は、使う側で渡す。
// D003〜D018 の各ダイアログ（features/*/dialogs/）で使う想定。
//
// 使い方（確認ダイアログの例）:
//   {showDialog && (
//     <AdminDialog
//       icon="warning"
//       title="この申請を承認しますか？"
//       onClose={() => setShowDialog(false)}
//       actions={
//         <>
//           <button className="admin-btn admin-btn-muted" onClick={() => setShowDialog(false)}>戻る</button>
//           <button className="admin-btn admin-btn-primary" onClick={handleApprove}>承認する</button>
//         </>
//       }
//     >
//       「黒い折り畳み財布」の申請を承認します。
//     </AdminDialog>
//   )}
//
//   icon: 'warning'（！の三角。確認のとき）/ 'success'（チェック。完了のとき）/ 渡さなければアイコンなし
//   onClose: Esc キー・右上の「×」・後ろの暗い所を押したときの動き。渡さなければ、どれでも閉じない（完了のときなど）
//   actions: 下に並べるボタン（admin-btn を使う。2つまでなら同じ幅で並ぶ）
//   children: タイトルの下の説明文
export default function AdminDialog({ icon, title, onClose, actions, children }) {
  const titleId = useId()

  // Esc キーで閉じる（onClose があるときだけ）
  useEffect(() => {
    if (!onClose) return undefined
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    // 後ろの暗い幕。幕そのものを押したときだけ閉じる（窓の中を押しても閉じない）
    <div
      className="admin-dialog-overlay"
      onClick={(e) => {
        if (onClose && e.target === e.currentTarget) onClose()
      }}
    >
      <div className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        {onClose && (
          <button type="button" className="admin-dialog-close" onClick={onClose} aria-label="閉じる">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="6" y1="6" x2="18" y2="18"></line>
              <line x1="18" y1="6" x2="6" y2="18"></line>
            </svg>
          </button>
        )}

        {icon === 'warning' && (
          <div className="admin-dialog-icon warning" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        )}
        {icon === 'success' && (
          <div className="admin-dialog-icon success" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="5 12.5 10 17.5 19 7.5"></polyline>
            </svg>
          </div>
        )}

        <h2 id={titleId} className="admin-dialog-title">
          {title}
        </h2>
        {children && <div className="admin-dialog-text">{children}</div>}
        {actions && <div className="admin-dialog-actions">{actions}</div>}
      </div>
    </div>
  )
}
