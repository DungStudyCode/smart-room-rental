import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });

            // 1. Lấy dữ liệu từ response.data
            const { token, user } = response.data;

            // 2. Lưu vào localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            alert('Đăng nhập thành công!');
            console.log('Dữ liệu User:', user);

            // 3. Logic điều hướng dựa trên Role (Quyền)
            if (user.role === 'admin') {
                navigate('/admin'); // Vào thẳng trang quản trị
            } else {
                navigate('/'); // Khách hoặc Chủ nhà về trang chủ
            }
        } catch (err) {
            if (err.response) {
                alert(err.response.data.message || 'Email hoặc mật khẩu sai');
            } else {
                alert('Không thể kết nối đến server!');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-purple-600 mb-1">TroSmart</h1>
                <h2 className="text-xl font-bold mb-1">Đăng nhập hệ thống</h2>
                <p className="text-gray-500 mb-8">Chào mừng bạn quay trở lại!</p>

                <form className="space-y-4 text-left" onSubmit={handleLogin}>
                    <div>
                        <label className="text-sm font-semibold">Email</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            className="w-full p-3 border border-gray-100 bg-purple-50/30 rounded-xl focus:outline-purple-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold">Mật khẩu</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-3 border border-gray-100 bg-purple-50/30 rounded-xl focus:outline-purple-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                            <input type="checkbox" className="rounded" /> Ghi nhớ đăng nhập
                        </label>
                        <a href="#" className="text-purple-600 font-semibold hover:underline">
                            Quên mật khẩu?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-3 rounded-full font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 transition"
                    >
                        Đăng nhập
                    </button>
                </form>

                <div className="my-6 text-gray-400 text-xs uppercase">Hoặc đăng nhập với</div>

                <div className="space-y-3">
                    <button className="w-full border py-2 rounded-full flex items-center justify-center gap-2 text-sm hover:bg-gray-50 transition font-medium">
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            width="18"
                            alt="google"
                        />
                        Tiếp tục với Google
                    </button>
                </div>

                <p className="mt-8 text-sm text-gray-500">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="text-purple-600 font-bold ml-1 hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>

            <footer className="mt-8 text-center text-xs text-gray-400">
                <p className="font-bold text-purple-600 mb-1">TroSmart</p>
                <p>© 2025 TroSmart. Nền tảng thuê phòng hiện đại.</p>
            </footer>
        </div>
    );
};

export default Login;
