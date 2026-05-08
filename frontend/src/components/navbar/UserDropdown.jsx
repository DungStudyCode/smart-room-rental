import { FaSignOutAlt } from 'react-icons/fa';

const UserDropdown = ({ userName, onLogout }) => (
  <div className="bg-white shadow-xl rounded-lg border border-gray-100 p-2 min-w-[170px] flex flex-col">
    <div className="px-3 py-2 border-b border-gray-50 mb-1">
      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Tài khoản</p>
      <p className="text-sm font-semibold text-purple-700 truncate">{userName}</p>
    </div>
    
    <button 
      onClick={onLogout}
      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
    >
      <FaSignOutAlt className="text-red-400" /> Đăng xuất
    </button>
  </div>
);

export default UserDropdown;