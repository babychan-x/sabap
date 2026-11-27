// 落とし物まわりのAPI。画面からは、この中の関数だけを呼ぶ（fetchを画面に直接書かない）。
// USE_MOCK = true の間は、サーバーに繋がず、mock/items.js のダミーデータを返す（切り替えは api/client.js）。
// バックエンドが出来たら、パスとJSONの形を、バックエンドと合わせて直す。
// 落とし物の項目名（postId・itemName など）と、DB の列との対応は mock/items.js の先頭に書いてある。
import { apiFetch, USE_MOCK, wait } from './client'
import { mockItems } from '../mock/items'

// モック用: 画面が仮データを書き換えてしまわないように、コピーを返す
function copyItem(item) {
  return { ...item, postImageUrls: [...item.postImageUrls] }
}

// モック用: 投稿ID で落とし物を探す（URL の :id は文字なので、文字にそろえて比べる）。申請・メッセージからも使う
export function findMockItem(postId) {
  const item = mockItems.find((it) => String(it.postId) === String(postId))
  return item ? copyItem(item) : null
}

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
      .filter((item) => !category || item.itemCategory === category)
      .filter((item) => {
        if (!word) return true // キーワードが空なら全件（仮）
        return [item.itemName, item.itemCategory, item.foundLocation, item.itemDescription]
          .some((text) => text.toLowerCase().includes(word))
      })
      .sort((a, b) => b.foundAt.localeCompare(a.foundAt)) // 新着順（内部設計書 第9章）
      .map(copyItem)
  }

  // 空の keyword・category は、URL に付けない（api/client.js がやる）
  return apiFetch('/api/student/items', { query: { keyword, category } })
}

// B-2 落とし物詳細（G015, G017）
// GET /api/student/items/{id}（パスは内部設計書 第7章の仮）
// 失敗時の code: NOT_FOUND（その落とし物がない）
export async function getItem(postId) {
  if (USE_MOCK) {
    await wait(300)
    const item = findMockItem(postId)
    if (!item) throw new Error('NOT_FOUND')
    return item
  }

  return apiFetch(`/api/student/items/${encodeURIComponent(postId)}`)
}
