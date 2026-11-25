// 受け取り申請まわりのAPI。画面からは、この中の関数だけを呼ぶ（fetchを画面に直接書かない）。
// USE_MOCK = true の間は、サーバーに繋がず、ダミーの返事を返す。
// バックエンドが出来たら false にする（パスとJSONの形は、バックエンドと合わせて直す）。
import { mockApplications } from '../mock/applications'
import { mockItems } from '../mock/items'

const USE_MOCK = true

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// E-1 受け取り申請一覧（G033）
// GET /api/student/applications（パスは内部設計書 第7章の仮）
// 返す値: 自分の申請の配列（新着順）。申請した落とし物の名前・写真（item）を付ける（仮の形）
export async function getApplications() {
  if (USE_MOCK) {
    await wait(300)
    return mockApplications
      .map((application) => {
        const item = mockItems.find((it) => it.id === application.itemId)
        return {
          ...application,
          item: item ? { id: item.id, name: item.name, image: item.images[0] ?? null } : null,
        }
      })
      .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt)) // 新着順（設計書 G033）
  }

  const res = await fetch('/api/student/applications', { credentials: 'include' })
  if (!res.ok) throw new Error('FETCH_FAILED')
  return res.json()
}

// E-2 申請の詳細（G014, G034）
// GET /api/student/applications/{id}（パスは内部設計書 第7章の仮）
// 返す値: 申請（申請状況・申請理由など）に、申請した落とし物の詳細（item）を付けたもの（仮の形）
// 失敗時の code（仮）: NOT_FOUND（申請がない）
export async function getApplication(applicationId) {
  if (USE_MOCK) {
    await wait(300)
    const application = mockApplications.find((a) => String(a.id) === String(applicationId))
    if (!application) throw new Error('NOT_FOUND')
    const item = mockItems.find((it) => it.id === application.itemId) ?? null
    return { ...application, item }
  }

  const res = await fetch(`/api/student/applications/${encodeURIComponent(applicationId)}`, { credentials: 'include' })
  if (res.status === 404) throw new Error('NOT_FOUND')
  if (!res.ok) throw new Error('FETCH_FAILED')
  return res.json()
}

// 申請の結果を「確認した（既読）」にする（G033 イベント2。NEW マークを消す）
// PATCH /api/student/applications/{id}/read（※ 内部設計書 第7章に、このAPIは無い。仮のパス）
export async function markApplicationRead(applicationId) {
  if (USE_MOCK) {
    const application = mockApplications.find((a) => String(a.id) === String(applicationId))
    if (application) application.resultRead = true
    return
  }

  const res = await fetch(`/api/student/applications/${encodeURIComponent(applicationId)}/read`, {
    method: 'PATCH',
    credentials: 'include',
  })
  if (!res.ok) throw new Error('FETCH_FAILED')
}

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
    // モック: G033（受け取り申請一覧）に「承認待ち」で出るように、申請の仮データにも足す
    const id = Math.max(0, ...mockApplications.map((a) => a.id)) + 1
    mockApplications.push({
      id,
      itemId: item.id,
      status: 'PENDING',
      handedOver: false,
      resultRead: false,
      messageSent: false,
      appliedAt: new Date().toISOString(),
      reason,
    })
    return { id, status: 'PENDING' }
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
