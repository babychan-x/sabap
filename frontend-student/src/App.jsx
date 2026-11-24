import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// auth（G001〜G010、G038、G039）
import StudentLogin from './features/auth/pages/StudentLogin'
import StudentSignUp from './features/auth/pages/StudentSignUp'
import StudentSignUpMailSent from './features/auth/pages/StudentSignUpMailSent'
import StudentSignUpForm from './features/auth/pages/StudentSignUpForm'
import StudentSignUpConfirm from './features/auth/pages/StudentSignUpConfirm'
import StudentSignUpComplete from './features/auth/pages/StudentSignUpComplete'
import StudentResetPasswordRequest from './features/auth/pages/StudentResetPasswordRequest'
import StudentResetPasswordMailSent from './features/auth/pages/StudentResetPasswordMailSent'
import StudentResetPassword from './features/auth/pages/StudentResetPassword'
import StudentResetPasswordComplete from './features/auth/pages/StudentResetPasswordComplete'
import StudentLogoutConfirm from './features/auth/pages/StudentLogoutConfirm'
import StudentLinkError from './features/auth/pages/StudentLinkError'

// item（G011、G016〜G023）
import StudentHome from './features/item/pages/StudentHome'
import StudentSearchResult from './features/item/pages/StudentSearchResult'
import StudentItemDetail from './features/item/pages/StudentItemDetail'
import StudentApply from './features/item/pages/StudentApply'
import StudentApplyConfirm from './features/item/pages/StudentApplyConfirm'
import StudentApplyComplete from './features/item/pages/StudentApplyComplete'
import StudentPostItem from './features/item/pages/StudentPostItem'
import StudentPostItemConfirm from './features/item/pages/StudentPostItemConfirm'
import StudentPostItemComplete from './features/item/pages/StudentPostItemComplete'

// notification（G012）
import StudentNotification from './features/notification/pages/StudentNotification'

// message（G013、G032、G035〜G037）
import StudentMessageDetail from './features/message/pages/StudentMessageDetail'
import StudentMessageList from './features/message/pages/StudentMessageList'
import StudentMessageWrite from './features/message/pages/StudentMessageWrite'
import StudentMessageConfirm from './features/message/pages/StudentMessageConfirm'
import StudentMessageComplete from './features/message/pages/StudentMessageComplete'

// application（G014、G033、G034）
import StudentApprovalDetail from './features/application/pages/StudentApprovalDetail'
import StudentApplyList from './features/application/pages/StudentApplyList'
import StudentHandedOverDetail from './features/application/pages/StudentHandedOverDetail'

// mypage（G024〜G031）
import StudentMyPage from './features/mypage/pages/StudentMyPage'
import StudentChangePassword from './features/mypage/pages/StudentChangePassword'
import StudentChangePasswordComplete from './features/mypage/pages/StudentChangePasswordComplete'
import StudentMyPostList from './features/mypage/pages/StudentMyPostList'
import StudentMyPostDetail from './features/mypage/pages/StudentMyPostDetail'
import StudentMyPostEdit from './features/mypage/pages/StudentMyPostEdit'
import StudentMyPostEditConfirm from './features/mypage/pages/StudentMyPostEditConfirm'
import StudentMyPostEditComplete from './features/mypage/pages/StudentMyPostEditComplete'

