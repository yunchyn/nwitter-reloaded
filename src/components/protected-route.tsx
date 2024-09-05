// 로그인한 사용자만 protected-route를 보고,
// 로그인하지 않은 사용자는 login 또는 create-account 페이지로 리디렉션

import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

// Home과 Profile이 children으로 전달된다
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = auth.currentUser;
  // currentUser : 로그인한 사용자의 경우 User 정보,
  // 로그인하지 않았다면 null을 리턴
  if (user === null) {
    return <Navigate to="/login" />;
  }

  return children;
}
