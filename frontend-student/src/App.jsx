import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import StudentLogin from './features/auth/pages/StudentLogin'
import StudentSignUpMailSent from './features/auth/pages/StudentSignUpMailSent'

// 画面の入口（ルーティング）。画面が増えたら、ここに Route を足していく。
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/signup/mail-sent" element={<StudentSignUpMailSent />} />

        {/* G011 投稿一覧は、まだ作っていないので仮の表示 */}
        <Route path="/home" element={<p style={{ padding: 24 }}>ホーム（G011：これから作る）</p>} />

        {/* 開いたURLが無いときは、ログイン画面へ */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}