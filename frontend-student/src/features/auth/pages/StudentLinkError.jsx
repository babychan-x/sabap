import './StudentLinkError.css'


// G039 リンクエラー画面

import { useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import ScreenLayout from '../../../components/ScreenLayout'

// エラーの原因ごとに表示するメッセージ
const ERROR_MESSAGES = {
  expired: {
    title: 'リンクの有効期限が切れています',
    description: [
      '有効期限を過ぎたため、',
      'このリンクはご利用いただけません。',
      'お手数ですが、もう一度お試しください。',
    ],
  },

  invalid: {
    title: 'リンクが無効です',
    description: [
      'このリンクはご利用いただけません。',
      'お手数ですが、もう一度お試しください。',
    ],
  },

  used: {
    title: 'このリンクは使用済みです',
    description: [
      'このリンクは既に使用されています。',
      '同じリンクを再度ご利用いただくことはできません。',
    ],
  },
}

export default function StudentLinkError() {
  const location = useLocation()

  // 遷移元からエラーの原因を取得
  // 試運転時は有効期限切れとして表示
  const reason = location.state?.reason ?? 'expired'

  const message =
    ERROR_MESSAGES[reason] ?? ERROR_MESSAGES.invalid

  return (
    <ScreenLayout
      contentClassName="page link-error"
    >

      <main className="link-error__content">

        {/* エラーアイコン */}
        <div className="link-error__icon">
          <X
            size={96}
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </div>

        {/* エラータイトル */}
        <h1 className="link-error__heading">
          {message.title}
        </h1>

        {/* エラーの説明文 */}
        <div className="link-error__description">
          {message.description.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>

      </main>

    </ScreenLayout>
  )
}
