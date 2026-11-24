// 感謝メッセージまわりのAPI。画面からは、この中の関数だけを呼ぶ（fetchを画面に直接書かない）。
// USE_MOCK = true の間は、サーバーに繋がず、mock/messages.js のダミーデータを返す。
// バックエンドが出来たら false にする（パスとJSONの形は、バックエンドと合わせて直す）。
import { mockItems } from '../mock/items'
import { mockMessages } from '../mock/messages'

const USE_MOCK = true

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// D-1 メッセージ一覧（G032）
// GET /api/student/messages?box=received|sent（パスは内部設計書 第7章の仮）
// box: 'received'（受信） / 'sent'（送信）
// 返す値: メッセージの配列（新着順）。送信メッセージには、対象の落とし物の名前・画像（item）を付ける（仮の形）
export async function getMessages(box) {
  if (USE_MOCK) {
    await wait(300)
    return mockMessages
      .filter((message) => message.box === box)
      .map((message) => {
        const item = mockItems.find((it) => it.id === message.itemId)
        return {
          ...message,
          item: item ? { id: item.id, name: item.name, image: item.images[0] ?? null } : null,
        }
      })
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt)) // 新着順（設計書 G032）
  }

  const res = await fetch(`/api/student/messages?box=${encodeURIComponent(box)}`)
  if (!res.ok) throw new Error('FETCH_FAILED')
  return res.json()
}
