import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

// BƯỚC 1: Thêm prop allowedRoles
const ProtectedRoute = ({ allowedRoles }) => {
  // BƯỚC 2: Lấy thêm thông tin `user` từ useAuthStore
  const { accessToken, loading, refresh, user } = useAuthStore();
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    const init = async () => {
      const currentToken = useAuthStore.getState().accessToken;

      if (!currentToken) {
        await refresh(true);
      }
      setStarting(false);
    };

    init();
  }, [refresh]);

  if (starting || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải trang...
      </div>
    );
  }

  // Nếu không có token -> đá văng ra /signin
  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  // BƯỚC 3: Kiểm tra quyền (Role)
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-bold text-red-600">403 - Cấm truy cập</h1>
        <p>Bạn không có quyền xem trang này.</p>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
