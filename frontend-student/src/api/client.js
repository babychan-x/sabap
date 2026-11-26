// API の「窓口」。サーバーと通信するときは、api/ の各ファイルから、この apiFetch を使う。
// 画面からは呼ばない（画面は api/items.js などの関数だけを呼ぶ）。
//
// ここにまとめておくと、バックエンドができたときに、直す場所が1か所で済む。
//   - URL の先頭（API_BASE_URL）
//   - ログイン情報を送る設定（credentials）
//   - エラーのときの動き（Error('コード') を投げる）
//
// ※ 認証方式（セッションか JWT か）は未決定。いまは cookie（セッション）を想定して credentials: 'include' にしている（仮）。
//   JWT になったら、ここでヘッダーに Authorization を付ける形に直す。

// ---------- 設定（.env.local で変えられる。書き方は frontend-student/.env.example） ----------

// true の間は、サーバーに繋がず、各ファイルのダミーの返事を返す。
// .env.local に VITE_USE_MOCK=false と書くと、本物のサーバーに繋ぐ（書かなければ true のまま）。
// ※ 一部の API だけ本物にしたいときは、そのファイルで `const USE_MOCK = false` と書き換える。
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

// URL の先頭。ふだん（開発中）は空のままにして、'/api/...' を vite.config.js の proxy で
// バックエンド（http://localhost:8080）に転送する。本番などで別のサーバーに送るときだけ書く（仮）。
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

// ---------- モック用 ----------

// 通信しているふりをして、少し待つ（「〇〇中…」の表示を確かめるため）
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// ---------- 通信 ----------

// サーバーにリクエストを送って、返ってきた JSON を返す。
//
// 使い方:
//   apiFetch('/api/student/items', { query: { keyword: '財布' } })      // GET
//   apiFetch('/api/student/login', { method: 'POST', json: { email } }) // JSON を送る
//   apiFetch('/api/student/...', { method: 'POST', body: formData })    // 写真など（FormData）を送る
//
//   path:   '/api/...' から書く
//   method: 'GET'（書かなければ GET） / 'POST' / 'PUT' / 'PATCH' / 'DELETE'
//   query:  URL の ? の後ろに付ける値。空の値は付けない
//   json:   JSON にして送るもの
//   body:   FormData（写真つきのフォーム）。Content-Type はブラウザが自動で付けるので書かない
//
// 失敗したとき: Error('コード') を投げる。画面では err.message でコードを見て、表示する文を決める。
//   コードは、サーバーが返す { code: 'NOT_FOUND' } の code（サーバーのエラー形式は案。バックエンドと合わせる）。
//   code が無ければ、404 のとき 'NOT_FOUND'、通信できなかったとき 'NETWORK_ERROR'、それ以外は 'UNKNOWN'（仮）。
//   err.status に HTTP のステータス番号（404 など）も入れる。
export async function apiFetch(path, { method = 'GET', query, json, body } = {}) {
  let url = API_BASE_URL + path
  if (query) {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params.set(key, value)
    })
    const text = params.toString()
    if (text) url += `?${text}`
  }

  const options = {
    method,
    credentials: 'include', // cookie（セッション）を送る。認証方式は未定（仮）
  }
  if (json !== undefined) {
    options.headers = { 'Content-Type': 'application/json' }
    options.body = JSON.stringify(json)
  } else if (body !== undefined) {
    options.body = body
  }

  let res
  try {
    res = await fetch(url, options)
  } catch {
    // サーバーが動いていない・ネットに繋がっていない、など
    throw apiError('NETWORK_ERROR', 0)
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const fallback = res.status === 404 ? 'NOT_FOUND' : 'UNKNOWN'
    throw apiError(data.code ?? fallback, res.status)
  }

  // 中身のない返事（204 など）は null を返す
  if (res.status === 204) return null
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

function apiError(code, status) {
  const error = new Error(code)
  error.status = status
  return error
}
