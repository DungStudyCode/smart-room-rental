import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaCamera, FaEye, FaEyeSlash } from 'react-icons/fa';

const ProfilePage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    
    // State quản lý ẩn hiện cho 3 ô mật khẩu
    const [showCurrPass, setShowCurrPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    setFormData((prev) => ({
                        ...prev,
                        fullName: res.data.data.fullName,
                        phone: res.data.data.phone || '',
                    }));
                }
            } catch (err) {
                toast.error('Không thể tải thông tin người dùng');
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            return toast.error('Mật khẩu mới không khớp!');
        }

        setLoading(true);
        const loadToast = toast.loading('Đang cập nhật...');
        
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('http://localhost:5000/api/auth/profile', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                toast.success('Cập nhật thành công!', { id: loadToast });
                localStorage.setItem('user', JSON.stringify(res.data.data));

                setFormData((prev) => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                }));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Cập nhật thất bại', { id: loadToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-3xl shadow-sm mt-10 border border-gray-100">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Hồ sơ cá nhân</h1>
                <p className="text-gray-500 text-sm">Quản lý thông tin và bảo mật tài khoản</p>
            </div>

            <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center border-2 border-purple-100 overflow-hidden">
                        <span className="text-purple-300 text-xs text-center p-2">Ảnh đại diện người dùng</span>
                    </div>
                    <button type="button" className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full text-white shadow-lg hover:bg-purple-700 transition-all">
                        <FaCamera size={14} />
                    </button>
                </div>
                <button type="button" className="text-purple-600 text-xs font-semibold mt-3 hover:underline">
                    Thay đổi ảnh đại diện
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Họ và tên</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Số điện thoại</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 outline-none transition-all"
                            />
                            <button type="button" className="absolute right-4 top-3 text-purple-600 text-xs font-bold">
                                Xác minh
                            </button>
                        </div>
                    </div>
                </div>

                <hr className="my-8 border-gray-100" />
                <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase">Đổi mật khẩu</h3>

                <div className="space-y-4">
                    {/* Mật khẩu hiện tại */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Mật khẩu hiện tại</label>
                        <input
                            type={showCurrPass ? "text" : "password"}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 outline-none transition-all"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowCurrPass(!showCurrPass)}
                            className="absolute right-4 top-10 text-gray-400 hover:text-purple-600"
                        >
                            {showCurrPass ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Mật khẩu mới */}
                        <div className="relative">
                            <input
                                type={showNewPass ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                placeholder="Mật khẩu mới"
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 outline-none transition-all"
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowNewPass(!showNewPass)}
                                className="absolute right-4 top-3.5 text-gray-400 hover:text-purple-600"
                            >
                                {showNewPass ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Xác nhận mật khẩu */}
                        <div className="relative">
                            <input
                                type={showConfirmPass ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                placeholder="Xác nhận mật khẩu"
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 outline-none transition-all"
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                className="absolute right-4 top-3.5 text-gray-400 hover:text-purple-600"
                            >
                                {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-10">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-purple-600 text-white px-10 py-3 rounded-full font-bold hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all disabled:bg-gray-400"
                    >
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfilePage;