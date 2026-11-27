// 落とし物の仮データ（みんなが見られる、公開中の投稿。動作確認用。設計書の値ではない）。
// api/items.js の USE_MOCK = true の間だけ使う。G011・G016・G017・G018・G019 と、申請（G033・G034・G014）、
// 送ったメッセージ（G032・G013）が、このデータを共通で使う。
//
// 項目名は、DB の列（database/schema.sql）が分かる名前にそろえた（11/27。mock/myPosts.js と同じ名前。名前は仮）:
//   postId           投稿ID                        ← lost_item_posts.post_id
//   itemName         落とし物名                    ← lost_item_posts.item_name
//   itemCategory     落とし物のカテゴリー          ← lost_item_posts.category（選択肢は設計書で未定義。内部設計書 第12章）
//   foundAt          拾得日時（ISO形式の文字列）   ← lost_item_posts.found_at
//   foundLocation    拾得場所                      ← lost_item_posts.location
//   itemStatus       保管場所ステータス            ← lost_item_posts.item_status（NOT_ARRIVED / ARRIVED / RETURNED / DISPOSED）
//   storageLocation  保管場所の補足欄。空文字なら補足なし ← lost_item_posts.storage_location（第12章 16）
//   hasMyApplication ログイン中の学生が、すでに受け取り申請したか ← applications に自分の行があるか（詳細APIで返してもらう想定。仮）
//   itemDescription  特徴（未入力は空文字）        ← lost_item_posts.description
//   storageDeadline  保管期限（ISO形式の文字列）   ← ※ DB に列が無い（要確認）
//   postImageUrls    写真のURLの配列（0〜3枚）。写真がないときは空の配列 ← post_images.image_path
export const mockItems = [
  {
    postId: 1,
    itemName: '黒い折り畳み財布',
    itemCategory: '貴重品',
    foundAt: '2026-10-13T16:00:00',
    foundLocation: '1号館',
    itemStatus: 'NOT_ARRIVED',
    storageLocation: '1号館の事務室で一時保管中',
    hasMyApplication: false,
    itemDescription: '',
    storageDeadline: '2027-10-12T23:59:00',
    // 写真が複数枚あるときの動作確認用に、同じ写真を3枚入れている
    postImageUrls: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    postId: 2,
    itemName: '長財布（水色）',
    itemCategory: '貴重品',
    foundAt: '2026-10-13T15:00:00',
    foundLocation: '2号館',
    itemStatus: 'ARRIVED',
    storageLocation: '',
    hasMyApplication: true, // 申請済み（「受け取り申請する」ボタンが出ないことの確認用）
    itemDescription: 'ファスナーが少し壊れている',
    storageDeadline: '2027-10-12T23:59:00',
    postImageUrls: [],
  },
  {
    postId: 3,
    itemName: 'ピンクの財布',
    itemCategory: '貴重品',
    foundAt: '2026-10-13T14:00:00',
    foundLocation: '体育館',
    itemStatus: 'ARRIVED',
    storageLocation: '',
    hasMyApplication: false,
    itemDescription: '小さいキーホルダー付き',
    storageDeadline: '2026-12-10T23:59:00', // 期限まで30日以内（強調表示の確認用）
    postImageUrls: [],
  },
  {
    postId: 4,
    itemName: '白財布',
    itemCategory: '貴重品',
    foundAt: '2026-10-13T13:00:00',
    foundLocation: '食堂',
    itemStatus: 'RETURNED',
    storageLocation: '',
    hasMyApplication: false,
    itemDescription: '',
    storageDeadline: '2027-10-12T23:59:00',
    postImageUrls: [],
  },
  {
    postId: 5,
    itemName: 'iPhone（白）',
    itemCategory: '電子機器',
    foundAt: '2026-10-12T15:00:00',
    foundLocation: '2号館 3階',
    itemStatus: 'ARRIVED',
    storageLocation: '',
    hasMyApplication: false,
    itemDescription: '透明のケース',
    storageDeadline: '2027-10-11T23:59:00',
    postImageUrls: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    postId: 6,
    itemName: '青の水筒',
    itemCategory: '生活用品',
    foundAt: '2026-10-11T14:00:00',
    foundLocation: '体育館',
    itemStatus: 'ARRIVED',
    storageLocation: '',
    hasMyApplication: false,
    itemDescription: '',
    storageDeadline: '2027-10-10T23:59:00',
    postImageUrls: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    postId: 7,
    itemName: 'グレーのマフラー',
    itemCategory: '衣類',
    foundAt: '2026-10-05T18:00:00',
    foundLocation: '学生食堂',
    itemStatus: 'DISPOSED',
    storageLocation: '',
    hasMyApplication: false,
    itemDescription: '',
    storageDeadline: '2026-11-04T23:59:00',
    postImageUrls: [],
  },
]
