// 受け取り申請の仮データ（自分が行った申請。バックエンドが出来るまでの仮）。
// G033 受け取り申請一覧・G014 承認詳細・G034 受け渡し済み詳細が、api/applications.js を通して共通で使う。
// 申請した落とし物は、postId で mock/items.js からつなぐ。
//
// 項目名は、DB の列（database/schema.sql）が分かる名前にそろえた（11/27。名前は仮）:
//   applicationId      申請ID（G014・G034 の URL に使う）       ← applications.application_id
//   postId             申請した落とし物の投稿ID                  ← applications.post_id
//   applicationStatus  申請状況 PENDING（承認待ち）/ APPROVED（承認済み）/ REJECTED（却下済み）/ WITHDRAWN（取り下げ済み）
//                                                                ← applications.application_status
//                      ※ WITHDRAWN は設計書 G033 のバッジ「取り下げ済み」に合わせた仮の値（DB には無い。取り下げ機能は削除済み。第12章 9）
//   isHandedOver       受け渡し済みか                            ← handovers.handed_over_at に値があるか
//   isResultRead       結果を確認したか（false で、結果が出ている申請には NEW マーク） ← ※ DB に列が無い（要確認）
//   isMessageSent      感謝メッセージを送ったか                  ← messages に、この受け渡しの行があるか
//   appliedAt          申請日時                                  ← applications.created_at
//   applicationReason  申請理由（G018 で入力した内容。G014・G034 で表示する） ← applications.reason
//   pickupDeadline     受け取り期限（承認のとき。G014 で表示する） ← handovers.pickup_end_at（この列で合っているか要確認）
//   pickupLocation     受け取り場所（承認のとき。G014 で表示する） ← ※ DB に列が無い（いつも「学生厚生」なら固定の文字でよい。要確認）
//
// ※ 101〜103 の受け取り期限・受け取り場所は、前の G014（承認詳細。他のメンバーの画面）の仮データの値を使った。
//   落とし物の中身は mock/items.js のものになる（前の G014 の仮データとは、名前などが少し違う）。
export const mockApplications = [
  { applicationId: 101, postId: 1, applicationStatus: 'APPROVED', isHandedOver: false, isResultRead: false, isMessageSent: false, appliedAt: '2026-10-13T16:00:00', applicationReason: '今日の15:30頃に、1号館の演習室で講義を受けていました。休憩時間に財布を出し入れしたので、置きっぱなしにしてしまった可能性があるから。\n中に学生証が入っていると思います。', pickupDeadline: '2026-10-27T16:00:00', pickupLocation: '学生厚生' },
  { applicationId: 102, postId: 5, applicationStatus: 'REJECTED', isHandedOver: false, isResultRead: false, isMessageSent: false, appliedAt: '2026-10-13T15:00:00', applicationReason: '2号館の教室で、白いケースのiPhoneを置き忘れたかもしれません。', pickupDeadline: null, pickupLocation: '' },
  { applicationId: 103, postId: 3, applicationStatus: 'APPROVED', isHandedOver: false, isResultRead: true, isMessageSent: false, appliedAt: '2026-10-12T13:00:00', applicationReason: '昼休みに食堂でピンクの財布を使い、そのまま置いてきてしまったと思います。', pickupDeadline: '2026-10-27T13:00:00', pickupLocation: '学生厚生' },
  { applicationId: 104, postId: 4, applicationStatus: 'APPROVED', isHandedOver: true, isResultRead: true, isMessageSent: false, appliedAt: '2026-10-10T13:00:00', applicationReason: '今日のお昼に図書館で財布を使い、置いたまま講義に向かってしまったから。\n中には白いレースのハンカチと目薬が入っています。', pickupDeadline: null, pickupLocation: '' },
  { applicationId: 105, postId: 6, applicationStatus: 'APPROVED', isHandedOver: true, isResultRead: true, isMessageSent: true, appliedAt: '2026-06-12T13:00:00', applicationReason: '体育館で部活の練習をしたあと、青い水筒を置き忘れました。', pickupDeadline: null, pickupLocation: '' },
  { applicationId: 106, postId: 2, applicationStatus: 'PENDING', isHandedOver: false, isResultRead: false, isMessageSent: false, appliedAt: '2026-10-14T10:00:00', applicationReason: '水色の長財布を、3号館のラウンジで落としたかもしれません。', pickupDeadline: null, pickupLocation: '' },
  { applicationId: 107, postId: 7, applicationStatus: 'WITHDRAWN', isHandedOver: false, isResultRead: true, isMessageSent: false, appliedAt: '2026-03-11T13:00:00', applicationReason: 'グレーのマフラーを講義室に置き忘れたと思います。', pickupDeadline: null, pickupLocation: '' },
]
