import './StudentPostItemConfirm.css'

// G022 投稿確認画面（studentPostItemConfirm）
// 主なAPI（仮）: B-3 落とし物の投稿（createItem。api/items.js。「投稿する」で実行）

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ScreenLayout from '../../../components/ScreenLayout'
import { createItem } from '../../../api/items'

export default function StudentPostItemConfirm() {
  const navigate = useNavigate()
  const location = useLocation()

  // G021から入力内容を受け取る
  const {
    // 項目名は G021 の previousData のところに書いてある（11/27 にそろえた）
    itemCategory: category = '',
    foundAt: foundDateTime = '',
    foundLocation: foundPlace = '',
    itemStatus: storageStatus = '',
    itemName = '',
    itemDescription: feature = '',
    // 写真のファイル（postImageFiles）は、下の「画像の表示用URLを生成」で location.state から直接使う
  } = location.state || {}

  // 画像プレビュー
  const [previewUrls, setPreviewUrls] = useState([])
  const [currentImage, setCurrentImage] = useState(0)

  // 画像のスワイプ操作
  const touchStartX = useRef(null)

  // エラーメッセージ
  const [errorMessage, setErrorMessage] = useState('')
  // 送信中は、ボタンを押せないようにする
  const [submitting, setSubmitting] = useState(false)

  // G021を経由せずにアクセスした場合
  useEffect(() => {
    if (!location.state) {
      navigate('/post', { replace: true })
    }
  }, [location.state, navigate])

  // 画像の表示用URLを生成
  useEffect(() => {
    const urls = (location.state?.postImageFiles || [])
      .slice(0, 4)
      .map((file) => URL.createObjectURL(file))

    setPreviewUrls(urls)

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [location.state])

  // 発見日時の表示形式を変更
  const formatDateTime = (dateTime) => {
    if (!dateTime) return '－'

    return dateTime
      .replace(/-/g, '/')
      .replace('T', ' ')
  }

  // G021へ戻る（入力内容を保持）
  // G021 から受け取った入力内容を、全部そのまま返す（11/27 修正）。
  //   前は7つの項目だけを返していたので、G021 の「建物」「階」「場所の詳しい説明」
  //   （foundBuilding・foundFloor・foundPlaceDetail）が、戻ったときに消えていた。
  const back = () => {
    navigate('/post', {
      replace: true,
      state: { ...location.state },
    })
  }

  // スワイプ開始
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  // スワイプ終了
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return

    const touchEndX = e.changedTouches[0].clientX
    const distance = touchStartX.current - touchEndX

    // 左にスワイプ：次の画像
    if (distance > 50) {
      setCurrentImage((prev) =>
        Math.min(prev + 1, previewUrls.length - 1)
      )
    }

    // 右にスワイプ：前の画像
    if (distance < -50) {
      setCurrentImage((prev) =>
        Math.max(prev - 1, 0)
      )
    }

    touchStartX.current = null
  }

  // イベント2: 投稿する → G023
  // 入力内容と画像をサーバーへ送り（B-3）、登録できたときだけ G023 へ進む（11/28 に「試運転用」をやめてつないだ）
  const submitPost = async () => {
    if (submitting) return
    setErrorMessage('')
    setSubmitting(true)
    try {
      await createItem(location.state)
      // replace: 投稿完了のあとに「戻る」で、この確認画面（もう一度投稿できる画面）に戻らないようにする
      navigate('/post/complete', { replace: true })
    } catch {
      // イベント3: 送信または登録に失敗したら、この画面にとどまり、エラーメッセージを出す
      setErrorMessage('投稿に失敗しました。もう一度お試しください。')
      setSubmitting(false)
    }
  }

  if (!location.state) return null

  return (
    <ScreenLayout
      title="投稿内容の確認"
      onBack={back}
      backDisabled={submitting}
      steps={1}
      stepsLabel="投稿の手順"
      contentClassName="page post-confirm"
      footer={
        <div className="post-confirm__footer">

          {/* 投稿失敗時のみ表示 */}
          {errorMessage && (
            <p className="form-error" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            id="submitPost"
            type="button"
            className="btn btn--primary"
            onClick={submitPost}
            disabled={submitting}
          >
            {submitting ? '投稿中…' : '投稿する'}
          </button>

        </div>
      }
    >


      {/* スクロール可能な投稿内容 */}
      <main className="post-confirm__content">

        <div className="post-confirm__card">

          {/* 画像表示 */}
          <div className="post-confirm__image-area">

            {previewUrls.length > 0 ? (
              <>
                <div
                  id="itemImage"
                  className="post-confirm__image-wrapper"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <img
                    src={previewUrls[currentImage]}
                    alt={`落とし物の写真${currentImage + 1}`}
                    draggable={false}
                  />
                </div>

                {/* 画像インジケーター */}
                <div className="post-confirm__dots">
                  {previewUrls.map((url, index) => (
                    <button
                      key={url}
                      type="button"
                      className={
                        index === currentImage
                          ? 'post-confirm__dot post-confirm__dot--active'
                          : 'post-confirm__dot'
                      }
                      onClick={() => setCurrentImage(index)}
                      aria-label={`写真${index + 1}を表示`}
                      aria-pressed={index === currentImage}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="post-confirm__no-image">
                画像がありません
              </div>
            )}

          </div>

          {/* タイトル */}
          <h2
            id="itemName"
            className="post-confirm__item-name"
          >
            {itemName || '－'}
          </h2>

          {/* 投稿情報 */}
          <dl className="post-confirm__details">

            <div className="post-confirm__detail-row">
              <dt>カテゴリー</dt>
              <dd id="category">{category || '－'}</dd>
            </div>

            <div className="post-confirm__detail-row">
              <dt>発見日時</dt>
              <dd id="foundDateTime">
                {formatDateTime(foundDateTime)}
              </dd>
            </div>

            <div className="post-confirm__detail-row">
              <dt>拾得場所</dt>
              <dd id="foundPlace">{foundPlace || '－'}</dd>
            </div>

            <div className="post-confirm__detail-row">
              <dt>保管場所</dt>
              <dd id="storageStatus">
                {storageStatus || '－'}
              </dd>
            </div>

            <div className="post-confirm__detail-row">
              <dt>特徴</dt>
              <dd id="feature">
                {feature.trim() || '特になし'}
              </dd>
            </div>

          </dl>

        </div>
      </main>


    </ScreenLayout>
  )
}

