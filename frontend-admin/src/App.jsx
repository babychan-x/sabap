import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

// auth（G040〜G047、G062〜G065）
import AdminLogin from './features/auth/pages/AdminLogin.jsx'
import AdminResetPasswordRequest from './features/auth/pages/AdminResetPasswordRequest.jsx'
import AdminResetPasswordMailSent from './features/auth/pages/AdminResetPasswordMailSent.jsx'
import AdminResetPassword from './features/auth/pages/AdminResetPassword.jsx'
import AdminResetPasswordComplete from './features/auth/pages/AdminResetPasswordComplete.jsx'
import AdminSignUpForm from './features/auth/pages/AdminSignUpForm.jsx'
import AdminSignUpConfirm from './features/auth/pages/AdminSignUpConfirm.jsx'
import AdminSignUpComplete from './features/auth/pages/AdminSignUpComplete.jsx'
import AdminChangePassword from './features/auth/pages/AdminChangePassword.jsx'
import AdminChangePasswordComplete from './features/auth/pages/AdminChangePasswordComplete.jsx'
import AdminLogoutConfirm from './features/auth/pages/AdminLogoutConfirm.jsx'
import AdminLinkError from './features/auth/pages/AdminLinkError.jsx'

// home（G048）
import AdminHome from './features/home/pages/AdminHome.jsx'

// application（G049〜G050）
import AdminApplyList from './features/application/pages/AdminApplyList.jsx'
import AdminApplyDetail from './features/application/pages/AdminApplyDetail.jsx'

// message（G051〜G052）
import AdminMessageList from './features/message/pages/AdminMessageList.jsx'
import AdminMessageDetail from './features/message/pages/AdminMessageDetail.jsx'

// handover（G053〜G054）
import AdminHandoverList from './features/handover/pages/AdminHandoverList.jsx'
import AdminHandoverDetail from './features/handover/pages/AdminHandoverDetail.jsx'

// account（G055〜G059）
import AdminInvite from './features/account/pages/AdminInvite.jsx'
import AdminInviteComplete from './features/account/pages/AdminInviteComplete.jsx'
import AdminDeactivateInput from './features/account/pages/AdminDeactivateInput.jsx'
import AdminDeactivateConfirm from './features/account/pages/AdminDeactivateConfirm.jsx'
import AdminDeactivateComplete from './features/account/pages/AdminDeactivateComplete.jsx'

// item（G060〜G061）
import AdminPostList from './features/item/pages/AdminPostList.jsx'
import AdminPostDetail from './features/item/pages/AdminPostDetail.jsx'

// 管理者画面の入口（ルーティング）。画面が増えたら、ここに Route を足していく。
// ?token= や ?tab= は path に含めず、各画面で読み取る予定。
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* アプリのルート（/）を開いたときは、ログイン画面へ */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ---------- auth ---------- */}
        <Route path="/login" element={<AdminLogin />} />                                    {/* G040 */}
        <Route path="/reset-password/request" element={<AdminResetPasswordRequest />} />    {/* G041 */}
        <Route path="/reset-password/mail-sent" element={<AdminResetPasswordMailSent />} /> {/* G042 */}
        <Route path="/reset-password" element={<AdminResetPassword />} />                   {/* G043 ?token=（使用予定） */}
        <Route path="/reset-password/complete" element={<AdminResetPasswordComplete />} />  {/* G044 */}
        <Route path="/signup" element={<AdminSignUpForm />} />                              {/* G045 ?token=（使用予定） */}
        <Route path="/signup/confirm" element={<AdminSignUpConfirm />} />                   {/* G046 */}
        <Route path="/signup/complete" element={<AdminSignUpComplete />} />                 {/* G047 */}
        <Route path="/password" element={<AdminChangePassword />} />                        {/* G062 */}
        <Route path="/password/complete" element={<AdminChangePasswordComplete />} />       {/* G063 */}
        <Route path="/logout" element={<AdminLogoutConfirm />} />                           {/* G064 */}
        <Route path="/link-error" element={<AdminLinkError />} />                           {/* G065 */}

        {/* ---------- home ---------- */}
        <Route path="/home" element={<AdminHome />} />                                      {/* G048 */}

        {/* ---------- application ---------- */}
        <Route path="/applications" element={<AdminApplyList />} />                         {/* G049 */}
        <Route path="/applications/:itemId" element={<AdminApplyDetail />} />               {/* G050 */}

        {/* ---------- message ---------- */}
        <Route path="/messages" element={<AdminMessageList />} />                           {/* G051 */}
        <Route path="/messages/:id" element={<AdminMessageDetail />} />                     {/* G052 */}

        {/* ---------- handover ---------- */}
        <Route path="/handovers" element={<AdminHandoverList />} />                         {/* G053 ?tab=（使用予定） */}
        <Route path="/handovers/:id" element={<AdminHandoverDetail />} />                   {/* G054 */}

        {/* ---------- account ---------- */}
        <Route path="/invite" element={<AdminInvite />} />                                  {/* G055 */}
        <Route path="/invite/complete" element={<AdminInviteComplete />} />                 {/* G056 */}
        <Route path="/deactivate" element={<AdminDeactivateInput />} />                     {/* G057 */}
        <Route path="/deactivate/confirm" element={<AdminDeactivateConfirm />} />           {/* G058 */}
        <Route path="/deactivate/complete" element={<AdminDeactivateComplete />} />         {/* G059 */}

        {/* ---------- item ---------- */}
        <Route path="/posts" element={<AdminPostList />} />                                 {/* G060 ?tab=（使用予定） */}
        <Route path="/posts/:id" element={<AdminPostDetail />} />                           {/* G061 */}
      </Routes>
    </BrowserRouter>
  )
}
