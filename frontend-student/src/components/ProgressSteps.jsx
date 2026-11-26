import { Fragment } from 'react'
import './ProgressSteps.css'

// 進行状況の表示（入力 → 確認 → 完了）。今の位置だけ青く強調する。
// 見た目は G029（StudentMyPostEdit）の進行状況と同じ（デザイン担当の画面に合わせた）。
// 使い方: <ProgressSteps current={0} />  （0=入力、1=確認、2=完了）
// 入力→確認→完了の流れがある画面は、すべてこの部品を使う（古い StepIndicator は削除した）。
const DEFAULT_STEPS = ['入力', '確認', '完了']

export default function ProgressSteps({ current, steps = DEFAULT_STEPS, label = '手順' }) {
  return (
    <ol className="progress-steps" aria-label={label}>
      {steps.map((text, index) => (
        <Fragment key={text}>
          {index > 0 && <li className="progress-steps-line" aria-hidden="true" />}
          <li
            className={`progress-steps-step ${index === current ? 'current' : ''}`}
            aria-current={index === current ? 'step' : undefined}
          >
            <span className="progress-steps-circle">{index + 1}</span>
            <span className="progress-steps-label">{text}</span>
          </li>
        </Fragment>
      ))}
    </ol>
  )
}
