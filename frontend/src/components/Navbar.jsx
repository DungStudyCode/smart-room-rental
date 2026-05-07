import { Link, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-purple-700">
              TroSmart
            </Link>
          </div>

          {/* Menu Center */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                location.pathname === '/' 
                  ? 'border-purple-600 text-purple-700' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tìm phòng
            </Link>
            <Link to="/host/dang-tin-moi" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Đăng tin
            </Link>
            <Link to="/tro-giup" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Trợ giúp
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link to="/login" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors text-sm">
              Đăng nhập
            </Link>
            <button className="text-purple-600 hover:text-purple-800 transition-colors">
              <FaUserCircle size={28} />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;