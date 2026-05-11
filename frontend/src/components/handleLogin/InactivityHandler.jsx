// Component này chỉ để kích hoạt Hook vì nó cần nằm trong Router
import useInactivityTimeout from './useInactivityTimeout';
const InactivityHandler = () => {
    const token = localStorage.getItem('token');

    // Chỉ kích hoạt bộ đếm nếu người dùng đã đăng nhập
    if (token) {
        useInactivityTimeout(30); 
    }

    return null; 
};
export default InactivityHandler;
