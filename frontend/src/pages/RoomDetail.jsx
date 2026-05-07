import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, FaRulerCombined, FaRegHeart, FaHeart, 
  FaCheckCircle, FaUserCircle, FaPhoneAlt, FaExclamationTriangle,
  FaShareAlt, FaChevronLeft
} from 'react-icons/fa';

const RoomDetail = () => {
  const { id } = useParams(); // Lấy ID phòng từ URL
  const [isSaved, setIsSaved] = useState(false);

  // Dữ liệu giả lập (Sau này sẽ fetch từ API dựa vào ID)
  const roomData = {
    id: id,
    title: "Phòng trọ ban công thoáng mát, full nội thất gần ĐH Duy Tân",
    price: "2.5 Triệu",
    area: 25,
    address: "123 Nguyễn Văn Linh, P. Nam Dương, Q. Hải Châu, Đà Nẵng",
    status: "Còn phòng",
    isVerified: true,
    description: `Cho thuê phòng trọ mới xây, sạch sẽ thoáng mát.
- Giờ giấc tự do, không chung chủ.
- Có sẵn máy lạnh, tủ lạnh, giường nệm, tủ quần áo.
- WC riêng biệt, có máy nước nóng.
- Khu vực an ninh, có camera 24/24, chỗ để xe rộng rãi tầng trệt.
- Điện 3.5k/ký, Nước 100k/người, Wifi 50k/phòng.
Cách ĐH Duy Tân cơ sở Nguyễn Văn Linh chỉ 5 phút đi bộ. Ưu tiên sinh viên hoặc người đi làm ngoan hiền.`,
    amenities: ['Máy lạnh', 'Tủ lạnh', 'Giường nệm', 'Chỗ để xe', 'Ban công', 'Không chung chủ'],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1de2d9d344?w=600&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80"
    ],
    host: {
      name: "Chị Lan (Chính chủ)",
      phone: "0905.123.xxx",
      avatar: null, // Sẽ dùng icon mặc định nếu ko có avatar
      joinedDate: "Tham gia từ tháng 3/2025"
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Nút Back */}
        <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium mb-6 transition-colors">
          <FaChevronLeft className="mr-1" /> Quay lại danh sách
        </Link>

        {/* Khu vực thư viện ảnh (Grid Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[300px] md:h-[400px] mb-8 rounded-2xl overflow-hidden shadow-sm">
          <div className="md:col-span-2 relative h-full">
            <img src={roomData.images[0]} alt="Phòng chính" className="w-full h-full object-cover" />
            <button className="absolute bottom-4 right-4 bg-white/90 px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-white transition-colors">
              Xem tất cả 5 ảnh
            </button>
          </div>
          <div className="hidden md:grid grid-rows-2 gap-3 h-full">
            <img src={roomData.images[1]} alt="Góc phòng" className="w-full h-full object-cover" />
            <img src={roomData.images[2]} alt="Tiện ích" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Bố cục chia 2 cột */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* CỘT TRÁI: Nội dung chi tiết (Chiếm 2/3) */}
          <div className="lg:w-2/3">
            {/* Header thông tin */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  {roomData.title}
                </h1>
                {/* Nút Lưu & Chia sẻ */}
                <div className="flex gap-2 ml-4 shrink-0">
                  <button className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors">
                    <FaShareAlt />
                  </button>
                  <button 
                    onClick={() => setIsSaved(!isSaved)}
                    className={`p-2.5 rounded-full transition-colors ${isSaved ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                  >
                    {isSaved ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                  </button>
                </div>
              </div>

              {/* Badges & Địa chỉ */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 mt-4">
                <span className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
                  <FaCheckCircle className="mr-1.5" /> Còn phòng
                </span>
                {roomData.isVerified && (
                  <span className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
                    <FaCheckCircle className="mr-1.5" /> Đã xác thực
                  </span>
                )}
                <span className="flex items-center">
                  <FaRulerCombined className="mr-1.5 text-gray-400" /> {roomData.area} m²
                </span>
                <span className="flex items-center">
                  <FaMapMarkerAlt className="mr-1.5 text-gray-400" /> {roomData.address}
                </span>
              </div>
            </div>

            {/* Khối Mô tả */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Mô tả chi tiết</h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {roomData.description}
              </div>
            </div>

            {/* Khối Tiện ích */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tiện ích đi kèm</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                {roomData.amenities.map((item, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-purple-400 mr-3"></span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Khung Liên hệ cố định (Chiếm 1/3) */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 sticky top-24">
              {/* Mức giá */}
              <div className="mb-6">
                <span className="text-gray-500 text-sm font-medium">Giá cho thuê</span>
                <div className="text-3xl font-bold text-purple-600 mt-1">
                  {roomData.price} <span className="text-base text-gray-500 font-normal">/tháng</span>
                </div>
              </div>

              {/* Thông tin Chủ nhà */}
              <div className="flex items-center gap-4 py-4 border-t border-b border-gray-100 mb-6">
                {roomData.host.avatar ? (
                  <img src={roomData.host.avatar} alt="Avatar" className="w-14 h-14 rounded-full" />
                ) : (
                  <FaUserCircle className="w-14 h-14 text-gray-300" />
                )}
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{roomData.host.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{roomData.host.joinedDate}</p>
                </div>
              </div>

              {/* Nút Gọi & Chat */}
              <div className="flex flex-col gap-3">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center transition-colors">
                  <FaPhoneAlt className="mr-2" /> Hiển thị số điện thoại
                </button>
                <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold py-3.5 rounded-xl border border-purple-200 transition-colors">
                  Nhắn tin trực tiếp
                </button>
              </div>

              {/* Báo cáo vi phạm (PB10) */}
              <div className="mt-6 text-center">
                <button className="inline-flex items-center text-sm text-gray-400 hover:text-red-500 transition-colors">
                  <FaExclamationTriangle className="mr-1.5" /> Báo cáo tin đăng không hợp lệ
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomDetail;