// ログイン中の管理者（自分）の仮データ（バックエンドが出来るまでの仮）。
// G048 管理者ホームが、api/me.js を通して使う。
//
// 項目名は、DB の列（database/schema.sql）が分かる名前にそろえた（11/28。名前は仮）:
//   adminName   管理者の氏名（1〜50文字）       ← admins.name
//   email       管理者のメールアドレス          ← admins.email
//
// ※ 名前・メールアドレスは、仮だと分かる値にした（実在の人ではない）
export const mockMe = {
  adminName: '管理者（仮）',
  email: 'admin@example.ac.jp',
}
