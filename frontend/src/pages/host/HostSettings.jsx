const HostSettings = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-[#f8f9fa] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cài đặt tài khoản</h1>
        <p className="text-gray-500 mt-2 text-sm">Quản lý thông tin cá nhân và bảo mật của bạn.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Hồ sơ của bạn</h2>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
              <input type="text" defaultValue={user.fullName} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              <input type="text" defaultValue={user.phone} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email đăng nhập</label>
              <input type="email" disabled defaultValue={user.email} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="button" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-colors">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostSettings;