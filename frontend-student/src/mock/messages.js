// 感謝メッセージの仮データ（バックエンドが出来るまでの仮）。
// G032 メッセージ一覧・G013 メッセージ詳細が、api/messages.js を通して共通で使う。
//
// 項目名は、DB の列（database/schema.sql）が分かる名前にそろえた（11/27。名前は仮）:
//   messageId        メッセージID（G013 の URL /messages/:id に使う） ← messages.message_id
//   messageBox       'received'（受け取った） / 'sent'（送った）    ← ※ 列ではない。ログイン中の人が送った側か受け取った側か
//   senderNickname   送った人のニックネーム                         ← users.nickname（messages → handovers → applications.user_id でたどる）
//   senderIconNumber 送った人のアイコンの番号（アイコンの画像が未定なので、いまは全部 null → 仮のアイコンを表示） ← users.icon_number
//   postId           対象の落とし物の投稿ID                         ← handovers → applications.post_id
//                    受け取ったメッセージ（received）は、自分の投稿なので mock/myPosts.js からつなぐ
//                    送ったメッセージ（sent）は、自分が受け取った落とし物なので mock/items.js からつなぐ
//   messageBody      本文（1〜140文字）                             ← messages.message
//   sentAt           送信日時（受信メッセージでは受信日時）         ← messages.sent_at
//
// ※ 受信の 201・202 は、前の G013（メッセージ詳細。他のメンバーの画面）の仮データと同じ内容。
//   201 の落とし物は mock/myPosts.js の「眼鏡」、202〜204 の落とし物は mock/myPosts.js に足した 7〜9（11/27）。
// ※ 送ったメッセージの送り主は、ログイン中の人（G024 の仮のニックネーム「りんご」）。
export const mockMessages = [
  {
    messageId: 201,
    messageBox: 'received',
    senderNickname: 'こなん',
    senderIconNumber: null,
    postId: 1,
    messageBody: '大事な眼鏡が無事に戻ってきました！\n見通しゼロの暗闇から救出してくれたのは、間違いなくキミの親切な投稿です！本当にありがとうございました！',
    sentAt: '2026-10-13T13:00:00',
  },
  {
    messageId: 202,
    messageBox: 'received',
    senderNickname: 'ゆうき',
    senderIconNumber: null,
    postId: 7,
    messageBody: '英単語帳を拾ってくれてありがとうございました。\nテスト前だったので本当に助かりました！',
    sentAt: '2026-10-11T13:00:00',
  },
  {
    messageId: 203,
    messageBox: 'received',
    senderNickname: 'レモンティー',
    senderIconNumber: null,
    postId: 8,
    messageBody: 'うっかり落として本当に焦っていたので、見つけてもらえてうれしかったです。',
    sentAt: '2026-09-12T13:00:00',
  },
  {
    messageId: 204,
    messageBox: 'received',
    senderNickname: 'うたろう',
    senderIconNumber: null,
    postId: 9,
    messageBody: 'お気に入りのぬいぐるみだったので、見つかって安心しました。ありがとうございます。',
    sentAt: '2026-06-11T13:00:00',
  },
  {
    messageId: 301,
    messageBox: 'sent',
    senderNickname: 'りんご',
    senderIconNumber: null,
    postId: 1,
    messageBody: '大切な財布だったので、親切な方にひろってもらえて本当に助かりました。ありがとうございました！',
    sentAt: '2026-10-13T17:00:00',
  },
  {
    messageId: 302,
    messageBox: 'sent',
    senderNickname: 'りんご',
    senderIconNumber: null,
    postId: 6,
    messageBody: '長く使っている水筒だったので、本当にうれしいです。',
    sentAt: '2026-10-10T13:00:00',
  },
  {
    messageId: 303,
    messageBox: 'sent',
    senderNickname: 'りんご',
    senderIconNumber: null,
    postId: 5,
    messageBody: '高価なものであきらめかけていました。届けてくださって、ありがとうございました。',
    sentAt: '2026-06-12T13:00:00',
  },
]
