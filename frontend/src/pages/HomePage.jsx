// frontend/src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaSearch, FaBed, FaBuilding, FaHome, FaSpinner } from 'react-icons/fa';
import RoomCard from '../components/RoomCard';

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/rooms');
        const data = await response.json();
        if (data.success) setRooms(data.data);
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      
      {/* KHU VỰC HERO BẮT MẮT (Dựa theo ảnh thiết kế) */}
      <div className="relative w-full h-[500px] flex flex-col items-center justify-center pt-10">
        {/* Hình nền được làm mờ nhẹ để chữ nổi bật */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80')",
            opacity: 0.15 // Chỉnh độ mờ để giống ảnh mẫu
          }}
        ></div>

        <div className="relative z-10 w-full max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight">
            Tìm tổ ấm lý tưởng của bạn
          </h1>

          {/* Thanh Search Bar */}
          <div className="bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center mb-6">
            <FaMapMarkerAlt className="text-gray-400 ml-4 text-xl shrink-0" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo đường, phường, hoặc trường ĐH (VD: Đại học Duy Tân)." 
              className="flex-1 bg-transparent px-4 py-3 text-gray-700 focus:outline-none w-full"
            />
            <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full transition-colors shrink-0">
              <FaSearch size={18} />
            </button>
          </div>

          {/* Các nút Filter Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 px-6 py-2.5 rounded-full font-medium hover:text-purple-600 hover:border-purple-300 transition-all shadow-sm">
              <FaBed className="text-purple-500" /> Phòng trọ
            </button>
            <button className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 px-6 py-2.5 rounded-full font-medium hover:text-purple-600 hover:border-purple-300 transition-all shadow-sm">
              <FaBuilding className="text-purple-500" /> Căn hộ
            </button>
            <button className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 px-6 py-2.5 rounded-full font-medium hover:text-purple-600 hover:border-purple-300 transition-all shadow-sm">
              <FaHome className="text-purple-500" /> Nhà nguyên căn
            </button>
          </div>
        </div>
      </div>
      
      {/* KHU VỰC DANH SÁCH PHÒNG TRỌ (Dữ liệu thật) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Phòng trọ mới nhất</h3>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-purple-600 text-4xl" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-2xl border border-gray-100">
            Hiện tại chưa có phòng trọ nào. Hãy dùng Bot Crawler để cào thêm nhé!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} /> 
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;