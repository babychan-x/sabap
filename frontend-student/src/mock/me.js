// ログイン中の人（自分）の仮データ（バックエンドが出来るまでの仮）。
// G024 マイページが、api/me.js を通して使う。
//
// 項目名は、DB の列（database/schema.sql）が分かる名前にそろえた（11/28。名前は仮）:
//   nickname    ニックネーム（1〜20文字）                       ← users.nickname
//   iconNumber  アイコンの番号（アイコンの画像が未定なので、いまは null → 仮の人型アイコンを表示） ← users.icon_number
//
// ※ 外部設計書 G024 の「学籍番号」は、users に列が無い（いまは画面に出していない。G024-2）。
// ※ ニックネーム「りんご」は、前の G024（他のメンバーの画面）の仮の値。送ったメッセージ（mock/messages.js）の送り主も同じ人。
export const mockMe = {
  nickname: 'りんご',
  iconNumber: null,
}
