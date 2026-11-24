// 落とし物の仮データ（動作確認用。設計書の値ではない）。
// api/items.js の USE_MOCK = true の間だけ使う。G016・G017・G018 で同じデータを使う。
//
// 項目名は仮（DB設計書・APIの JSON と合わせて、あとで直す）:
//   id            落とし物ID
//   name          落とし物名
//   category      カテゴリー（選択肢は設計書で未定義。内部設計書 第12章。G011 の仮の選択肢に合わせた）
//   foundAt       拾得日時（ISO形式の文字列）
//   foundPlace    拾得場所
//   storageStatus 保管場所ステータス（NOT_ARRIVED / ARRIVED / RETURNED / DISPOSED）
//   storageNote   保管場所の補足欄（設計書に項目名なし。第12章 16）。空文字なら補足なし
//   alreadyApplied ログイン中の学生が、すでに受け取り申請したか（詳細APIで返してもらう想定。仮）
//   features      特徴（未入力は空文字）
//   storageDeadline 保管期限（ISO形式の文字列）
//   images        写真のURLの配列（0〜3枚）。写真がないときは空の配列
export const mockItems = [
  {
    id: 1,
    name: '黒い折り畳み財布',
    category: '貴重品',
    foundAt: '2026-10-13T16:00:00',
    foundPlace: '1号館',
    storageStatus: 'NOT_ARRIVED',
    storageNote: '1号館の事務室で一時保管中',
    alreadyApplied: false,
    features: '',
    storageDeadline: '2027-10-12T23:59:00',
    // 写真が複数枚あるときの動作確認用に、同じ写真を3枚入れている
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: 2,
    name: '長財布（水色）',
    category: '貴重品',
    foundAt: '2026-10-13T15:00:00',
    foundPlace: '2号館',
    storageStatus: 'ARRIVED',
    storageNote: '',
    alreadyApplied: true, // 申請済み（「受け取り申請する」ボタンが出ないことの確認用）
    features: 'ファスナーが少し壊れている',
    storageDeadline: '2027-10-12T23:59:00',
    images: [],
  },
  {
    id: 3,
    name: 'ピンクの財布',
    category: '貴重品',
    foundAt: '2026-10-13T14:00:00',
    foundPlace: '体育館',
    storageStatus: 'ARRIVED',
    storageNote: '',
    alreadyApplied: false,
    features: '小さいキーホルダー付き',
    storageDeadline: '2026-12-10T23:59:00', // 期限まで30日以内（強調表示の確認用）
    images: [],
  },
  {
    id: 4,
    name: '白財布',
    category: '貴重品',
    foundAt: '2026-10-13T13:00:00',
    foundPlace: '食堂',
    storageStatus: 'RETURNED',
    storageNote: '',
    alreadyApplied: false,
    features: '',
    storageDeadline: '2027-10-12T23:59:00',
    images: [],
  },
  {
    id: 5,
    name: 'iPhone（白）',
    category: '電子機器',
    foundAt: '2026-10-12T15:00:00',
    foundPlace: '2号館 3階',
    storageStatus: 'ARRIVED',
    storageNote: '',
    alreadyApplied: false,
    features: '透明のケース',
    storageDeadline: '2027-10-11T23:59:00',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: 6,
    name: '青の水筒',
    category: '生活用品',
    foundAt: '2026-10-11T14:00:00',
    foundPlace: '体育館',
    storageStatus: 'ARRIVED',
    storageNote: '',
    alreadyApplied: false,
    features: '',
    storageDeadline: '2027-10-10T23:59:00',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: 7,
    name: 'グレーのマフラー',
    category: '衣類',
    foundAt: '2026-10-05T18:00:00',
    foundPlace: '学生食堂',
    storageStatus: 'DISPOSED',
    storageNote: '',
    alreadyApplied: false,
    features: '',
    storageDeadline: '2026-11-04T23:59:00',
    images: [],
  },
]
