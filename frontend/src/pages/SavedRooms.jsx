import { useState, useEffect } from 'react';
import axios from 'axios';
import RoomCard from '../components/RoomCard';

const SavedRooms = () => {
    const [savedRooms, setSavedRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedRooms = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/rooms/saved', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success && Array.isArray(res.data.data)) {
                    setSavedRooms(res.data.data);
                } else {
                    setSavedRooms([]);
                }
            } catch (err) {
                console.error('Lỗi lấy danh sách phòng đã lưu:', err);
                setSavedRooms([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSavedRooms();
    }, []);

    const handleRemove = async (roomId) => {
        setSavedRooms(savedRooms.filter((room) => room._id !== roomId));
    };

    if (loading) return <div className="p-10 text-center">Đang tải danh sách...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Phòng đã lưu</h1>
                <p className="text-gray-500">Quản lý các danh sách phòng trọ bạn đang quan tâm.</p>
            </header>

            {savedRooms.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl">
                    <p className="text-gray-400">Bạn chưa lưu phòng nào.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {savedRooms.map((room) => (
                        <RoomCard key={room._id} room={room} onRemove={() => handleRemove(room._id)} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedRooms;
