import { useState } from 'react'
import BottomNav from './BottomNav'
import ProgressSteps from './ProgressSteps'
import './ScreenLayout.css'

// 画面の外枠（全画面で共通。2026/11/27 作成）。
// ヘッダー・進行状況・下のボタン・下タブは上下に固定して、真ん中の「中身」だけがスクロールする。
// 見た目は G027・G028（デザイン担当の画面）と同じ。画面名の大きさ・文字の種類・色は、ここだけで決まる。
//
// 使い方（いちばんよく使う形）:
//   <ScreenLayout title="投稿の詳細" onBack={() => navigate('/mypage/posts')} contentClassName="my-post-detail-content">
//     …中身…
//   </ScreenLayout>
//
// 渡せるもの（どれも、いらなければ渡さない）:
//   title           ヘッダーの画面名。渡さないと、ヘッダーの帯を出さない（ログイン画面など）
//   onBack          戻るボタンを押したときの動き。渡さないと、戻るボタンを出さない
//   backDisabled    true のとき、戻るボタンを押せなくする（送信中など）
//   headerActions   ヘッダーの右側に置くもの
//   header          ヘッダーを丸ごと差し替える（ホーム・検索結果のように、形が違うヘッダー）
//   steps           進行状況（0=入力、1=確認、2=完了）。渡すと、ヘッダーの下に固定で出す
//   stepsLabel      進行状況の読み上げ用の名前（例: '申請の手順'）
//   subHeader       ヘッダー（と進行状況）の下に固定するもの（G032 のタブなど）
//   footer          下に固定するもの（「確認する」ボタンなど）
//   bottomNav       下タブを出すときの選択中のタブ（'home' / 'post' / 'mypage'）
//   background      'gray' にすると、背景を薄い灰色（#f7f8fa）にする（白いカードを浮かせる画面）
//   contentClassName 中身（スクロールする所）に付ける、画面ごとのクラス名（余白など）
//   contentRef      中身（スクロールする所）を、画面から動かしたいときに使う（エラーのときに一番上へ戻す、など）
//   overlay         画面全体に重ねるもの（確認ダイアログなど。中身と一緒にスクロールしないように、中身の外に置く）
export default function ScreenLayout({
  title,
  onBack,
  backDisabled = false,
  headerActions,
  header,
  steps,
  stepsLabel,
  subHeader,
  footer,
  bottomNav,
  background = 'white',
  contentClassName = '',
  contentRef,
  overlay,
  children,
}) {
  // 中身を少しでも下にスクロールしたら true（進行状況の下に影を出す）
  const [scrolled, setScrolled] = useState(false)
  const hasSteps = steps !== undefined && steps !== null

  const handleScroll = (e) => {
    if (!hasSteps) return
    const next = e.currentTarget.scrollTop > 0
    if (next !== scrolled) setScrolled(next)
  }

  return (
    // PC で見たとき、灰色の背景の真ん中にスマホ枠を置く
    <div className="screen-layout-wrapper">
      <div className={`screen-layout ${background === 'gray' ? 'gray' : ''}`}>
        {/* ヘッダー（画面名）。上に固定 */}
        {header ??
          (title && (
            <header className={`screen-layout-header ${onBack ? '' : 'no-back'}`}>
              {onBack && (
                <button
                  type="button"
                  className="screen-layout-back-btn"
                  onClick={onBack}
                  disabled={backDisabled}
                  aria-label="戻る"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
              )}
              <h1 className="screen-layout-title">{title}</h1>
              {headerActions && <div className="screen-layout-header-actions">{headerActions}</div>}
            </header>
          ))}

        {/* 進行状況（入力→確認→完了）。ヘッダーの下に固定。中身をスクロールすると下に影が出る */}
        {hasSteps && (
          <div className={`screen-layout-steps ${scrolled ? 'is-scrolled' : ''}`}>
            <ProgressSteps current={steps} label={stepsLabel} />
          </div>
        )}

        {/* ヘッダーの下に固定するもの（タブなど） */}
        {subHeader}

        {/* 中身（ここだけスクロールする） */}
        <div ref={contentRef} className={`screen-layout-content ${contentClassName}`} onScroll={handleScroll}>
          {children}
        </div>

        {/* 下に固定するボタン */}
        {footer && <div className="screen-layout-footer">{footer}</div>}

        {/* 下タブ（ホーム・投稿・マイページ）。いちばん下に固定 */}
        {bottomNav && <BottomNav active={bottomNav} />}

        {/* 画面全体に重ねるもの（ダイアログなど） */}
        {overlay}
      </div>
    </div>
  )
}
