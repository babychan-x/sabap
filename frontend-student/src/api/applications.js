// 受け取り申請まわりのAPI。画面からは、この中の関数だけを呼ぶ（fetchを画面に直接書かない）。
// USE_MOCK = true の間は、サーバーに繋がず、ダミーの返事を返す。
// バックエンドが出来たら false にする（パスとJSONの形は、バックエンドと合わせて直す）。
import { mockItems } from '../mock/items'

const USE_MOCK = true

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// E-3 受け取り申請（G019 → G020）
// POST /api/student/items/{id}/applications（multipart。パスは内部設計書 第7章の仮）
// 送るもの: reason（申請理由）、photos（写真のファイル。0〜4枚）
// サーバー側で、申請状況「承認待ち（PENDING）」で登録する（G019 イベント2）
// 失敗時の code（仮）: NOT_FOUND（落とし物がない）/ ALREADY_APPLIED（申請済み）/ NOT_APPLICABLE（受け渡し済み・処分済み）
export async function createApplication(itemId, { reason, photos }) {
  if (USE_MOCK) {
    await wait(500)
    const item = mockItems.find((i) => String(i.id) === String(itemId))
    if (!item) throw new Error('NOT_FOUND')
    if (item.storageStatus === 'RETURNED' || item.storageStatus === 'DISPOSED') throw new Error('NOT_APPLICABLE')
    if (item.alreadyApplied) throw new Error('ALREADY_APPLIED')
    // モック: 申請済みにする（ページを再読み込みすると元に戻る）。G017 でボタンが消えることを確認できる
    item.alreadyApplied = true
    return { status: 'PENDING' }
  }

  const body = new FormData()
  body.append('reason', reason)
  photos.forEach((photo) => body.append('photos', photo.file))
  const res = await fetch(`/api/student/items/${encodeURIComponent(itemId)}/applications`, {
    method: 'POST',
    credentials: 'include', // cookie認証にする場合に必要（認証方式は未定）
    body, // FormData のときは Content-Type を書かない（ブラウザが自動で付ける）
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.code ?? 'UNKNOWN')
  }
  return res.json()
}
