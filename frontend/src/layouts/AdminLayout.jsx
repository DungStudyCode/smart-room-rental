// frontend/src/layouts/AdminLayout.jsx
import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex-1 bg-gray-100 flex font-sans w-full">
      
      {/* Đã sửa top-20 và tính toán lại chiều cao để Sidebar vừa khít dưới Navbar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col sticky top-20 h-[calc(100vh-80px)] z-10">
        <div className="p-4 bg-gray-950 border-b border-gray-800">
          <h1 className="text-xl font-bold text-purple-500">TroSmart Admin</h1>
        </div>
        <nav className="flex flex-col p-4 gap-2 text-sm overflow-y-auto">
          <Link to="/admin" className="p-2 hover:bg-gray-800 rounded">Dashboard</Link>
          <Link to="/admin/crawler" className="p-2 hover:bg-gray-800 rounded text-green-400">Quản lý Crawler</Link>
          <Link to="/admin/ai-duyet-tin" className="p-2 hover:bg-gray-800 rounded text-purple-400">Duyệt tin tự động AI</Link>
          <Link to="/admin/users" className="p-2 hover:bg-gray-800 rounded">Quản lý Users</Link>
          <Link to="/admin/posts" className="p-2 hover:bg-gray-800 rounded">Quản lý Bài đăng</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto pb-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;