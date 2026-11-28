// 通知の仮データ（バックエンドが出来るまでの仮）。
// G012 通知画面が、api/notifications.js を通して使う。
//
// 項目名は、DB の列（database/schema.sql）が分かる名前にそろえた（11/28。名前は仮）:
//   notificationId    通知ID                                   ← notifications.notification_id
//   notificationType  通知の種類（APPLY_APPROVED など。一覧は G012 の NOTIFICATION_TYPES）← notifications.notification_type
//                     ※ 種類の値は DB 設計書で決まっていない（仮）
//   isRead            既読か（false の通知に NEW マーク）       ← notifications.is_read
//   createdAt         通知日時                                 ← notifications.created_at
//   postId            対象の落とし物の投稿ID                     ← ※ notifications に列が無い（要確認）
//                     感謝メッセージの通知（THANKS_RECEIVED）は、自分の投稿なので mock/myPosts.js からつなぐ
//                     それ以外は、自分が申請した・見ている落とし物なので mock/items.js からつなぐ
//   applicationId     押したときに開く申請の ID（G014・G034）    ← ※ notifications に列が無い（要確認）
//   messageId         押したときに開くメッセージの ID（G013）    ← ※ notifications に列が無い（要確認）
//
// ※ DB の notifications.title・message（通知の題名・本文）は使っていない。
//   通知文は、画面が種類ごとに「『落とし物名』が受け取り承認されました。」のように作っている（G012 の NOTIFICATION_TYPES）。
// ※ 申請（101〜104）は mock/applications.js、メッセージ（201・202）は mock/messages.js と同じ内容にそろえた。
//   前の G012（他のメンバーの画面）の仮データ6件を、もとにしている。
export const mockNotifications = [
  {
    notificationId: 1,
    notificationType: 'APPLY_APPROVED',
    isRead: false,
    createdAt: '2026-10-13T16:00:00',
    postId: 1, // 黒い折り畳み財布
    applicationId: 101,
    messageId: null,
  },
  {
    notificationId: 2,
    notificationType: 'APPLY_REJECTED',
    isRead: false,
    createdAt: '2026-10-13T15:00:00',
    postId: 5, // iPhone（白）
    applicationId: 102,
    messageId: null,
  },
  {
    notificationId: 3,
    notificationType: 'HANDOVER_COMPLETED',
    isRead: false,
    createdAt: '2026-10-13T14:00:00',
    postId: 4, // 白財布（受け渡し済み・メッセージ未送信）
    applicationId: 104,
    messageId: null,
  },
  {
    notificationId: 4,
    notificationType: 'THANKS_RECEIVED',
    isRead: true,
    createdAt: '2026-10-13T13:00:00',
    postId: 1, // 自分の投稿の「眼鏡」（mock/myPosts.js）
    applicationId: null,
    messageId: 201,
  },
  {
    notificationId: 5,
    notificationType: 'APPLY_APPROVED',
    isRead: true,
    createdAt: '2026-10-12T18:00:00',
    postId: 3, // ピンクの財布
    applicationId: 103,
    messageId: null,
  },
  {
    notificationId: 6,
    notificationType: 'THANKS_RECEIVED',
    isRead: true,
    createdAt: '2026-10-11T13:00:00',
    postId: 7, // 自分の投稿の「英単語ターゲット1900」（mock/myPosts.js）
    applicationId: null,
    messageId: 202,
  },
]
