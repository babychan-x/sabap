import './StudentPostItemConfirm.css'

// G022 投稿確認画面（studentPostItemConfirm）
// ※ 仮の画面。外部設計書 G022 の入出力項目・イベントに合わせて中身を作る。
// 主なAPI（仮）: B-3（「投稿する」で実行）

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ProgressSteps from '../../../components/ProgressSteps'

export default function StudentPostItemConfirm() {
  const navigate = useNavigate()
  const location = useLocation()

  // G021から入力内容を受け取る
  const {
    category = '',
    foundDateTime = '',
    foundPlace = '',
    storageStatus = '',
    itemName = '',
    feature = '',
    images = [],
  } = location.state || {}

  // 画像プレビュー
  const [previewUrls, setPreviewUrls] = useState([])
  const [currentImage, setCurrentImage] = useState(0)

  // 画像のスワイプ操作
  const touchStartX = useRef(null)

  // エラーメッセージ
  const [errorMessage, setErrorMessage] = useState('')

  // G021を経由せずにアクセスした場合
  useEffect(() => {
    if (!location.state) {
      navigate('/post', { replace: true })
    }
  }, [location.state, navigate])

  // 画像の表示用URLを生成
  useEffect(() => {
    const urls = (location.state?.images || [])
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
  const back = () => {
    navigate('/post', {
      replace: true,
      state: {
        category,
        foundDateTime,
        foundPlace,
        storageStatus,
        itemName,
        feature,
        images,
      },
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

  // 投稿する
  const submitPost = () => {
    setErrorMessage('')

    // 試運転用：G023へ遷移
    navigate('/post/complete', { replace: true })

    /*
    【バックエンド連携後の処理】

    1. 入力内容と画像をサーバーへ送信する。
    2. DBに落とし物投稿情報を登録する。
    3. 登録に成功した場合のみG023へ遷移する。

    navigate('/post/complete', { replace: true })

    4. 送信または登録に失敗した場合は、
       G022に留まりエラーメッセージを表示する。

    setErrorMessage(
      '投稿に失敗しました。もう一度お試しください。'
    )

    ※バックエンド連携時には上の試運転用の
      navigateを削除する。
    */
  }

  if (!location.state) return null

  return (
    <div className="page post-confirm">

      {/* 戻る */}
      <button
        type="button"
        id="back"
        className="post-confirm__back"
        onClick={back}
      >
        ＜ 投稿内容の確認
      </button>

      {/* 進行状況（見た目は G029 と同じ共通部品 ProgressSteps） */}
      <div
        id="stepIndicator"
        className="post-confirm__steps"
      >
        <ProgressSteps current={1} label="投稿の手順" />
      </div>

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

      {/* 投稿ボタン */}
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
        >
          投稿する
        </button>

      </div>

    </div>
  )
}

