import { useRef, useState } from 'react'
import './PhotoSlider.css'

// 写真のスライダー（左右にスワイプで切り替え）と、画像位置表示（右上の「1 / 3」と、下の点）。
// 見た目は G028（StudentMyPostDetail）の写真に合わせている。G017・G019 で使う。
// 使い方: <PhotoSlider key={item.id} images={item.images} alt={item.name} />
//   ※ key を付けると、別の落とし物を表示したときに1枚目に戻る。
//   ※ 写真が0枚のときは灰色の枠を1つ出す。写真が1枚以下のときは位置表示を出さない。

// 写真がないとき／読み込めないときの表示
function ImagePlaceholder() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  )
}

export default function PhotoSlider({ images, alt }) {
  const sliderRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [failedImages, setFailedImages] = useState([]) // 読み込みに失敗した写真の番号

  const slides = images.length > 0 ? images : [null]

  // スワイプしたとき、何枚目かを調べて位置表示を更新する
  const handleScroll = () => {
    const slider = sliderRef.current
    if (!slider) return
    setActiveIndex(Math.round(slider.scrollLeft / slider.clientWidth))
  }

  // 点を押したとき、その写真まで動かす（スワイプできないPCのため）
  const handleDotClick = (index) => {
    const slider = sliderRef.current
    if (!slider) return
    slider.scrollTo({ left: index * slider.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="photo-slider">
      <div className="photo-slider-track" ref={sliderRef} onScroll={handleScroll}>
        {slides.map((src, index) => (
          <div className="photo-slider-slide" key={index}>
            {src && !failedImages.includes(index) ? (
              <img
                src={src}
                alt={`${alt}の写真${index + 1}`}
                className="photo-slider-img"
                onError={() => setFailedImages((prev) => [...prev, index])}
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <span className="photo-slider-count" aria-live="polite">
            {activeIndex + 1} / {slides.length}
          </span>
          <div className="photo-slider-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`photo-slider-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`${index + 1}枚目の写真を表示`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
