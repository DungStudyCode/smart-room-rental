//frontend/src/components/RoomCard.jsx

import { FaMapMarkerAlt, FaRulerCombined, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Khu vực Hình ảnh */}
      <div className="relative h-48 overflow-hidden">
        <Link to={`/phong-tro/${room._id}`}>
          <img 
            src={room.image} 
            alt={room.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {/* Nút lưu phòng */}
        <button 
          onClick={() => setIsSaved(!isSaved)}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-purple-600 hover:bg-white transition-colors"
        >
          {isSaved ? <FaHeart size={18} className="text-red-500" /> : <FaRegHeart size={18} />}
        </button>
        {/* Badge Nổi bật (Nếu là tin VIP) */}
        {room.isVip && (
          <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            Nổi bật
          </span>
        )}
      </div>

      {/* Khu vực Nội dung */}
      <div className="p-4">
        <Link to={`/phong-tro/${room.id}`}>
          <h3 className="font-bold text-gray-800 text-lg mb-1 truncate hover:text-purple-600 transition-colors">
            {room.title}
          </h3>
        </Link>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <FaMapMarkerAlt className="mr-1 text-purple-400" />
          <span className="truncate">{room.address}</span>
        </div>
        
        <div className="flex justify-between items-end mt-4">
          <div className="text-purple-600 font-bold text-xl">
            {room.price} <span className="text-sm text-gray-500 font-normal">/tháng</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm bg-gray-50 px-2 py-1 rounded-md">
            <FaRulerCombined className="mr-1.5" />
            {room.area}m²
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;