import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const Register = () => {
    const [role, setRole] = useState('tenant');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 

    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Kiểm tra khớp mật khẩu trước khi gửi lên server
        if (password !== confirmPassword) {
            return toast.error('Mật khẩu xác nhận không khớp!');
        }

        const loadingToast = toast.loading('Đang xử lý đăng ký...');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                fullName,
                email,
                password,
                userType: role, 
            });

            if (response.status === 201) {
                toast.success('Đăng ký thành công! Vui lòng đăng nhập.', { id: loadingToast });
                navigate('/login'); 
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Lỗi đăng ký, vui lòng thử lại.';
            toast.error(message, { id: loadingToast });
        }
    };

    return (
        <div className="flex min-h-screen font-sans">
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
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        {/* Input Mật khẩu */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mật khẩu (tối thiểu 8 ký tự)"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength="8"
                                required
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-gray-400 hover:text-purple-600"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Input Xác nhận mật khẩu (Mới) */}
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Xác nhận lại mật khẩu"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3.5 text-gray-400 hover:text-purple-600"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

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