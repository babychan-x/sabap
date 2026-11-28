// 認証まわりのAPI。画面からは、この中の関数だけを呼ぶ（fetchを画面に直接書かない）。
// USE_MOCK = true の間は、サーバーに繋がず、ダミーの返事を返す（切り替えは api/client.js）。
// バックエンドが出来たら、パスとJSONを、バックエンドと合わせて直す。
// サーバーのエラー形式（案）: { code: 'INVALID_DOMAIN' } のように code を返してもらう（api/client.js が Error('コード') にする）
import { apiFetch, USE_MOCK, wait } from './client'

// A-1 ログイン（G001）
export async function loginStudent(email, password) {
  if (USE_MOCK) {
    await wait(300)
    // モック: パスワードが password1 のときだけ成功
    if (password === 'password1') {
      return { nickname: 'りんご' }
    }
    throw new Error('LOGIN_FAILED')
  }

  try {
    return await apiFetch('/api/student/login', { method: 'POST', json: { email, password } })
  } catch {
    // 失敗したら、理由に関係なく（通信できなかったときも）「ログインできない」にする（仮）
    throw new Error('LOGIN_FAILED')
  }
}

// A-2 新規登録用メールの送信（G002）
// 失敗時の code: INVALID_DOMAIN（大学指定ドメインでない）/ ALREADY_REGISTERED（登録済み）
export async function sendSignUpMail(email) {
  if (USE_MOCK) {
    await wait(300)
    // モック用の仮ルール（本物の判定はサーバー側）。大学のドメインは未確認なので example.ac.jp を仮に使う。
    if (!email.endsWith('@example.ac.jp')) throw new Error('INVALID_DOMAIN')
    if (email.startsWith('registered')) throw new Error('ALREADY_REGISTERED')
    return
  }

  await apiFetch('/api/student/signup/mail', { method: 'POST', json: { email } })
}

// A-3 登録リンクの検証（G004を開いたとき）。有効ならメールアドレスを返す。
// 失敗（無効・期限切れ）: code = LINK_INVALID
export async function verifySignUpToken(token) {
  if (USE_MOCK) {
    await wait(300)
    // モック: token が空、または "invalid" なら無効
    if (!token || token === 'invalid') throw new Error('LINK_INVALID')
    return { email: 's1234567@example.ac.jp' }
  }

  return apiFetch('/api/student/signup/verify', { query: { token } })
}

// A-4 新規登録の実行（G005の「登録する」）
// 失敗時の code: LINK_INVALID（リンクが期限切れ・無効）など
export async function registerStudent({ token, nickname, password, icon }) {
  if (USE_MOCK) {
    await wait(300)
    return
  }

  await apiFetch('/api/student/signup', { method: 'POST', json: { token, nickname, password, icon } })
}

// A-5 パスワード再設定メールの送信（G007）
// 失敗時の code（仮）: NOT_REGISTERED（登録されていないメールアドレス。設計書 G007 イベント2「未登録の場合はエラー」）
export async function sendResetMail(email) {
  if (USE_MOCK) {
    await wait(300)
    // モック用の仮ルール（本物の判定はサーバー側）: 大学のドメイン（仮に example.ac.jp）でない、
    // または unregistered で始まるメールアドレスは「未登録」にする
    if (!email.endsWith('@example.ac.jp') || email.startsWith('unregistered')) throw new Error('NOT_REGISTERED')
    return
  }

  await apiFetch('/api/student/password-reset/mail', { method: 'POST', json: { email } })
}

// A-6 再設定リンクの検証（G009 を開いたとき）
// 失敗（無効・期限切れ・使用済み）: code = LINK_INVALID → 画面はリンクエラー（G039）へ
export async function verifyResetToken(token) {
  if (USE_MOCK) {
    await wait(300)
    // モック: token が空、または "invalid" なら無効（A-3 と同じ仮ルール）
    if (!token || token === 'invalid') throw new Error('LINK_INVALID')
    return
  }

  await apiFetch('/api/student/password-reset/verify', { query: { token } })
}

// A-7 パスワード再設定の実行（G009 の「パスワードを変更する」）
// 失敗時の code（仮）: LINK_INVALID（リンクが期限切れ・無効）
export async function resetPassword(token, password) {
  if (USE_MOCK) {
    await wait(300)
    if (!token || token === 'invalid') throw new Error('LINK_INVALID')
    return
  }

  await apiFetch('/api/student/password-reset', { method: 'POST', json: { token, password } })
}

// A-8 パスワード変更（G025。ログイン中の人が、今のパスワードを入れて変える）
// 失敗時の code（仮）: WRONG_PASSWORD（今のパスワードが違う）
export async function changePassword(currentPassword, newPassword) {
  if (USE_MOCK) {
    await wait(300)
    // モック: 今のパスワードは、ログイン（A-1）のモックと同じ password1
    if (currentPassword !== 'password1') throw new Error('WRONG_PASSWORD')
    return
  }

  await apiFetch('/api/student/password/change', { method: 'POST', json: { currentPassword, newPassword } })
}

// A-9 ログアウト（G038）
// ※ 認証方式（セッションか JWT か）が未定。セッションなら、サーバーがログイン状態を消す
export async function logoutStudent() {
  if (USE_MOCK) {
    await wait(300)
    return
  }

  await apiFetch('/api/student/logout', { method: 'POST' })
}
