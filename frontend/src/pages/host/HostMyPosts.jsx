import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEdit, FaTrashAlt, FaSpinner } from 'react-icons/fa';

const HostMyPosts = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tương lai: Gọi API GET /api/host/rooms (Kèm token để lấy đúng phòng của User)
    // Tạm thời giả lập fetch delay để test UI loading
    setTimeout(() => {
      setRooms([]); // Data rỗng
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 bg-[#f8f9fa] min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý tin đăng</h1>
          <p className="text-gray-500 mt-2 text-sm">Quản lý các bất động sản của bạn trong thời gian thực.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm phòng..." 
              className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>
          <Link to="/host/dang-tin" className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap">
            <FaPlus /> Tạo tin mới
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 font-semibold uppercase tracking-wider">
                <th className="p-4 pl-6">Tin đăng</th>
                <th className="p-4">Giá (VNĐ)</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center"><FaSpinner className="animate-spin text-purple-600 mx-auto text-2xl" /></td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <img src="https://cdn-icons-png.flaticon.com/512/7486/7486831.png" alt="Empty" className="w-24 h-24 mx-auto mb-4 opacity-50 grayscale" />
                    <p className="text-gray-500 mb-4">Bạn chưa đăng tin phòng trọ nào.</p>
                    <Link to="/host/dang-tin" className="text-purple-600 font-semibold hover:underline">Đăng tin ngay</Link>
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                        <img src={room.images?.[0]} alt="room" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{room.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{room.address}</p>
                      </div>
                    </td>
                    <td className="p-4 text-purple-700 font-bold text-sm">
                      {room.price?.toLocaleString()}đ
                    </td>
                    <td className="p-4">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Chờ duyệt</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button className="text-gray-400 hover:text-purple-600 transition-colors"><FaEdit size={16} /></button>
                        <button className="text-gray-400 hover:text-red-500 transition-colors"><FaTrashAlt size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HostMyPosts;