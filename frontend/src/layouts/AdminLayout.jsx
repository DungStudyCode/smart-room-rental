import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import UserDropdown from '../components/navbar/UserDropdown';

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar (Cột menu bên trái) */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-4 bg-gray-950 border-b border-gray-800 h-20 flex items-center">
          <h1 className="text-xl font-bold text-purple-500">TroSmart Admin</h1>
        </div>
        <nav className="flex flex-col p-4 gap-2 text-sm">
          <Link to="/admin" className="p-2 hover:bg-gray-800 rounded">Dashboard</Link>
          <Link to="/admin/crawler" className="p-2 hover:bg-gray-800 rounded text-green-400">Quản lý Crawler</Link>
          <Link to="/admin/ai-duyet-tin" className="p-2 hover:bg-gray-800 rounded text-purple-400">Duyệt tin tự động AI</Link>
          <Link to="/admin/users" className="p-2 hover:bg-gray-800 rounded">Quản lý Users</Link>
          <Link to="/admin/posts" className="p-2 hover:bg-gray-800 rounded">Quản lý Bài đăng</Link>
        </nav>
      </aside>

      {/* Khu vực bên phải */}
      <div className="flex-1 flex flex-col">
        {/* Header phía trên */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div>
            <h2 className="text-gray-500 text-sm font-medium">Xin chào Admin,</h2>
            <p className="text-gray-800 font-bold">{user.fullName}</p>
          </div>

          <div className="flex items-center gap-6">
            {/* Icon thông báo (Option) */}
            <button className="text-gray-400 hover:text-purple-600 transition-colors">
              <FaBell size={20} />
            </button>

            {/* User Dropdown tương tự Navbar */}
            <Tippy
              content={<UserDropdown userName={user.fullName} onLogout={handleLogout} />}
              interactive={true}
              placement="bottom-end"
              animation="shift-away"
              theme="light"
            >
              <button className="flex items-center gap-3 group outline-none">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                    {user.fullName?.split(' ').pop()}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Administrator</p>
                </div>
                <div className="text-purple-600 group-hover:text-purple-800 transition-transform group-hover:scale-105">
                  <FaUserCircle size={36} />
                </div>
              </button>
            </Tippy>
          </div>
        </header>

        {/* Nội dung trang Admin */}
        <main className="p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;