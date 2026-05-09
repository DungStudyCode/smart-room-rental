import React from 'react';
import StatusBadge from './StatusBadge';

const RoomRow = ({ room, onApprove, onReject }) => {
    return (
        <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
            <td className="p-4">
                <div className="flex gap-4 items-start">
                    {/* Ảnh lấy từ mảng images[0] */}
                    <img
                        src={room.images?.[0]}
                        className="w-20 h-16 rounded-lg object-cover bg-gray-100 border"
                        alt="room"
                    />
                    <div className="max-w-[250px]">
                        <p className="font-bold text-gray-800 line-clamp-1 text-sm">{room.title}</p>
                        <p className="text-purple-600 font-extrabold text-sm">
                            {room.price?.toLocaleString()} VNĐ/tháng
                        </p>
                        <div className="flex gap-2 mt-1">
                            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-medium">
                                {room.area} m²
                            </span>
                            {room.isVip && (
                                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">
                                    VIP
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </td>

            <td className="p-4">
                <p className="text-xs text-gray-600 line-clamp-2 mb-1">📍 {room.address}</p>
                <p className="text-sm font-semibold text-gray-700">📞 {room.phone}</p>
            </td>

            <td className="p-4">
                {room.source ? (
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Crawler</span>
                        <a
                            href={room.postUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-gray-400 underline truncate max-w-[100px]"
                        >
                            {room.source}
                        </a>
                    </div>
                ) : (
                    <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Hệ thống</span>
                )}
            </td>

            <td className="p-4 text-center">
                <StatusBadge type={room.status} />
            </td>

            <td className="p-4">
                <div className="flex gap-2 justify-center">
                    {room.status === 'PENDING' && (
                        <>
                            <button
                                onClick={() => onApprove(room._id)}
                                className="bg-green-500 hover:bg-green-600 text-white text-[11px] font-bold px-3 py-1.5 rounded shadow-sm transition-all"
                            >
                                Duyệt
                            </button>
                            <button
                                onClick={() => onReject(room._id)}
                                className="bg-white border border-red-200 text-red-500 hover:bg-red-50 text-[11px] font-bold px-3 py-1.5 rounded transition-all"
                            >
                                Từ chối
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default RoomRow;
