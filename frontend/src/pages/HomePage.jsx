// frontend/src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // BƯỚC 1: IMPORT THÊM LINK
import { 
  FaMapMarkerAlt, FaSearch, FaBed, FaBuilding, 
  FaHome, FaSpinner, FaRegHeart, FaVectorSquare 
} from 'react-icons/fa';

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/rooms');
        const data = await response.json();
        if (data.success) setRooms(data.data.slice(0, 8));
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="bg-white w-full pb-24">
      
      {/* ==========================================
          KHU VỰC HERO BẮT MẮT
      ========================================== */}
      <div className="relative w-full h-[500px] flex flex-col items-center justify-center pt-10">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80')",
            opacity: 0.15 
          }}
        ></div>

        <div className="relative z-10 w-full max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight">
            Tìm tổ ấm lý tưởng của bạn
          </h1>

          <div className="bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center mb-6">
            <FaMapMarkerAlt className="text-gray-400 ml-4 text-xl shrink-0" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo đường, phường, hoặc trường ĐH..." 
              className="flex-1 bg-transparent px-4 py-3 text-gray-700 focus:outline-none w-full"
            />
            <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full transition-colors shrink-0">
              <FaSearch size={18} />
            </button>
          </div>

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
      
      {/* ==========================================
          KHU VỰC DANH SÁCH PHÒNG TRỌ 
      ========================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Phòng trọ mới nhất</h3>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-purple-600 text-4xl" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-2xl border border-gray-100">
            Hiện tại chưa có phòng trọ nào. Hãy dùng Bot Crawler để duyệt thêm nhé!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {rooms.map((room) => (
              // BƯỚC 2: THAY THẺ DIV BẰNG THẺ LINK, TRỎ ĐẾN TRANG CHI TIẾT
              <Link 
                to={`/phong-tro/${room._id}`} 
                key={room._id} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group relative flex flex-col block"
              >
                
                <button 
                  onClick={(e) => e.preventDefault()} // Ngăn việc click nút tim bị nhảy trang
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FaRegHeart />
                </button>

                <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                  <img 
                    src={room.images && room.images.length > 0 ? room.images[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop'} 
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => { 
                      e.target.onerror = null; 
                      e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop'; 
                    }} 
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-1 rounded-md">
                    {room.images?.length || 0} ảnh
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2.5">
                    <h3 className="text-lg font-bold text-purple-700">
                      {room.price ? room.price.toLocaleString('vi-VN') : 'Thỏa thuận'} 
                      {room.price > 0 && <span className="text-xs font-normal text-gray-500 ml-1">đ/tháng</span>}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-[11px] font-medium bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                      <FaVectorSquare className="text-[10px]" /> {room.area}m²
                    </div>
                  </div>

                  <h2 className="text-gray-800 font-semibold text-sm mb-2 line-clamp-2 hover:text-purple-600 transition-colors" title={room.title}>
                    {room.title}
                  </h2>

                  <div className="flex items-start gap-1.5 text-gray-500 text-xs mb-4">
                    <FaMapMarkerAlt className="text-gray-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2" title={room.address}>{room.address}</span>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-1.5 pt-3 border-t border-gray-50">
                    {room.amenities && room.amenities.slice(0, 2).map((amenity, idx) => (
                      <span key={idx} className="bg-purple-50 text-purple-700 text-[10px] font-medium px-2 py-1 rounded">
                        {amenity}
                      </span>
                    ))}
                    {room.amenities?.length > 2 && (
                      <span className="bg-gray-50 text-gray-600 text-[10px] font-medium px-2 py-1 rounded">
                        +{room.amenities.length - 2}
                      </span>
                    )}
                  </div>
                </div>

              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;