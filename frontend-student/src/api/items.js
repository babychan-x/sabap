// 落とし物まわりのAPI。画面からは、この中の関数だけを呼ぶ（fetchを画面に直接書かない）。
// USE_MOCK = true の間は、サーバーに繋がず、mock/items.js のダミーデータを返す。
// バックエンドが出来たら false にする（パスとJSONの形は、バックエンドと合わせて直す）。
import { mockItems } from '../mock/items'

const USE_MOCK = true

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// B-1 落とし物一覧・検索（G011, G016）
// GET /api/student/items?category=&keyword=（パスは内部設計書 第7章の仮）
// 返す値: 落とし物の配列（新着順）
export async function getItems({ keyword = '', category = '' } = {}) {
  if (USE_MOCK) {
    await wait(300)
    // モック: 落とし物名・カテゴリー・拾得場所・特徴に、キーワードを含むものを返す。
    // 本物の検索条件（どの項目を探すか）は設計書に書いていない（仮）。
    const word = keyword.trim().toLowerCase()
    return mockItems
      .filter((item) => !category || item.category === category)
      .filter((item) => {
        if (!word) return true // キーワードが空なら全件（仮）
        return [item.name, item.category, item.foundPlace, item.features]
          .some((text) => text.toLowerCase().includes(word))
      })
      .sort((a, b) => b.foundAt.localeCompare(a.foundAt)) // 新着順（内部設計書 第9章）
  }

  const params = new URLSearchParams()
  if (keyword) params.set('keyword', keyword)
  if (category) params.set('category', category)
  const res = await fetch(`/api/student/items?${params}`, {
    credentials: 'include', // cookie認証にする場合に必要（認証方式は未定）
  })
  if (!res.ok) throw new Error('UNKNOWN')
  return res.json()
}

// B-2 落とし物詳細（G015, G017）
// GET /api/student/items/{id}（パスは内部設計書 第7章の仮）
// 失敗時の code: NOT_FOUND（その落とし物がない）
export async function getItem(id) {
  if (USE_MOCK) {
    await wait(300)
    const item = mockItems.find((i) => String(i.id) === String(id))
    if (!item) throw new Error('NOT_FOUND')
    return item
  }

  const res = await fetch(`/api/student/items/${encodeURIComponent(id)}`, {
    credentials: 'include', // cookie認証にする場合に必要（認証方式は未定）
  })
  if (res.status === 404) throw new Error('NOT_FOUND')
  if (!res.ok) throw new Error('UNKNOWN')
  return res.json()
}
