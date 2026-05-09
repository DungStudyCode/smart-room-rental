import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      alert("Vui lòng đăng nhập để truy cập tính năng này!");
    }
  }, [token]);

  if (!token) {
    // Chuyển hướng về login và lưu lại trang người dùng định vào (state: { from: location })
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;