// 画面の入口（ルーティング）。画面が増えたら、ここに Route を足していく。
// ?token= や ?keyword= などのクエリは、path には書かず、各画面の中で読み取る。
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- auth ---------- */}
        <Route path="/login" element={<StudentLogin />} />                                   {/* G001 */}
        <Route path="/signup" element={<StudentSignUp />} />                                 {/* G002 */}
        <Route path="/signup/mail-sent" element={<StudentSignUpMailSent />} />               {/* G003 */}
        {/* G004 は、メールのリンク（?token=）から開く画面。token が無いとリンクエラー画面（G039）へ移る。
            確認用: ブラウザで /signup/form?token=abc を開くと表示できる（token は invalid 以外なら何でもOK・モック） */}
        <Route path="/signup/form" element={<StudentSignUpForm />} />                        {/* G004 ?token= */}
        <Route path="/signup/confirm" element={<StudentSignUpConfirm />} />                  {/* G005 */}
        <Route path="/signup/complete" element={<StudentSignUpComplete />} />                {/* G006 */}
        <Route path="/reset-password/request" element={<StudentResetPasswordRequest />} />   {/* G007 */}
        <Route path="/reset-password/mail-sent" element={<StudentResetPasswordMailSent />} /> {/* G008 */}
        <Route path="/reset-password" element={<StudentResetPassword />} />                  {/* G009 ?token= */}
        <Route path="/reset-password/complete" element={<StudentResetPasswordComplete />} /> {/* G010 */}
        <Route path="/mypage/logout" element={<StudentLogoutConfirm />} />                   {/* G038 */}
        <Route path="/link-error" element={<StudentLinkError />} />                          {/* G039 */}

        {/* ---------- item ---------- */}
        <Route path="/home" element={<StudentHome />} />                                     {/* G011 */}
        <Route path="/search" element={<StudentSearchResult />} />                           {/* G016 ?keyword= */}
        {/* G015 申請結果詳細と G017 落とし物詳細は、同じ画面（studentItemDetail）。2026/11/24 確定（第12章 5） */}
        <Route path="/items/:id" element={<StudentItemDetail />} />                          {/* G015・G017 */}
        <Route path="/items/:id/apply" element={<StudentApply />} />                         {/* G018 */}
        <Route path="/items/:id/apply/confirm" element={<StudentApplyConfirm />} />          {/* G019 */}
        <Route path="/items/:id/apply/complete" element={<StudentApplyComplete />} />        {/* G020 */}
        <Route path="/post" element={<StudentPostItem />} />                                 {/* G021 */}
        <Route path="/post/confirm" element={<StudentPostItemConfirm />} />                  {/* G022 */}
        <Route path="/post/complete" element={<StudentPostItemComplete />} />                {/* G023 */}

        {/* ---------- notification ---------- */}
        <Route path="/notifications" element={<StudentNotification />} />                    {/* G012 */}

        {/* ---------- message ---------- */}
        <Route path="/messages/:id" element={<StudentMessageDetail />} />                    {/* G013 */}
        <Route path="/mypage/messages" element={<StudentMessageList />} />                   {/* G032 */}
        <Route path="/mypage/applications/:id/message" element={<StudentMessageWrite />} />  {/* G035 */}
        <Route path="/mypage/applications/:id/message/confirm" element={<StudentMessageConfirm />} />   {/* G036 */}
        <Route path="/mypage/applications/:id/message/complete" element={<StudentMessageComplete />} /> {/* G037 */}

        {/* ---------- application ---------- */}
        <Route path="/applications/:id/approval" element={<StudentApprovalDetail />} />      {/* G014 */}
        <Route path="/mypage/applications" element={<StudentApplyList />} />                 {/* G033 */}
        <Route path="/mypage/applications/:id/handed-over" element={<StudentHandedOverDetail />} /> {/* G034 */}

        {/* ---------- mypage ---------- */}
        <Route path="/mypage" element={<StudentMyPage />} />                                 {/* G024 */}
        <Route path="/mypage/password" element={<StudentChangePassword />} />                {/* G025 */}
        <Route path="/mypage/password/complete" element={<StudentChangePasswordComplete />} /> {/* G026 */}
        <Route path="/mypage/posts" element={<StudentMyPostList />} />                       {/* G027 */}
        <Route path="/mypage/posts/:id" element={<StudentMyPostDetail />} />                 {/* G028 */}
        <Route path="/mypage/posts/:id/edit" element={<StudentMyPostEdit />} />              {/* G029 */}
        <Route path="/mypage/posts/:id/edit/confirm" element={<StudentMyPostEditConfirm />} />   {/* G030 */}
        <Route path="/mypage/posts/:id/edit/complete" element={<StudentMyPostEditComplete />} /> {/* G031 */}

        {/* 開いたURLが無いときは、ログイン画面へ */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
