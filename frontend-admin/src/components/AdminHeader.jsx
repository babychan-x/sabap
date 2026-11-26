import './AdminHeader.css'

// 管理者用の、画面の上のヘッダー（戻るボタン＋タイトル）。画面の上に固定して表示する。
// 見た目は、学生用のデザイン担当の画面（G025〜G029）のヘッダーを、PC 幅に広げたもの。
//
// 使い方:
//   <AdminHeader title="投稿一覧" onBack={() => navigate('/home')} />
//     onBack: 戻るボタンを押したときの動き。渡さなければ、戻るボタンは出ない（完了画面・ホームなど）
//     backDisabled: true にすると、戻るボタンを押せなくする（送信中など）
//     children: ヘッダーの右側に置きたいもの（ボタンなど）があれば、中に書く
//     subtitle: タイトルの下の小さい文字（G048 ホームのメールアドレスなど）
//
// 画面の骨組み（例）:
//   <div className="admin-page">
//     <AdminHeader title="投稿一覧" onBack={…} />
//     <main className="admin-main"><div className="admin-container">…</div></main>
//   </div>
export default function AdminHeader({ title, subtitle, onBack, backDisabled = false, children }) {
  return (
    <header className="admin-header">
      <div className="admin-header-inner">
        {onBack && (
          <button type="button" className="admin-header-back" onClick={onBack} disabled={backDisabled} aria-label="戻る">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}
        <div className="admin-header-titles">
          <h1 className="admin-header-title">{title}</h1>
          {subtitle && <p className="admin-header-subtitle">{subtitle}</p>}
        </div>
        {children && <div className="admin-header-actions">{children}</div>}
      </div>
    </header>
  )
}
