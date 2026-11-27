// 自分の投稿（自分が投稿した落とし物）まわりのAPI。画面からは、この中の関数だけを呼ぶ（fetchを画面に直接書かない）。
// USE_MOCK = true の間は、サーバーに繋がず、mock/myPosts.js のダミーデータを返す（切り替えは api/client.js）。
// バックエンドが出来たら、パスとJSONの形を、バックエンドと合わせて直す。
//
// 投稿の項目名（postId・itemName など）と、DB の列との対応は mock/myPosts.js の先頭に書いてある。
import { apiFetch, USE_MOCK, wait } from './client'
import { mockMyPosts } from '../mock/myPosts'

// モック用: 投稿をID で探す（URL の :id は文字なので、文字にそろえて比べる）
function findMockPost(postId) {
  return mockMyPosts.find((post) => String(post.postId) === String(postId))
}

// モック用: 画面が仮データを書き換えてしまわないように、コピーを返す
function copyPost(post) {
  return { ...post, postImageUrls: [...post.postImageUrls] }
}

// G-1 自分の投稿一覧（G027）
// GET /api/student/my-items（パスは内部設計書 第7章の仮）
// 返す値: 自分の投稿の配列（投稿日時の新しい順。並び順は設計書に記載なし。仮）
export async function getMyPosts() {
  if (USE_MOCK) {
    await wait(300)
    return mockMyPosts
      .map(copyPost)
      .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
  }

  return apiFetch('/api/student/my-items')
}

// G-2 自分の投稿の詳細（G028、G029）
// GET /api/student/my-items/{id}（パスは内部設計書 第7章の仮）
// 失敗時の code（仮）: NOT_FOUND（投稿がない）
export async function getMyPost(postId) {
  if (USE_MOCK) {
    await wait(300)
    const post = findMockPost(postId)
    if (!post) throw new Error('NOT_FOUND')
    return copyPost(post)
  }

  return apiFetch(`/api/student/my-items/${encodeURIComponent(postId)}`)
}

// G-3 投稿の編集（G030 → G031）
// PUT /api/student/my-items/{id}（multipart。パスは内部設計書 第7章の仮）
// form: G029 の入力内容
//   { itemName, itemCategory, foundAt（'2026-10-12T18:00' の形）, foundLocation, itemStatus, itemDescription,
//     postImages: [{ key, url, file? }] }
//   postImages のうち、file があるものは新しく追加した写真、file がないものは前から登録されている写真（url がそのURL）
// 失敗時の code（仮）: NOT_FOUND（投稿がない）/ NOT_EDITABLE（学生厚生に到着済みなどで編集できない）
export async function updateMyPost(postId, form) {
  if (USE_MOCK) {
    await wait(500)
    const post = findMockPost(postId)
    if (!post) throw new Error('NOT_FOUND')
    if (post.itemStatus !== 'NOT_ARRIVED') throw new Error('NOT_EDITABLE')
    // モック: 仮データを書き換える（G028 に戻ると、編集した内容が出る。ページを再読み込みすると元に戻る）
    // 新しく追加した写真は、ブラウザの中だけで使える仮のURL（blob:）のまま入れる
    Object.assign(post, {
      itemName: form.itemName,
      itemCategory: form.itemCategory,
      foundAt: form.foundAt,
      foundLocation: form.foundLocation,
      itemStatus: form.itemStatus,
      itemDescription: form.itemDescription,
      postImageUrls: form.postImages.map((image) => image.url),
    })
    return { postId: post.postId }
  }

  // 送る項目名は仮（バックエンドと合わせる）
  const body = new FormData()
  body.append('itemName', form.itemName)
  body.append('itemCategory', form.itemCategory)
  body.append('foundAt', form.foundAt)
  body.append('foundLocation', form.foundLocation)
  body.append('itemStatus', form.itemStatus)
  body.append('itemDescription', form.itemDescription)
  form.postImages.forEach((image) => {
    if (image.file) {
      body.append('postImages', image.file) // 新しく追加した写真
    } else {
      body.append('keepPostImageUrls', image.url) // そのまま残す写真
    }
  })
  return apiFetch(`/api/student/my-items/${encodeURIComponent(postId)}`, { method: 'PUT', body })
}

// G-4 投稿の削除（G028 の D001「確認」）
// DELETE /api/student/my-items/{id}（パスは内部設計書 第7章の仮）
// 失敗時の code（仮）: NOT_FOUND（もう削除されている）/ NOT_DELETABLE（到着済み・受け取り申請があるなどで削除できない）
export async function deleteMyPost(postId) {
  if (USE_MOCK) {
    await wait(500)
    const index = mockMyPosts.findIndex((post) => String(post.postId) === String(postId))
    if (index === -1) throw new Error('NOT_FOUND')
    const post = mockMyPosts[index]
    if (post.itemStatus !== 'NOT_ARRIVED' || post.hasApplication) throw new Error('NOT_DELETABLE')
    // モック: 仮データから消す（G027 の一覧からも消える。ページを再読み込みすると元に戻る）
    mockMyPosts.splice(index, 1)
    return
  }

  await apiFetch(`/api/student/my-items/${encodeURIComponent(postId)}`, { method: 'DELETE' })
}
