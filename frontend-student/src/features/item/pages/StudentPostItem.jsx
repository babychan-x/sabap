import './StudentPostItem.css'

// G021 落とし物投稿（入力）画面（studentPostItem）

import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Camera, X } from 'lucide-react'

// 仮の階数設定。実際の階数が決まったら号館ごとに変更する。
const buildingFloors = {
  '1号館': ['1階', '2階', '3階', '4階', '5階'],
  '2号館': ['1階', '2階', '3階', '4階', '5階'],
  '3号館': ['1階', '2階', '3階', '4階', '5階'],
  '4号館': ['1階', '2階', '3階', '4階', '5階'],
  '5号館': ['1階', '2階', '3階', '4階', '5階'],
  'その他': ['屋外', 'その他'],
}

const foundPlaceDetailMaxLength = 100

export default function StudentPostItem() {
  
const navigate = useNavigate()
const location = useLocation()
const fileInputRef = useRef(null)

// G022から戻ってきた場合の入力内容
const previousData = location.state || {}

// 入力内容
const [category, setCategory] = useState(
  previousData.category || ''
)

const [foundDateTime, setFoundDateTime] = useState(
  previousData.foundDateTime || ''
)

const [foundBuilding, setFoundBuilding] = useState(previousData.foundBuilding ?? '')
const [foundFloor, setFoundFloor] = useState(previousData.foundFloor ?? '')
const [foundPlaceDetail, setFoundPlaceDetail] = useState(previousData.foundPlaceDetail ?? '')

const floorOptions = Object.hasOwn(buildingFloors, foundBuilding)
  ? buildingFloors[foundBuilding]
  : []

const [storageStatus, setStorageStatus] = useState(
  previousData.storageStatus || ''
)

const [itemName, setItemName] = useState(
  previousData.itemName || ''
)

const [feature, setFeature] = useState(
  previousData.feature || ''
)

const [images, setImages] = useState(
  previousData.images || []
)


  // エラーメッセージ
  const [errorMessage, setErrorMessage] = useState('')

  // 画像プレビューURLを管理
  const [previewUrls, setPreviewUrls] = useState([])

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file))
    setPreviewUrls(urls)

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [images])

  // G011へ戻る
  const back = () => {
    navigate('/home')
  }

  // 画像追加
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || [])

    if (images.length + selectedFiles.length > 4) {
      setErrorMessage('写真は最大4枚まで添付できます。')
      e.target.value = ''
      return
    }

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith('image/')
    )

    if (validFiles.length !== selectedFiles.length) {
      setErrorMessage('画像ファイルを選択してください。')
      e.target.value = ''
      return
    }

    setImages((prev) => [...prev, ...validFiles])
    setErrorMessage('')
    e.target.value = ''
  }

  // 画像削除
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // 確認画面へ
  const confirm = (e) => {
    e.preventDefault()

    // 必須項目チェック
    if (
      !category ||
      !foundDateTime ||
      !foundBuilding ||
      !foundFloor ||
      !storageStatus ||
      !itemName.trim() ||
      images.length === 0
    ) {
      setErrorMessage('必須項目をすべて入力してください。')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!floorOptions.includes(foundFloor)) {
      setErrorMessage('選択した号館に対応する階数を選択してください。')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // 文字数チェック
    if (foundPlaceDetail.length > foundPlaceDetailMaxLength) {
      setErrorMessage(`発見場所の詳細は${foundPlaceDetailMaxLength}文字以内で入力してください。`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (itemName.length > 50) {
      setErrorMessage('タイトルは50文字以内で入力してください。')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (feature.length > 200) {
      setErrorMessage('特徴の説明は200文字以内で入力してください。')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setErrorMessage('')

    // G022で入力内容を表示するために渡す
    navigate('/post/confirm', {
      state: {
        category,
        foundDateTime,
        foundPlace: `${foundBuilding}　${foundFloor}`,
        foundBuilding,
        foundFloor,
        foundPlaceDetail,
        storageStatus,
        itemName,
        feature,
        // Fileは画面遷移時に渡す（リロードで消える）
        images,
      },
    })
  }

  return (
    <div className="page post-item">

      {/* 戻る */}
      <button
        type="button"
        className="post-item__back"
        onClick={back}
      >
        ＜ 落とし物を投稿する
      </button>

      {/* 進行状況 */}
      <div className="post-item__steps">
        <div className="post-item__step">
          <span className="post-item__circle post-item__circle--active">
            1
          </span>
          <span>入力</span>
        </div>

        <div className="post-item__line" />

        <div className="post-item__step">
          <span className="post-item__circle">2</span>
          <span>確認</span>
        </div>

        <div className="post-item__line" />

        <div className="post-item__step">
          <span className="post-item__circle">3</span>
          <span>完了</span>
        </div>
      </div>

      <form className="post-item__form" onSubmit={confirm} noValidate>

        {/* 基本情報 */}
        <div className="post-item__section-heading">
          <h2>基本情報</h2>
          {errorMessage && (
            <p className="form-error post-item__error" role="alert">
              {errorMessage}
            </p>
          )}
        </div>


        {/* カテゴリー */}
        <label htmlFor="category" className="post-item__label">
          <span className="post-item__required">必須</span>
          カテゴリー
        </label>
        <select
          id="category"
          className="form-input post-item__select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">選択してください</option>
          <option value="かばん・小物入れ">かばん・小物入れ</option>
          <option value="衣類">衣類</option>
          <option value="装飾品">装飾品</option>
          <option value="文具・書籍">文具・書籍</option>
          <option value="電子書籍">電子機器</option>
          <option value="生活用品">生活用品</option>
          <option value="貴重品">貴重品（鍵、財布、学生証など）</option>
          <option value="その他">その他</option>
        </select>

        {/* 発見日時 */}
        <label htmlFor="foundDateTime" className="post-item__label">
          <span className="post-item__required">必須</span>
          発見日時
        </label>
        <input
          id="foundDateTime"
          type="datetime-local"
          className="form-input"
          value={foundDateTime}
          onChange={(e) => setFoundDateTime(e.target.value)}
        />

        {/* 発見場所 */}
        <label htmlFor="foundBuilding" className="post-item__label">
          <span className="post-item__required">必須</span>
          発見場所（号館）
        </label>
        <select
          id="foundBuilding"
          className="form-input post-item__select"
          required
          value={foundBuilding}
          onChange={(e) => {
            setFoundBuilding(e.target.value)
            setFoundFloor('')
          }}
        >
          <option value="">選択してください</option>
          {Object.keys(buildingFloors).map((building) => (
            <option key={building} value={building}>{building}</option>
          ))}
        </select>

        <label htmlFor="foundFloor" className="post-item__label">
          <span className="post-item__required">必須</span>
          発見場所（階数）
        </label>
        <select
          id="foundFloor"
          className="form-input post-item__select"
          required
          disabled={floorOptions.length === 0}
          value={foundFloor}
          onChange={(e) => setFoundFloor(e.target.value)}
        >
          <option value="">
            {floorOptions.length > 0 ? '選択してください' : '先に号館を選択してください'}
          </option>
          {floorOptions.map((floor) => (
            <option key={floor} value={floor}>{floor}</option>
          ))}
        </select>

        <label htmlFor="foundPlaceDetail" className="post-item__label">
          <span className="post-item__optional">任意</span>
          発見場所の詳細
        </label>
        <textarea
          id="foundPlaceDetail"
          className="post-item__textarea post-item__place-detail"
          placeholder="例：1304教室の窓側の机の下"
          value={foundPlaceDetail}
          maxLength={foundPlaceDetailMaxLength}
          aria-describedby="foundPlaceDetailCount foundPlaceDetailNote"
          onChange={(e) => setFoundPlaceDetail(e.target.value)}
        />
        <p id="foundPlaceDetailCount" className="post-item__place-detail-count">
          {foundPlaceDetail.length} / {foundPlaceDetailMaxLength}文字
        </p>
        <p id="foundPlaceDetailNote" className="post-item__place-detail-note">
          発見場所の詳細は他の学生には公開されません。管理者が受け取り申請の確認に使用します。
        </p>

        {/* 現在の保管場所 */}
        <label htmlFor="storageStatus" className="post-item__label">
          <span className="post-item__required">必須</span>
          現在の保管場所
        </label>
        <select
          id="storageStatus"
          className="form-input post-item__select"
          value={storageStatus}
          onChange={(e) => setStorageStatus(e.target.value)}
        >
          <option value="">選択してください</option>
          <option value="学生厚生未到着">学生厚生未到着</option>
          <option value="学生厚生到着済み">学生厚生到着済み</option>
        </select>

        {/* 落とし物の情報 */}
        <h2 className="post-item__section-title">
          落とし物の情報
        </h2>

        {/* タイトル */}
        <label htmlFor="itemName" className="post-item__label">
          <span className="post-item__required">必須</span>
          タイトル
        </label>
        <input
          id="itemName"
          type="text"
          className="form-input"
          placeholder="例：黒い長財布"
          value={itemName}
          maxLength={50}
          onChange={(e) => setItemName(e.target.value)}
        />

        {/* 特徴の説明 */}
        <label htmlFor="feature" className="post-item__label">
          <span className="post-item__optional">任意</span>
          特徴の説明
        </label>
        <textarea
          id="feature"
          className="post-item__textarea"
          placeholder="落とし物の特徴や状態などを記入してください"
          value={feature}
          maxLength={200}
          onChange={(e) => setFeature(e.target.value)}
        />

        {/* 写真 */}
        <label className="post-item__label">
          <span className="post-item__required">必須</span>
          写真
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="post-item__file-input"
          onChange={handleImageChange}
        />

        <button
          type="button"
          className="post-item__upload"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= 4}
        >
          <Camera size={42} />
          <span>
            写真を追加する<br />
            （最大4枚まで）
          </span>
        </button>

        {/* 選択した画像のプレビュー */}
        {previewUrls.length > 0 && (
          <div className="post-item__preview-list">
            {previewUrls.map((url, index) => (
              <div className="post-item__preview" key={url}>
                <img
                  src={url}
                  alt={`添付画像${index + 1}`}
                />
                <button
                  type="button"
                  className="post-item__remove-image"
                  onClick={() => removeImage(index)}
                  aria-label={`画像${index + 1}を削除`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 確認画面へ */}
        <div className="post-item__footer">
          <button type="submit" className="btn btn--primary">
            確認画面へ
          </button>
        </div>

      </form>
    </div>
  )
}
