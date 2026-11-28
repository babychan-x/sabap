// 受け取り申請まわりのAPI。画面からは、この中の関数だけを呼ぶ（fetchを画面に直接書かない）。
// USE_MOCK = true の間は、サーバーに繋がず、ダミーの返事を返す（切り替えは api/client.js）。
// バックエンドが出来たら、パスとJSONの形を、バックエンドと合わせて直す。
// 申請の項目名（applicationId・applicationStatus など）と、DB の列との対応は mock/applications.js の先頭に書いてある。
import { apiFetch, USE_MOCK, wait } from './client'
import { findMockItem } from './items'
import { mockApplications } from '../mock/applications'
import { mockItems } from '../mock/items'

// モック用: 申請ID で申請を探す
function findMockApplication(applicationId) {
  return mockApplications.find((a) => String(a.applicationId) === String(applicationId))
}

// モック用: 申請に、申請した落とし物（post。mock/items.js の形）を付けて返す（仮の形）
function withPost(application) {
  return { ...application, post: findMockItem(application.postId) }
}

// E-1 受け取り申請一覧（G033）
// GET /api/student/applications（パスは内部設計書 第7章の仮）
// 返す値: 自分の申請の配列（新着順）。申請した落とし物（post）を付ける（仮の形）
export async function getApplications() {
  if (USE_MOCK) {
    await wait(300)
    return mockApplications
      .map(withPost)
      .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt)) // 新着順（設計書 G033）
  }

  return apiFetch('/api/student/applications')
}

// E-2 申請の詳細（G014, G034）
// GET /api/student/applications/{id}（パスは内部設計書 第7章の仮）
// 返す値: 申請（申請状況・申請理由・受け取り期限など）に、申請した落とし物（post）を付けたもの（仮の形）
// 失敗時の code（仮）: NOT_FOUND（申請がない）
export async function getApplication(applicationId) {
  if (USE_MOCK) {
    await wait(300)
    const application = findMockApplication(applicationId)
    if (!application) throw new Error('NOT_FOUND')
    return withPost(application)
  }

  return apiFetch(`/api/student/applications/${encodeURIComponent(applicationId)}`)
}

// 申請の結果を「確認した（既読）」にする（G033 イベント2。NEW マークを消す）
// PATCH /api/student/applications/{id}/read（※ 内部設計書 第7章に、このAPIは無い。DB にも列が無い。仮のパス）
export async function markApplicationRead(applicationId) {
  if (USE_MOCK) {
    const application = findMockApplication(applicationId)
    if (application) application.isResultRead = true
    return
  }

  await apiFetch(`/api/student/applications/${encodeURIComponent(applicationId)}/read`, { method: 'PATCH' })
}

// E-3 受け取り申請（G019 → G020）
// POST /api/student/items/{id}/applications（multipart。パスは内部設計書 第7章の仮）
// form: G018 の入力内容 { applicationReason（申請理由）, applicationImages: [{ key, url, file }]（写真。0〜4枚） }
//   applicationImages → application_images テーブル（送る項目名は仮）
// サーバー側で、申請状況「承認待ち（PENDING）」で登録する（G019 イベント2）
// 失敗時の code（仮）: NOT_FOUND（落とし物がない）/ ALREADY_APPLIED（申請済み）/ NOT_APPLICABLE（受け渡し済み・処分済み）
export async function createApplication(postId, { applicationReason, applicationImages }) {
  if (USE_MOCK) {
    await wait(500)
    const item = mockItems.find((it) => String(it.postId) === String(postId))
    if (!item) throw new Error('NOT_FOUND')
    if (item.itemStatus === 'RETURNED' || item.itemStatus === 'DISPOSED') throw new Error('NOT_APPLICABLE')
    if (item.hasMyApplication) throw new Error('ALREADY_APPLIED')
    // モック: 申請済みにする（ページを再読み込みすると元に戻る）。G017 でボタンが消えることを確認できる
    item.hasMyApplication = true
    // モック: G033（受け取り申請一覧）に「承認待ち」で出るように、申請の仮データにも足す
    const applicationId = Math.max(0, ...mockApplications.map((a) => a.applicationId)) + 1
    mockApplications.push({
      applicationId,
      postId: item.postId,
      applicationStatus: 'PENDING',
      isHandedOver: false,
      isResultRead: false,
      isMessageSent: false,
      appliedAt: new Date().toISOString(),
      applicationReason,
      pickupDeadline: null,
      pickupLocation: '',
    })
    return { applicationId, applicationStatus: 'PENDING' }
  }

  const body = new FormData()
  body.append('applicationReason', applicationReason)
  applicationImages.forEach((image) => body.append('applicationImages', image.file))
  return apiFetch(`/api/student/items/${encodeURIComponent(postId)}/applications`, { method: 'POST', body })
}

// 結果（承認・却下）が出ていて、まだ確認していない申請か（G033 の NEW マーク・G024 の「新着〇件」に使う）
export function isNewResult(application) {
  return !application.isResultRead && (application.applicationStatus === 'APPROVED' || application.applicationStatus === 'REJECTED')
}
