import './StudentMessageConfirm.css'

// G036 メッセージ確認画面（studentMessageConfirm）
// 主なAPI（仮）: E-2 申請の詳細（getApplication。落とし物の名前・写真）、D-3 感謝メッセージの送信（sendMessage）
// 11/28: 落とし物の仮データ（ピンクポーチ）と「試運転用」の送信をやめて、api をつないだ

import { useEffect, useState, useRef } from 'react'
import {
  useNavigate,
  useLocation,
  useParams,
  Navigate,
} from 'react-router-dom'
import { ImageOff } from 'lucide-react'
import ScreenLayout from '../../../components/ScreenLayout'
import { getApplication } from '../../../api/applications'
import { sendMessage } from '../../../api/messages'

// 送信APIのエラー → 画面に出す文（文言は設計書に記載なし。仮）
const SEND_ERRORS = {
  ALREADY_SENT: 'この落とし物の感謝メッセージは、すでに送信しています。',
  NOT_HANDED_OVER: 'まだ受け渡しが完了していないため、送信できません。',
}
const DEFAULT_SEND_ERROR = 'メッセージの送信に失敗しました。'

const ROUTES = {
  write: (id) => `/mypage/applications/${id}/message`,
  complete: (id) => `/mypage/applications/${id}/message/complete`,
}

export default function StudentMessageConfirm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()

  // G035から入力内容を受け取る
  const form = location.state?.form

  // 落とし物情報（感謝メッセージの対象）。申請ID（URL の :id）から取る（E-2）。読み込むまでは null
  const [post, setPost] = useState(null)
  const [postError, setPostError] = useState('')
  useEffect(() => {
    let ignore = false // 画面を離れたあとに届いた結果は使わない
    getApplication(id)
      .then((application) => {
        if (!ignore) setPost(application.post)
      })
      .catch(() => {
        if (!ignore) setPostError('落とし物の情報を読み込めませんでした。')
      })
    return () => {
      ignore = true
    }
  }, [id])
  const itemName = post ? post.itemName : postError || '読み込み中…'
  const itemImages = (post?.postImageUrls ?? []).slice(0, 4)

  // 送信中は、ボタンを押せないようにする
  const [sending, setSending] = useState(false)

  // 現在表示している画像
  const [currentImage, setCurrentImage] = useState(0)
  const touchStartX = useRef(null)

  // エラーメッセージ
  const [errorMessage, setErrorMessage] = useState('')

  // イベント1：G035へ戻る
  // 入力内容を保持したまま戻る
  const backToMessageWrite = () => {
    navigate(ROUTES.write(id), {
      state: {
        ...location.state,
        form,
      },
      replace: true,
    })
  }

  // 画像のスワイプ開始
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  // 画像のスワイプ終了
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return

    const distance =
      touchStartX.current - e.changedTouches[0].clientX

    if (itemImages.length > 1) {
      // 左にスワイプ：次の画像
      if (distance > 50) {
        setCurrentImage((prev) =>
          Math.min(prev + 1, itemImages.length - 1)
        )
      }

      // 右にスワイプ：前の画像
      if (distance < -50) {
        setCurrentImage((prev) =>
          Math.max(prev - 1, 0)
        )
      }
    }

    touchStartX.current = null
  }

  // イベント2：メッセージを送信する
  //   申請IDとメッセージ内容（form.messageBody）を送る（D-3）。投稿者への通知はサーバーが作る。
  //   登録できたときだけ G037 へ。失敗したら、この画面にとどまってエラーを出す
  const submitMessage = async () => {
    if (sending) return
    setErrorMessage('')
    setSending(true)
    try {
      await sendMessage(id, form.messageBody)
      navigate(ROUTES.complete(id), {
        replace: true,
      })
    } catch (err) {
      setErrorMessage(SEND_ERRORS[err.message] ?? DEFAULT_SEND_ERROR)
      setSending(false)
    }
  }

  // G035を経由せずにアクセスした場合
  if (!form || typeof form.messageBody !== 'string') {
    return (
      <Navigate
        to={ROUTES.write(id)}
        replace
      />
    )
  }

  return (
    <ScreenLayout
      title="メッセージ内容の確認"
      onBack={backToMessageWrite}
      backDisabled={sending}
      steps={1}
      stepsLabel="送信の手順"
      contentClassName="page message-confirm"
      footer={
        <div className="message-confirm__footer">

          {errorMessage && (
            <p className="form-error" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="button"
            id="submitMessage"
            className="btn btn--primary"
            onClick={submitMessage}
            disabled={sending}
          >
            {sending ? '送信中…' : '送信する'}
          </button>

        </div>
      }
    >



      {/* スクロール可能なコンテンツ */}
      <main className="message-confirm__content">

        <div className="message-confirm__card">

          {/* 落とし物の画像 */}
          <div className="message-confirm__image-area">

            {itemImages.length > 0 ? (
              <>
                <div
                  className="message-confirm__image-wrapper"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={() => {
                    touchStartX.current = null
                  }}
                >
                  <img
                    id="itemImage"
                    src={itemImages[currentImage]}
                    alt={`落とし物の写真${currentImage + 1}`}
                    draggable={false}
                  />
                </div>

                {/* 画像の位置表示 */}
                {itemImages.length > 1 && (
                  <div className="message-confirm__dots">
                    {itemImages.map((url, index) => (
                      <button
                        key={index}
                        type="button"
                        className={
                          index === currentImage
                            ? 'message-confirm__dot message-confirm__dot--active'
                            : 'message-confirm__dot'
                        }
                        onClick={() => setCurrentImage(index)}
                        aria-label={`写真${index + 1}を表示`}
                        aria-pressed={index === currentImage}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="message-confirm__no-image">
                <ImageOff size={40} />
                <span>画像がありません</span>
              </div>
            )}

          </div>

          {/* 落とし物名 */}
          <h2
            id="itemName"
            className="message-confirm__item-name"
          >
            {itemName}
          </h2>

          {/* メッセージ内容 */}
          <dl className="message-confirm__details">
            <div className="message-confirm__detail-row">
              <dt>内容</dt>

              <dd id="messageBody">
                {form.messageBody}
              </dd>
            </div>
          </dl>

        </div>
      </main>


    </ScreenLayout>
  )
}
