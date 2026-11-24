// 感謝メッセージの仮データ（バックエンドが出来るまでの仮。項目名は仮）。
// G032 メッセージ一覧で使う（api/messages.js の getMessages から返す）。
//
// 項目:
//   id          メッセージID（G013 の URL /messages/:id に使う）
//   box         'received'（受け取った） / 'sent'（送った）
//   senderName  送信者のニックネーム（受信メッセージで表示）
//   senderIcon  送信者のアイコン画像のURL（アイコンの仕様が未定なので、いまは全部 null → 仮のアイコンを表示）
//   itemId      対象の落とし物のID（送信メッセージでは、mock/items.js から画像・落とし物名を出す）
//   body        本文
//   sentAt      送信日時（受信メッセージでは受信日時）
//
// ※ 受信の 201・202 は、G013（メッセージ詳細。他のメンバーの画面）の仮データと同じID・同じ内容。
//   G013 の仮データに無いID（203〜、301〜）を開くと、G013 は 201 の内容を表示する（G013 側の仮の動き）。
export const mockMessages = [
  {
    id: 201,
    box: 'received',
    senderName: 'こなん',
    senderIcon: null,
    itemId: null,
    body: '大事な眼鏡が無事に戻ってきました！\n見通しゼロの暗闇から救出してくれたのは、間違いなくキミの親切な投稿です！本当にありがとうございました！',
    sentAt: '2026-10-13T13:00:00',
  },
  {
    id: 202,
    box: 'received',
    senderName: 'ゆうき',
    senderIcon: null,
    itemId: null,
    body: '英単語帳を拾ってくれてありがとうございました。\nテスト前だったので本当に助かりました！',
    sentAt: '2026-10-11T13:00:00',
  },
  {
    id: 203,
    box: 'received',
    senderName: 'レモンティー',
    senderIcon: null,
    itemId: null,
    body: 'うっかり落として本当に焦っていたので、見つけてもらえてうれしかったです。',
    sentAt: '2026-09-12T13:00:00',
  },
  {
    id: 204,
    box: 'received',
    senderName: 'うたろう',
    senderIcon: null,
    itemId: null,
    body: 'お気に入りのぬいぐるみだったので、見つかって安心しました。ありがとうございます。',
    sentAt: '2026-06-11T13:00:00',
  },
  {
    id: 301,
    box: 'sent',
    senderName: '',
    senderIcon: null,
    itemId: 1,
    body: '大切な財布だったので、親切な方にひろってもらえて本当に助かりました。ありがとうございました！',
    sentAt: '2026-10-13T17:00:00',
  },
  {
    id: 302,
    box: 'sent',
    senderName: '',
    senderIcon: null,
    itemId: 6,
    body: '長く使っている水筒だったので、本当にうれしいです。',
    sentAt: '2026-10-10T13:00:00',
  },
  {
    id: 303,
    box: 'sent',
    senderName: '',
    senderIcon: null,
    itemId: 5,
    body: '高価なものであきらめかけていました。届けてくださって、ありがとうございました。',
    sentAt: '2026-06-12T13:00:00',
  },
]
