import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [role, setRole] = useState('tenant');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    //  Hàm xử lý gửi dữ liệu lên Server
    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                fullName,
                email,
                password,
                userType: role, // Gửi role hiện tại người dùng đang chọn
            });

            if (response.status === 201) {
                alert('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập.');
                navigate('/login'); // Chuyển hướng sang trang đăng nhập
            }
        } catch (err) {
            if (err.response) {
                alert(err.response.data.message || 'Lỗi đăng ký, vui lòng thử lại.');
            } else {
                alert('Không thể kết nối đến server!');
            }
        }
    };

    return (
        <div className="flex min-h-screen font-sans">
            {/* Cột trái - Background */}
            <div
                className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070')",
                }}
            >
                <div className="absolute bottom-10 left-10 text-white max-w-md">
                    <h1 className="text-4xl font-bold mb-4">Tìm không gian sống lý tưởng.</h1>
                    <p className="text-lg opacity-90">
                        Hàng ngàn phòng trọ và căn hộ chất lượng cao đang chờ bạn khám phá.
                    </p>
                </div>
            </div>

            {/* Cột phải - Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold mb-2">Tạo tài khoản mới</h2>
                    <p className="text-gray-500 mb-6">Tham gia ngay để tìm hoặc đăng tin cho thuê</p>

                    <button className="w-full border py-2 rounded-full mb-3 flex items-center justify-center gap-2 hover:bg-gray-50">
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            width="20"
                            alt="google"
                        />
                        Tiếp tục với Google
                    </button>

                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="px-3 text-xs text-gray-400 uppercase">Hoặc đăng ký bằng Email</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <form className="space-y-4" onSubmit={handleRegister}>
                        <div>
                            <label className="block text-sm font-medium mb-1">Bạn là:</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('tenant')}
                                    className={`p-3 border rounded-xl flex flex-col items-center transition ${
                                        role === 'tenant'
                                            ? 'border-purple-600 bg-purple-50 text-purple-600'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <span className="text-xs font-semibold">Sinh viên / Người thuê</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('landlord')}
                                    className={`p-3 border rounded-xl flex flex-col items-center transition ${
                                        role === 'landlord'
                                            ? 'border-purple-600 bg-purple-50 text-purple-600'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <span className="text-xs font-semibold">Chủ nhà / Môi giới</span>
                                </button>
                            </div>
                        </div>

                        <input
                            type="text"
                            placeholder="Họ và tên"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-purple-500"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-purple-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu (tối thiểu 8 ký tự)"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-purple-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength="8"
                            required
                        />

                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-3 rounded-full font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-100"
                        >
                            Đăng ký
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Đã có tài khoản?
                        <Link to="/login" className="text-purple-600 font-bold ml-1 hover:underline">
                            Đăng nhập tại đây
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
