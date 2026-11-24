// 日付の表示を、設計書の形にそろえる関数。

// 2026-10-13T16:00:00 → 「2026/10/13 16:00」（内部設計書 第9章の形）
export function formatDateTime(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// 期限まで、あと何日か（期限を過ぎていればマイナス）。保管期限の強調表示（30日以内）に使う
export function daysUntil(value, now = new Date()) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return Math.floor((d.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
}
