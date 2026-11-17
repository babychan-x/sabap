// 認証まわりのAPI。画面からは、この中の関数だけを呼ぶ（fetchを画面に直接書かない）。
// USE_MOCK = true の間は、サーバーに繋がず、ダミーの返事を返す。
// バックエンドが出来たら false にする（パスとJSONは、バックエンドと合わせて直す）。
const USE_MOCK = true

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// サーバーのエラー形式（案）: { code: 'INVALID_DOMAIN' } のように code を返してもらう
async function failFrom(res) {
  const body = await res.json().catch(() => ({}))
  throw new Error(body.code ?? 'UNKNOWN')
}

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

  const res = await fetch('/api/student/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // cookie認証にする場合に必要（認証方式は未定）
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    throw new Error('LOGIN_FAILED')
  }
  return res.json()
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

  const res = await fetch('/api/student/signup/mail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) await failFrom(res)
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

  const res = await fetch(`/api/student/signup/verify?token=${encodeURIComponent(token)}`)
  if (!res.ok) await failFrom(res)
  return res.json()
}

// A-4 新規登録の実行（G005の「登録する」）
// 失敗時の code: LINK_INVALID（リンクが期限切れ・無効）など
export async function registerStudent({ token, nickname, password, icon }) {
  if (USE_MOCK) {
    await wait(300)
    return
  }

  const res = await fetch('/api/student/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, nickname, password, icon }),
  })
  if (!res.ok) await failFrom(res)
}
