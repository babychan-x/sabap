// 認証まわりのAPI呼び出し。
// 画面（pages）はこのファイルの関数だけを呼ぶ。URLは画面側に直接書かない。
//
// 今はバックエンドが無いので、モック（ダミーの返事）を返す。
// バックエンドができたら USE_MOCK を false にして、fetch の部分を使う。

const USE_MOCK = true

// A-1 学生ログイン（POST /api/student/login）※パスは仮
export async function loginStudent(email, password) {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300)) // 通信している感じを出す
    // モックの条件: パスワードが "password1" ならログイン成功
    if (password === 'password1') {
      return { nickname: 'りんご' }
    }
    throw new Error('LOGIN_FAILED')
  }

  const res = await fetch('/api/student/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // cookie を使う認証にする場合に必要（認証方式は未決定）
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    throw new Error('LOGIN_FAILED')
  }
  return res.json()
}
