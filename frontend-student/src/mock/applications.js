// 受け取り申請の仮データ（自分が行った申請。バックエンドが出来るまでの仮。項目名は仮）。
// G033 受け取り申請一覧で使う（api/applications.js の getApplications から返す）。
//
// 項目:
//   id           申請ID（G014 の URL /applications/:id/approval、G034 の URL に使う）
//   itemId       申請した落とし物のID（mock/items.js から画像・落とし物名を出す）
//   status       申請状況 PENDING（承認待ち）/ APPROVED（承認済み）/ REJECTED（却下済み）/ WITHDRAWN（取り下げ済み）
//                ※ WITHDRAWN は設計書 G033 のバッジ「取り下げ済み」に合わせた仮の値（取り下げ機能は削除済み。第12章 9）
//   handedOver   受け渡し済みかどうか（true のときはバッジ「済」。表し方は仮）
//   resultRead   結果を確認したかどうか（false で、結果が出ている申請には NEW マークを付ける）
//   messageSent  感謝メッセージを送ったかどうか（受け渡し済みで false なら、送信を促す案内文を出す）
//   appliedAt    申請日時
//
// ※ 101〜103 は、G014（承認詳細。他のメンバーの画面）の仮データと同じIDで、結果も同じ（101 承認・102 却下・103 承認）。
//   G014 の仮データに無いID（104〜）を開いたときの表示は、G014 側の動きになる。
export const mockApplications = [
  { id: 101, itemId: 1, status: 'APPROVED', handedOver: false, resultRead: false, messageSent: false, appliedAt: '2026-10-13T16:00:00' },
  { id: 102, itemId: 5, status: 'REJECTED', handedOver: false, resultRead: false, messageSent: false, appliedAt: '2026-10-13T15:00:00' },
  { id: 103, itemId: 3, status: 'APPROVED', handedOver: false, resultRead: true, messageSent: false, appliedAt: '2026-10-12T13:00:00' },
  { id: 104, itemId: 4, status: 'APPROVED', handedOver: true, resultRead: true, messageSent: false, appliedAt: '2026-10-10T13:00:00' },
  { id: 105, itemId: 6, status: 'APPROVED', handedOver: true, resultRead: true, messageSent: true, appliedAt: '2026-06-12T13:00:00' },
  { id: 106, itemId: 2, status: 'PENDING', handedOver: false, resultRead: false, messageSent: false, appliedAt: '2026-10-14T10:00:00' },
  { id: 107, itemId: 7, status: 'WITHDRAWN', handedOver: false, resultRead: true, messageSent: false, appliedAt: '2026-03-11T13:00:00' },
]
