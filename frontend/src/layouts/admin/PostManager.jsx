import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../../components/adminTable/Table';
import RoomRow from '../../components/adminTable/RoomRow';

const PostManager = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('PENDING'); // Dựa trên Enum trong Model

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/api/admin/rooms?status=${activeTab}`);
            setRooms(res.data);
        } catch (err) {
            console.error('Lỗi fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [activeTab]);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/rooms/${id}`, { status: newStatus });
            fetchRooms(); // Refresh lại danh sách
        } catch (err) {
            alert('Lỗi cập nhật trạng thái!');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý bài đăng</h1>

                {/* Tabs chuyển đổi theo Enum */}
                <div className="flex bg-gray-200/50 p-1 rounded-xl">
                    {['PENDING', 'AVAILABLE', 'HIDDEN', 'RENTED'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                activeTab === tab
                                    ? 'bg-white text-purple-700 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab === 'PENDING'
                                ? 'Chờ duyệt'
                                : tab === 'AVAILABLE'
                                ? 'Đã duyệt'
                                : tab === 'HIDDEN'
                                ? 'Đã ẩn'
                                : 'Đã thuê'}
                        </button>
                    ))}
                </div>
            </div>

            <Table headers={['Thông tin phòng', 'Địa chỉ & Liên hệ', 'Nguồn', 'Trạng thái', 'Thao tác']}>
                {loading ? (
                    <tr>
                        <td colSpan="5" className="text-center p-10 text-gray-400">
                            Đang tải...
                        </td>
                    </tr>
                ) : rooms.length > 0 ? (
                    rooms.map((room) => (
                        <RoomRow
                            key={room._id}
                            room={room}
                            onApprove={(id) => handleUpdateStatus(id, 'AVAILABLE')}
                            onReject={(id) => handleUpdateStatus(id, 'HIDDEN')}
                        />
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center p-10 text-gray-400">
                            Không có bài đăng nào
                        </td>
                    </tr>
                )}
            </Table>
        </div>
    );
};

export default PostManager;
