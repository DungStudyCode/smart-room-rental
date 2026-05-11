import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useInactivityTimeout = (timeoutInMinutes = 30) => {
    const navigate = useNavigate();
    const timerRef = useRef(null);

    const logout = () => {
        // Xóa thông tin đăng nhập
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        alert('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login');
    };

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        
        // Thiết lập bộ đếm mới
        timerRef.current = setTimeout(logout, timeoutInMinutes * 60 * 1000);
    };

    useEffect(() => {
        // Danh sách các sự kiện được coi là "đang tương tác"
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

        // Khởi tạo bộ đếm lần đầu
        resetTimer();

        // Gán sự kiện cho window
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Dọn dẹp khi component unmount
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, []);

    return null;
};

export default useInactivityTimeout;