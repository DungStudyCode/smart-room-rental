// frontend/src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaUserCircle, 
  FaSignOutAlt, 
  FaChartLine,
  FaTachometerAlt,
  FaRobot,
  FaBolt,
  FaUsers,
  FaListAlt,
  FaPlusCircle,
  FaBookmark,
  FaCog
} from 'react-icons/fa'; 
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/light.css'; 

// ==========================================
// 1. Component Con: Nút điều hướng 
// ==========================================
const NavLinkItem = ({ to, label, active }) => (
  <Link 
    to={to} 
    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all ${
      active 
        ? 'border-purple-600 text-purple-700' 
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {label}
  </Link>
);

// ==========================================
// 2. Component Con: Menu thả xuống (PHÂN VÙNG CHUYÊN NGHIỆP)
// ==========================================
const DropdownMenu = ({ user, onLogout }) => (
  <div className="bg-white rounded-xl min-w-[260px] flex flex-col shadow-xl border border-gray-100 overflow-hidden">
    
    {/* HEADER: Thông tin tài khoản */}
    <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100">
      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Tài khoản đang đăng nhập</p>
      <p className="text-sm font-bold text-purple-700 truncate">{user.fullName || 'Người dùng TroSmart'}</p>
      {user.email && <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>}
    </div>
    
    <div className="py-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
      
      {/* ------------------------------------- */}
      {/* PHÂN VÙNG 1: QUẢN TRỊ ADMIN           */}
      {/* ------------------------------------- */}
      {user.role === 'admin' && (
        <div className="mb-2">
          <p className="px-4 py-1.5 text-[10px] text-gray-400 uppercase font-bold tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Khu vực Quản trị
          </p>
          
          <div className="px-2">
            <Link to="/admin" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors font-medium">
              <FaTachometerAlt className="text-gray-400" /> Tổng quan Admin
            </Link>
            <Link to="/admin/crawler" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors font-medium">
              <FaRobot className="text-green-500" /> Quản lý Crawler
            </Link>
            <Link to="/admin/ai-duyet-tin" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors font-medium">
              <FaBolt className="text-purple-500" /> Duyệt tin tự động AI
            </Link>
            <Link to="/admin/users" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors font-medium">
              <FaUsers className="text-blue-500" /> Quản lý Người dùng
            </Link>
            <Link to="/admin/posts" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-700 rounded-lg transition-colors font-medium">
              <FaListAlt className="text-orange-500" /> Quản lý Bài đăng
            </Link>
          </div>
          
          <div className="border-t border-gray-100 mt-2 mx-4"></div>
        </div>
      )}

      {/* ------------------------------------- */}
      {/* PHÂN VÙNG 2: NGƯỜI DÙNG / CHỦ TRỌ     */}
      {/* ------------------------------------- */}
      <div className="mb-1">
        <p className="px-4 py-1.5 text-[10px] text-gray-400 uppercase font-bold tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          Khu vực Cá nhân
        </p>

        <div className="px-2">
          {/* Nhóm Đăng tin & Quản lý */}
          <Link to="/host" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors font-medium">
            <FaChartLine className="text-purple-400" /> Bảng điều khiển
          </Link>
          <Link to="/host/tin-dang" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors font-medium">
            <FaListAlt className="text-purple-400" /> Tin đăng của tôi
          </Link>
          <Link to="/host/dang-tin" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors font-medium">
            <FaPlusCircle className="text-purple-400" /> Đăng tin mới
          </Link>

          {/* Nhóm Tiện ích cá nhân */}
          <Link to="/da-luu" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors font-medium mt-1">
            <FaBookmark className="text-gray-400" /> Phòng đã lưu
          </Link>
          <Link to="/host/cai-dat" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors font-medium">
            <FaCog className="text-gray-400" /> Cài đặt tài khoản
          </Link>
        </div>
      </div>
    </div>

    {/* FOOTER: Nút Đăng xuất */}
    <div className="p-2 border-t border-gray-100 bg-gray-50/50">
      <button 
        onClick={onLogout}
        className="flex items-center justify-center gap-2 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors font-bold"
      >
        <FaSignOutAlt className="text-xl" /> Đăng xuất
      </button>
    </div>
  </div>
);

// ==========================================
// 3. Component Chính: Navbar
// ==========================================
const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-purple-700 tracking-tight">
              TroSmart
            </Link>
          </div>

          {/* Navigation Section */}
          <nav className="hidden md:flex space-x-8 h-full">
            <NavLinkItem to="/" label="Tìm phòng" active={pathname === '/'} />
            <NavLinkItem to="/host/dang-tin" label="Đăng tin" active={pathname.includes('/host/dang-tin')} />
            <NavLinkItem to="/tro-giup" label="Trợ giúp" active={pathname === '/tro-giup'} />
          </nav>

          {/* Actions Section (Auth) */}
          <div className="flex items-center gap-4">
            {!token ? (
              <Link 
                to="/login" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-full font-medium transition-all text-sm shadow-md shadow-purple-100"
              >
                Đăng nhập
              </Link>
            ) : (
              <Tippy
                content={<DropdownMenu user={user} onLogout={handleLogout} />}
                interactive={true}
                placement="bottom-end"
                animation="shift-away"
                theme="light"
                trigger="click focus" // Cho phép click để mở (phù hợp mobile)
              >
                <button className="flex items-center gap-2 group outline-none cursor-pointer p-1 rounded-full hover:bg-purple-50 transition-colors">
                  <span className="hidden sm:block text-sm font-semibold text-gray-700 group-hover:text-purple-700 px-2 transition-colors">
                    {user.fullName ? user.fullName.split(' ').pop() : 'User'}
                  </span>
                  <div className="text-purple-600 group-hover:text-purple-800 transition-transform group-hover:scale-105">
                    <FaUserCircle size={36} />
                  </div>
                </button>
              </Tippy>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;