// 自分の投稿（自分が投稿した落とし物）まわりのAPI。画面からは、この中の関数だけを呼ぶ（fetchを画面に直接書かない）。
// USE_MOCK = true の間は、サーバーに繋がず、ダミーの返事を返す（切り替えは api/client.js）。
// バックエンドが出来たら、パスとJSONの形を、バックエンドと合わせて直す。
//
// ※ G027〜G029（他のメンバーの画面）は、画面の中に仮データを書いていて、まだこのファイルを使っていない。
import { apiFetch, USE_MOCK, wait } from './client'

// G-3 投稿の編集（G030 → G031）
// PUT /api/student/my-items/{id}（multipart。パスは内部設計書 第7章の仮）
// form: G029 の入力内容 { title, category, foundAt, place, storage, feature, photos: [{ key, src, file? }] }
//   photos のうち、file があるものは新しく追加した写真、file がないものは前から登録されている写真（src がURL）
// 失敗時の code（仮）: NOT_FOUND（投稿がない）/ NOT_EDITABLE（学生厚生に到着済みなどで編集できない）
export async function updateMyPost(postId, form) {
  if (USE_MOCK) {
    await wait(500)
    // モック: 何も保存しない（G027〜G029 の仮データは画面の中にあるため）。成功したことにする
    return { id: postId }
  }

  const body = new FormData()
  body.append('title', form.title)
  body.append('category', form.category)
  body.append('foundAt', form.foundAt)
  body.append('place', form.place)
  body.append('storage', form.storage)
  body.append('feature', form.feature)
  form.photos.forEach((photo) => {
    if (photo.file) {
      body.append('photos', photo.file) // 新しく追加した写真
    } else {
      body.append('keepPhotoUrls', photo.src) // そのまま残す写真（項目名は仮）
    }
  })
  return apiFetch(`/api/student/my-items/${encodeURIComponent(postId)}`, { method: 'PUT', body })
}
