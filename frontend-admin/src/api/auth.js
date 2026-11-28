// 管理者の認証まわりのAPI。画面からは、この中の関数だけを呼ぶ（fetchを画面に直接書かない）。
// USE_MOCK = true の間は、サーバーに繋がず、ダミーの返事を返す（切り替えは api/client.js）。
// バックエンドが出来たら、パスとJSONを、バックエンドと合わせて直す。
// サーバーのエラー形式（案）: { code: 'LOGIN_FAILED' } のように code を返してもらう（api/client.js が Error('コード') にする）
import { apiFetch, USE_MOCK, wait } from './client'

// H-1 管理者ログイン（G040）
// POST /api/admin/login（パスは内部設計書 第7章の仮）
// 返す値（仮）: { name }（admins.name。ホーム G048 などで使う想定）
// 失敗時: どんな理由でも code = LOGIN_FAILED
//   設計書 G040: 「メールアドレス・パスワードのどちらが誤りかは区別しない」。無効化された管理者も、同じエラーにする
export async function loginAdmin(email, password) {
  if (USE_MOCK) {
    await wait(300)
    // モック用の仮ルール（本物の判定はサーバー側）:
    //   パスワードが password1 のときだけ成功（学生用のログインのモックと同じ）。
    //   ただし disabled で始まるメールアドレスは「無効化された管理者」として失敗にする
    if (password === 'password1' && !email.startsWith('disabled')) {
      return { name: '管理者（仮）' }
    }
    throw new Error('LOGIN_FAILED')
  }

  try {
    return await apiFetch('/api/admin/login', { method: 'POST', json: { email, password } })
  } catch {
    // 失敗したら、理由に関係なく（通信できなかったときも）「ログインできない」にする（仮。学生用 A-1 と同じ）
    throw new Error('LOGIN_FAILED')
  }
}
