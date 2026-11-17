import './StepIndicator.css'

// 進行状況表示（入力 → 確認 → 完了）。今の位置を強調する。
// 使い方: <StepIndicator current={0} />   0=入力, 1=確認, 2=完了
const STEPS = ['入力', '確認', '完了']

export default function StepIndicator({ current }) {
  return (
    <ol className="step-indicator" aria-label="登録の進行状況">
      {STEPS.map((label, index) => (
        <li
          key={label}
          className={
            'step-indicator__item' +
            (index === current ? ' step-indicator__item--current' : '')
          }
          aria-current={index === current ? 'step' : undefined}
        >
          {label}
        </li>
      ))}
    </ol>
  )
}
