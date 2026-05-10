import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaVectorSquare } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const RoomCard = ({ room, onRemove }) => {
    const [isSaved, setIsSaved] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        setIsSaved(user?.savedRooms?.includes(room._id) || false);
    }, [room._id]);

    const handleToggleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('Vui lòng đăng nhập!');

            setTimeout(() => {
                navigate('/login');
            }, 1000);

            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:5000/api/rooms/save/${room._id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.success) {
                const newStatus = response.data.isSaved;

                setIsSaved(newStatus);

                const currentUser = JSON.parse(localStorage.getItem('user'));

                const updatedUser = {
                    ...currentUser,
                };

                if (newStatus) {
                    updatedUser.savedRooms = [
                        ...(updatedUser.savedRooms || []),
                        room._id,
                    ];

                    toast.success('Đã lưu phòng');
                } else {
                    updatedUser.savedRooms =
                        updatedUser.savedRooms.filter(
                            (id) => id !== room._id,
                        );

                    toast.success('Đã bỏ lưu');

                    if (onRemove) {
                        onRemove(room._id);
                    }
                }

                localStorage.setItem(
                    'user',
                    JSON.stringify(updatedUser),
                );
            }
        } catch (error) {
            console.error(error);

            if (error.response?.status === 401) {
                toast.error('Phiên đăng nhập hết hạn');

                navigate('/login');
            } else {
                toast.error('Lỗi máy chủ');
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group relative flex flex-col">
            {/* SAVE BUTTON */}
            <Tippy content={isSaved ? 'Hủy lưu' : 'Lưu phòng'}>
                <button
                    onClick={handleToggleSave}
                    className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all
                    ${
                        isSaved
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/80 text-gray-500 hover:text-red-500'
                    }`}
                >
                    {isSaved ? <FaHeart /> : <FaRegHeart />}
                </button>
            </Tippy>

            {/* IMAGE */}
            <Link to={`/phong-tro/${room._id}`}>
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                    <img
                        src={
                            room.images?.[0] ||
                            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop'
                        }
                        alt={room.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-medium px-2 py-1 rounded-md">
                        {room.images?.length || 0} ảnh
                    </div>
                </div>
            </Link>

            {/* CONTENT */}
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2.5">
                    <h3 className="text-lg font-bold text-purple-700">
                        {room.price
                            ? room.price.toLocaleString('vi-VN')
                            : 'Thỏa thuận'}

                        {room.price > 0 && (
                            <span className="text-xs font-normal text-gray-500 ml-1">
                                đ/tháng
                            </span>
                        )}
                    </h3>

                    <div className="flex items-center gap-1 text-gray-500 text-[11px] font-medium bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        <FaVectorSquare className="text-[10px]" />
                        {room.area}m²
                    </div>
                </div>

                <h2 className="text-gray-800 font-semibold text-sm mb-2 line-clamp-2 hover:text-purple-600 transition-colors">
                    {room.title}
                </h2>

                <div className="flex items-start gap-1.5 text-gray-500 text-xs mb-4">
                    <FaMapMarkerAlt className="text-gray-400 shrink-0 mt-0.5" />

                    <span className="line-clamp-2">
                        {room.address}
                    </span>
                </div>

                <div className="mt-auto flex flex-wrap gap-1.5 pt-3 border-t border-gray-50">
                    {room.amenities?.slice(0, 2).map((amenity, idx) => (
                        <span
                            key={idx}
                            className="bg-purple-50 text-purple-700 text-[10px] font-medium px-2 py-1 rounded"
                        >
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
        </div>
    );
};

export default RoomCard;