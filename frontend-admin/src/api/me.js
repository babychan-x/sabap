// ログイン中の管理者（自分）の情報のAPI。画面からは、この中の関数だけを呼ぶ（fetchを画面に直接書かない）。
// USE_MOCK = true の間は、サーバーに繋がず、mock/me.js のダミーデータを返す（切り替えは api/client.js）。
// バックエンドが出来たら、パスとJSONの形を、バックエンドと合わせて直す。
// ファイル名（me.js）は案（学生用 frontend-student/src/api/me.js と同じ名前）。
import { apiFetch, USE_MOCK, wait } from './client'
import { mockMe } from '../mock/me'

// H-7 ホーム用の情報（G048）
// GET /api/admin/me（パスは内部設計書 第7章の仮）
// 返す値: { adminName, email }（項目名と DB の列の対応は mock/me.js の先頭）
export async function getMe() {
  if (USE_MOCK) {
    await wait(300)
    return { ...mockMe }
  }

  return apiFetch('/api/admin/me')
}
