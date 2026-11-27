import './StudentMessageConfirm.css'

// G036 メッセージ確認画面（studentMessageConfirm）

// G036 感謝メッセージ確認画面

import { useState, useRef } from 'react'
import {
  useNavigate,
  useLocation,
  useParams,
  Navigate,
} from 'react-router-dom'
import { ChevronLeft, ImageOff } from 'lucide-react'
import ProgressSteps from '../../../components/ProgressSteps'
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

  // 落とし物情報（現段階では仮データ）
  // TODO: バックエンド連携後、申請IDをもとに取得する
  const itemName = location.state?.itemName ?? 'ピンクポーチ'
  const itemImages = (location.state?.itemImages ?? []).slice(0, 4)

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
  const submitMessage = () => {
    setErrorMessage('')

    // 試運転用：G037へ遷移
    navigate(ROUTES.complete(id), {
      replace: true,
    })

    /*
    【バックエンド連携後の処理】

    1. 申請IDとメッセージ内容（form.messageBody）を
       サーバーへ送信する。

    2. 感謝メッセージをDBに登録する。

    3. 落とし物の投稿者への通知を作成する。

    4. 登録に成功した場合のみG037へ遷移する。

    navigate(ROUTES.complete(id), {
      replace: true,
    })

    5. 送信に失敗した場合は自画面に留まり、
       エラーメッセージを表示する。

    setErrorMessage(
      'メッセージの送信に失敗しました。'
    )

    ※API連携時には試運転用のnavigateを削除する。
    */
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
    <div className="page message-confirm">

      {/* ヘッダー */}
      <header className="message-confirm__header">
        <button
          type="button"
          id="backToMessageWrite"
          className="message-confirm__back"
          onClick={backToMessageWrite}
          aria-label="戻る"
        >
          <ChevronLeft size={22} />
        </button>

        <h1 className="message-confirm__title">
          メッセージ内容の確認
        </h1>
      </header>

      {/* 共通の進行状況表示 */}
      <div className="message-confirm__steps">
        <ProgressSteps
          current={1}
          label="送信の手順"
        />
      </div>

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

      {/* 送信ボタン */}
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
        >
          送信する
        </button>

      </div>

    </div>
  )
}
