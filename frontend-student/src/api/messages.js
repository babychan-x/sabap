// 感謝メッセージまわりのAPI。画面からは、この中の関数だけを呼ぶ（fetchを画面に直接書かない）。
// USE_MOCK = true の間は、サーバーに繋がず、mock/messages.js のダミーデータを返す（切り替えは api/client.js）。
// バックエンドが出来たら、パスとJSONの形を、バックエンドと合わせて直す。
// メッセージの項目名（messageId・messageBody など）と、DB の列との対応は mock/messages.js の先頭に書いてある。
import { apiFetch, USE_MOCK, wait } from './client'
import { findMockItem } from './items'
import { mockMessages } from '../mock/messages'
import { mockMyPosts } from '../mock/myPosts'
import { mockApplications } from '../mock/applications'
import { mockMe } from '../mock/me'

// モック用: メッセージに、対象の落とし物（post）を付けて返す（仮の形）
//   受け取ったメッセージ → 自分の投稿（mock/myPosts.js）、送ったメッセージ → 自分が受け取った落とし物（mock/items.js）
function withPost(message) {
  let post = null
  if (message.messageBox === 'received') {
    const myPost = mockMyPosts.find((p) => p.postId === message.postId)
    post = myPost ? { ...myPost, postImageUrls: [...myPost.postImageUrls] } : null
  } else {
    post = findMockItem(message.postId)
  }
  return { ...message, post }
}

// D-1 メッセージ一覧（G032）
// GET /api/student/messages?box=received|sent（パスは内部設計書 第7章の仮）
// messageBox: 'received'（受信） / 'sent'（送信）
// 返す値: メッセージの配列（新着順）。対象の落とし物（post）を付ける（仮の形）
export async function getMessages(messageBox) {
  if (USE_MOCK) {
    await wait(300)
    return mockMessages
      .filter((message) => message.messageBox === messageBox)
      .map(withPost)
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt)) // 新着順（設計書 G032）
  }

  return apiFetch('/api/student/messages', { query: { box: messageBox } })
}

// D-2 メッセージ詳細（G013）
// GET /api/student/messages/{id}（パスは内部設計書 第7章の仮）
// 返す値: メッセージに、対象の落とし物（post）を付けたもの（仮の形）
// 失敗時の code（仮）: NOT_FOUND（メッセージがない）
export async function getMessage(messageId) {
  if (USE_MOCK) {
    await wait(300)
    const message = mockMessages.find((m) => String(m.messageId) === String(messageId))
    if (!message) throw new Error('NOT_FOUND')
    return withPost(message)
  }

  return apiFetch(`/api/student/messages/${encodeURIComponent(messageId)}`)
}

// D-3 感謝メッセージの送信（G036 の「送信する」→ G037）
// POST /api/student/applications/{id}/message（パスは内部設計書 第7章の仮）
// applicationId: 受け渡し済みの申請の ID（URL の /mypage/applications/:id/message の :id）
// 失敗時の code（仮）: NOT_FOUND（申請がない）/ NOT_HANDED_OVER（まだ受け渡していない）/ ALREADY_SENT（送信済み）
// ※ 落とし物の投稿者への通知は、サーバーが作る（設計書 G036 イベント2）
export async function sendMessage(applicationId, messageBody) {
  if (USE_MOCK) {
    await wait(500)
    const application = mockApplications.find((a) => String(a.applicationId) === String(applicationId))
    if (!application) throw new Error('NOT_FOUND')
    if (!application.isHandedOver) throw new Error('NOT_HANDED_OVER')
    if (application.isMessageSent) throw new Error('ALREADY_SENT')
    // モック: 送信済みにして、送ったメッセージ（G032 の「送信」タブ）にも足す（ページを再読み込みすると元に戻る）
    application.isMessageSent = true
    const messageId = Math.max(0, ...mockMessages.map((m) => m.messageId)) + 1
    mockMessages.push({
      messageId,
      messageBox: 'sent',
      senderNickname: mockMe.nickname,
      senderIconNumber: mockMe.iconNumber,
      postId: application.postId,
      messageBody,
      sentAt: new Date().toISOString(),
    })
    return { messageId }
  }

  return apiFetch(`/api/student/applications/${encodeURIComponent(applicationId)}/message`, {
    method: 'POST',
    json: { messageBody },
  })
}
