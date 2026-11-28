// 通知まわりのAPI。画面からは、この中の関数だけを呼ぶ（fetchを画面に直接書かない）。
// USE_MOCK = true の間は、サーバーに繋がず、mock/notifications.js のダミーデータを返す（切り替えは api/client.js）。
// バックエンドが出来たら、パスとJSONの形を、バックエンドと合わせて直す。
// 通知の項目名（notificationId・notificationType など）と、DB の列との対応は mock/notifications.js の先頭に書いてある。
import { apiFetch, USE_MOCK, wait } from './client'
import { findMockItem } from './items'
import { mockNotifications } from '../mock/notifications'
import { mockMyPosts } from '../mock/myPosts'

// モック用: 通知に、対象の落とし物（post）を付けて返す（仮の形）
//   感謝メッセージの通知 → 自分の投稿（mock/myPosts.js）、それ以外 → mock/items.js
function withPost(notification) {
  let post = null
  if (notification.notificationType === 'THANKS_RECEIVED') {
    const myPost = mockMyPosts.find((p) => p.postId === notification.postId)
    post = myPost ? { ...myPost, postImageUrls: [...myPost.postImageUrls] } : null
  } else {
    post = findMockItem(notification.postId)
  }
  return { ...notification, post }
}

// C-1 通知一覧（G012）
// GET /api/student/notifications（パスは内部設計書 第7章の仮）
// 返す値: 自分あての通知の配列（新着順）。対象の落とし物（post）を付ける（仮の形）
export async function getNotifications() {
  if (USE_MOCK) {
    await wait(300)
    return mockNotifications
      .map(withPost)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)) // 新着順（設計書 G012）
  }

  return apiFetch('/api/student/notifications')
}

// C-2 通知を既読にする（G012 イベント2。NEW マークを消す）
// PATCH /api/student/notifications/{id}/read（パスは内部設計書 第7章の仮）
export async function markNotificationRead(notificationId) {
  if (USE_MOCK) {
    const notification = mockNotifications.find((n) => String(n.notificationId) === String(notificationId))
    if (notification) notification.isRead = true
    return
  }

  await apiFetch(`/api/student/notifications/${encodeURIComponent(notificationId)}/read`, { method: 'PATCH' })
}
