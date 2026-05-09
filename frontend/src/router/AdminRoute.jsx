import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const token = localStorage.getItem('token');
    const userStore = localStorage.getItem('user');

    // Kiểm tra xem userStore có tồn tại không trước khi Parse
    const user = userStore ? JSON.parse(userStore) : null;

    if (!token || user?.role !== 'admin') {
        alert('Bạn không có quyền truy cập vào khu vực này!');
        return <Navigate to="/login" replace />;
    }

    return <Outlet/>;
};
export default AdminRoute;
