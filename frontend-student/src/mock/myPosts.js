// 自分の投稿（ログイン中の学生が投稿した落とし物）の仮データ（バックエンドが出来るまでの仮）。
// G027（一覧）・G028（詳細）・G029（編集）・G030（編集確認）が、api/myPosts.js を通して、この1つのデータを使う。
// 前は3つの画面が別々に仮データを持っていた（2026/11/27 にここへ集めた。中身は G028 の仮データと同じ）。
//
// 項目名は、DB の列（database/schema.sql）が分かる名前にそろえた（名前は仮。API の JSON はバックエンドと合わせる）:
//   postId          投稿ID                       ← lost_item_posts.post_id
//   itemName        落とし物名                   ← lost_item_posts.item_name（50文字まで）
//   itemCategory    落とし物のカテゴリー         ← lost_item_posts.category
//   foundAt         拾得日時（ISO形式の文字列）  ← lost_item_posts.found_at
//   foundLocation   拾得場所                     ← lost_item_posts.location
//   itemStatus      保管場所ステータス           ← lost_item_posts.item_status（NOT_ARRIVED / ARRIVED / RETURNED / DISPOSED）
//   itemDescription 特徴（未入力は空文字）       ← lost_item_posts.description（200文字まで）
//   storageDeadline 保管期限（ISO形式の文字列）  ← ※ DB に列が無い（要確認。docs の data_flow_student.md §8）
//   hasApplication  受け取り申請があるか         ← applications に、この投稿の行があるか
//   postImageUrls   写真のURLの配列（0〜4枚）    ← post_images.image_path（image_number の順）
//   postedAt        投稿日時（ISO形式の文字列）  ← lost_item_posts.created_at（G027 に表示する）
//
// ※ 投稿日時（postedAt）は、前の G027 の仮データに表示していた日時をそのまま使った。
// ※ この配列は、api/myPosts.js の削除・編集（モック）で書き換わる（ページを再読み込みすると元に戻る）。

const glassesImage = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80'

export const mockMyPosts = [
  {
    postId: 1,
    itemName: '眼鏡',
    itemCategory: 'メガネ',
    foundAt: '2026-10-12T18:00:00',
    foundLocation: '4号館',
    itemStatus: 'NOT_ARRIVED',
    itemDescription: '',
    storageDeadline: '2027-10-12T23:59:00',
    hasApplication: true,
    // 写真が複数枚あるときの動作確認用に、同じ写真を3枚入れている
    postImageUrls: [glassesImage, glassesImage, glassesImage],
    postedAt: '2026-10-12T18:00:00',
  },
  {
    postId: 2,
    itemName: 'ボールペン三本',
    itemCategory: 'その他',
    foundAt: '2026-10-12T15:00:00',
    foundLocation: '2号館',
    itemStatus: 'NOT_ARRIVED',
    itemDescription: 'ピンク・水色・黄色のペンが1本ずつ',
    storageDeadline: '2027-10-12T23:59:00',
    hasApplication: false,
    postImageUrls: [],
    postedAt: '2026-10-12T15:00:00',
  },
  {
    postId: 3,
    itemName: '折りたたみ傘(白)',
    itemCategory: '傘',
    foundAt: '2026-09-12T13:00:00',
    foundLocation: '体育館',
    itemStatus: 'ARRIVED',
    itemDescription: '',
    storageDeadline: '2027-09-12T23:59:00',
    hasApplication: false,
    postImageUrls: [],
    postedAt: '2026-09-12T13:00:00',
  },
  {
    postId: 4,
    itemName: '水筒ボトル(透明)',
    itemCategory: 'その他',
    foundAt: '2026-06-12T13:00:00',
    foundLocation: '体育館',
    itemStatus: 'RETURNED',
    itemDescription: '蓋にコルクが付いている',
    storageDeadline: '2027-06-12T23:59:00',
    hasApplication: true,
    postImageUrls: [],
    postedAt: '2026-06-12T13:00:00',
  },
  {
    postId: 5,
    itemName: 'キーホルダーと鍵',
    itemCategory: 'その他',
    foundAt: '2026-03-11T13:00:00',
    foundLocation: '1号館',
    itemStatus: 'ARRIVED',
    itemDescription: 'クマのキーホルダーと鍵2本',
    storageDeadline: '2027-03-11T23:59:00',
    hasApplication: true,
    postImageUrls: [],
    postedAt: '2026-03-11T13:00:00',
  },
  {
    postId: 6,
    itemName: '充電ケーブル',
    itemCategory: 'その他',
    foundAt: '2026-06-12T13:00:00',
    foundLocation: '食堂',
    itemStatus: 'NOT_ARRIVED',
    itemDescription: 'ケーブルは白色',
    storageDeadline: '2027-06-12T23:59:00',
    hasApplication: false,
    postImageUrls: [],
    postedAt: '2026-06-12T13:00:00',
  },
]
