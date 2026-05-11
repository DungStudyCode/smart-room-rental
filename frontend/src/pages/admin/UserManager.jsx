import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../../components/adminTable/Table';
import StatusBadge from '../../components/adminTable/StatusBadge';

const UserManager = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/users');
                setUsers(res.data);
            } catch (err) {
                console.error('Lỗi lấy dữ liệu người dùng');
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
                <p className="text-gray-500 text-sm">Xem và quản lý tất cả tài khoản trên hệ thống TroSmart.</p>
            </div>

            <Table headers={['Người dùng', 'Vai trò', 'Ngày đăng ký', 'Trạng thái']}>
                {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold border border-purple-200">
                                    {user.fullName[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{user.fullName}</p>
                                    <p className="text-xs text-gray-400">{user.email}</p>
                                </div>
                            </div>
                        </td>
                        <td className="p-5">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase">
                                {user.role === 'admin' ? user.role : user.userType}
                            </span>
                        </td>
                        <td className="p-5 text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="p-5">
                            <StatusBadge type={user.role === 'admin' ? 'ACTIVE' : 'ACTIVE'} />
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    );
};

export default UserManager;
