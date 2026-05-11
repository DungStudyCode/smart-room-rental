// frontend/src/pages/RoomDetail.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FaMapMarkerAlt, FaVectorSquare, FaUserFriends, FaHome, 
  FaCheckCircle, FaPhoneAlt, FaCommentDots, FaSpinner
} from 'react-icons/fa';

// ======================
// THÊM IMPORT BẢN ĐỒ LEAFLET
// ======================
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Tạo Icon Ghim to và nổi bật cho khách hàng dễ nhìn
const troSmartMarker = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', 
  iconSize: [46, 46], // Icon to hơn bên trang Admin một chút
  iconAnchor: [23, 46],
  className: 'drop-shadow-xl' // Đổ bóng cho ghim nổi bật trên nền bản đồ
});

const RoomDetail = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
        const data = await response.json();
        if (data.success) setRoom(data.data);
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetail();
  }, [id]);

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-gray-50"><FaSpinner className="animate-spin text-purple-600 text-4xl" /></div>;
  if (!room) return <div className="min-h-screen flex justify-center items-center text-gray-500 bg-gray-50">Không tìm thấy thông tin phòng.</div>;

  const maskPhone = (phone) => {
    if (!phone || phone === 'Inbox Facebook') return phone;
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 *** ***');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* KHU VỰC ẢNH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-sm">
          <div className="md:col-span-2 h-full bg-gray-200">
            <img 
              src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000'} 
              alt={room.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000'; }}
            />
          </div>
          <div className="hidden md:flex flex-col gap-3 h-full">
            <div className="h-1/2 bg-gray-200 overflow-hidden">
               <img src={room.images?.[1] || room.images?.[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer"/>
            </div>
            <div className="h-1/2 bg-gray-200 overflow-hidden relative">
               <img src={room.images?.[2] || room.images?.[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer"/>
               {room.images?.length > 3 && (
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/60 transition">
                   <span className="text-white font-medium text-lg">+ {room.images.length - 3} ảnh</span>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* LAYOUT CHÍNH */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CỘT TRÁI: NỘI DUNG */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
            
            {/* 1. Header Thông tin */}
            <div className="border-b border-gray-100 pb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-snug">{room.title}</h1>
              <div className="flex items-start gap-2 text-gray-500 mb-6">
                <FaMapMarkerAlt className="text-gray-400 mt-1 shrink-0" />
                <span className="text-sm sm:text-base">{room.address}</span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
                  <FaVectorSquare className="text-purple-500" /> <span className="font-medium text-gray-700">{room.area}m²</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
                  <FaUserFriends className="text-purple-500" /> <span className="font-medium text-gray-700">Thỏa thuận</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
                  <FaHome className="text-purple-500" /> <span className="font-medium text-gray-700">Phòng trọ</span>
                </div>
              </div>
            </div>

            {/* 2. Mô tả */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Mô tả chi tiết</h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {room.description}
              </div>
            </div>

            {/* 3. Tiện ích */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tiện ích</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                {room.amenities && room.amenities.length > 0 ? (
                  room.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                      <FaCheckCircle className="text-purple-500 shrink-0 text-lg" />
                      <span>{amenity}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">Đang cập nhật...</div>
                )}
              </div>
            </div>

            {/* 4. VỊ TRÍ BẢN ĐỒ (Đã tích hợp react-leaflet) */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Vị trí thực tế</h2>
              <div className="w-full h-[300px] sm:h-[400px] rounded-xl overflow-hidden border border-purple-100 shadow-inner bg-gray-100 relative z-0">
                {room.location && room.location.lat && room.location.lng ? (
                  <MapContainer 
                    center={[room.location.lat, room.location.lng]} 
                    zoom={16} 
                    scrollWheelZoom={false} // Khóa cuộn chuột để tránh trôi trang
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[room.location.lat, room.location.lng]} icon={troSmartMarker} />
                  </MapContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">Đang tải bản đồ...</div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2 italic">* Vị trí ghim đã được xác nhận bởi Admin TroSmart.</p>
            </div>

          </div>

          {/* CỘT PHẢI: SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
              
              <div className="mb-6">
                <p className="text-gray-500 text-sm mb-1 font-medium">Giá thuê</p>
                <h3 className="text-3xl font-bold text-purple-700">
                  {room.price ? room.price.toLocaleString('vi-VN') : 'Thỏa thuận'}
                  {room.price > 0 && <span className="text-base font-normal text-gray-500 ml-1">đ</span>}
                </h3>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setShowPhone(true)}
                  className="w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white py-3.5 rounded-xl font-semibold transition-colors shadow-md shadow-purple-200"
                >
                  <FaPhoneAlt className="text-lg" /> 
                  <span>{showPhone ? room.phone : maskPhone(room.phone)}</span>
                </button>
                
                {room.source && room.source.includes('facebook') ? (
                  <a 
                    href={room.postUrl || room.source} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <FaCommentDots className="text-xl" /> <span>Nhắn tin Facebook</span>
                  </a>
                ) : (
                  <button className="w-full flex items-center justify-center gap-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 py-3 rounded-xl font-semibold transition-colors">
                    <FaCommentDots className="text-xl" /> <span>Nhắn tin nội bộ</span>
                  </button>
                )}
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomDetail;