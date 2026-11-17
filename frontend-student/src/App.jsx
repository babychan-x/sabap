import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import StudentLogin from './features/auth/pages/StudentLogin'
import StudentSignUp from './features/auth/pages/StudentSignUp'
import StudentSignUpMailSent from './features/auth/pages/StudentSignUpMailSent'
import StudentSignUpForm from './features/auth/pages/StudentSignUpForm'
import StudentSignUpConfirm from './features/auth/pages/StudentSignUpConfirm'

// 画面の入口（ルーティング）。画面が増えたら、ここに Route を足していく。
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<StudentLogin />} />                          {/* G001 */}
        <Route path="/signup" element={<StudentSignUp />} />                        {/* G002 */}
        <Route path="/signup/mail-sent" element={<StudentSignUpMailSent />} />      {/* G003 */}
        <Route path="/signup/form" element={<StudentSignUpForm />} />               {/* G004 ?token= */}
        <Route path="/signup/confirm" element={<StudentSignUpConfirm />} />         {/* G005 */}

        {/* G011 投稿一覧は、まだ作っていないので仮の表示 */}
        <Route path="/home" element={<p style={{ padding: 24 }}>ホーム（G011：これから作る）</p>} />

        {/* 開いたURLが無いときは、ログイン画面へ */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}