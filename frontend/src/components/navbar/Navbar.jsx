import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import NavLink from './NavLink';
import UserDropdown from './UserDropdown';

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
          
          {/* 1. Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-purple-700 tracking-tight">
              TroSmart
            </Link>
          </div>

          {/* 2. Navigation Section */}
          <nav className="hidden md:flex space-x-8 h-full">
            <NavLink to="/" label="Tìm phòng" active={pathname === '/'} />
            <NavLink to="/host/dang-tin-moi" label="Đăng tin" active={pathname === '/host/dang-tin-moi'} />
            <NavLink to="/tro-giup" label="Trợ giúp" active={pathname === '/tro-giup'} />
          </nav>

          {/* 3. Actions Section (Auth) */}
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
                content={<UserDropdown userName={user.fullName} onLogout={handleLogout} />}
                interactive={true}
                placement="bottom-end"
                animation="shift-away"
                theme="light"
              >
                <button className="flex items-center gap-2 group outline-none">
                  <span className="hidden sm:block text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors">
                    {user.fullName?.split(' ').pop()}
                  </span>
                  <div className="text-purple-600 group-hover:text-purple-800 transition-transform group-hover:scale-105">
                    <FaUserCircle size={32} />
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