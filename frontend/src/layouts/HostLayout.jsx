// frontend/src/layouts/HostLayout.jsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaThLarge, FaList, FaPlus, FaCog, FaArrowLeft } from 'react-icons/fa';

const HostLayout = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="flex-1 bg-[#f8f9fa] flex font-sans w-full">
      
      {/* Đã sửa top-20 và tính toán lại chiều cao để Sidebar vừa khít dưới Navbar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex sticky top-20 h-[calc(100vh-80px)] shadow-sm z-10">
        
        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border-2 border-purple-100 bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-lg shrink-0">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'H'}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-gray-800 truncate">Bảng điều khiển</h2>
            <p className="text-xs text-gray-500 truncate">{user.fullName || 'Chủ trọ TroSmart'}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <Link to="/host" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${location.pathname === '/host' ? 'bg-purple-100/50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <FaThLarge className="text-lg" /> Tổng quan
          </Link>
          <Link to="/host/tin-dang" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive('/host/tin-dang') ? 'bg-purple-100/50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <FaList className="text-lg" /> Tin đăng của tôi
          </Link>
          <Link to="/host/dang-tin" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive('/host/dang-tin') ? 'bg-purple-600 text-white shadow-md shadow-purple-200' : 'text-gray-600 hover:bg-gray-50'}`}>
            <FaPlus className="text-lg" /> Đăng tin mới
          </Link>
          <Link to="/host/cai-dat" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all mt-4">
            <FaCog className="text-lg" /> Cài đặt
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-50">
          <Link to="/" className="flex items-center justify-center gap-2 w-full bg-[#006b7b] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[#005a67] transition-all shadow-sm">
            <FaArrowLeft /> Xem hiệu quả (Về trang chủ)
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto pb-10">
        <Outlet />
      </main>

    </div>
  );
};

export default HostLayout;