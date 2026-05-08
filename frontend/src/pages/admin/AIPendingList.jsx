// frontend/src/pages/admin/AIPendingList.jsx

import { useState, useEffect, memo } from 'react';
import {
  FaBolt,
  FaRegCopy,
  FaUpload,
  FaCheck,
  FaPlus,
  FaSpinner,
  FaLink,
  FaImage
} from 'react-icons/fa';

// ======================
// COMPONENT PHỤ
// ======================
const AIInput = memo(({ label, value, type = "text", placeholder = "", onChange }) => (
  <div className="mb-4">
    <label className="block text-xs font-medium text-gray-600 mb-1.5">
      {label}
    </label>
    <div className="relative">
      {type === "textarea" ? (
        <textarea
          className="w-full bg-[#fcfaff] border border-purple-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-purple-400 min-h-[100px]"
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          className="w-full bg-[#fcfaff] border border-purple-100 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-purple-400"
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
      <span className="absolute right-3 top-3 bg-purple-100 text-purple-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider pointer-events-none">
        AI
      </span>
    </div>
  </div>
));

// ======================
// MAIN COMPONENT
// ======================
const AIPendingList = () => {

  const [pendingRooms, setPendingRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // State dữ liệu đang chỉnh sửa
  const [editedRoom, setEditedRoom] = useState(null);

  // ======================
  // FETCH DATA
  // ======================
  useEffect(() => {
    const fetchPendingRooms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/pending-rooms');
        const data = await response.json();

        if (data.success) {
          setPendingRooms(data.data);
          // Gán luôn phòng đầu tiên
          if (data.data.length > 0) {
            setEditedRoom(data.data[0]);
          } else {
            setEditedRoom(null);
          }
        }
      } catch (error) {
        console.error("Lỗi kết nối Backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRooms();
  }, []);

  // ======================
  // XỬ LÝ THAY ĐỔI FORM
  // ======================
  const handleChange = (field, value) => {
    setEditedRoom(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ======================
  // XỬ LÝ LINK ẢNH
  // ======================
  const handleImageLinksChange = (e) => {
    const linksArray = e.target.value
      .split('\n')
      .filter(link => link.trim() !== '');

    setEditedRoom(prev => ({
      ...prev,
      images: linksArray
    }));
  };

  // ======================
  // APPROVE ROOM (DUYỆT TIN)
  // ======================
  const handleApprove = async (id) => {
    if (!editedRoom.phone || editedRoom.phone.trim() === '') {
      return alert("⚠️ Lỗi: Bắt buộc phải nhập ít nhất 1 Số điện thoại liên hệ!");
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/approve-room/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedRoom)
      });
      const data = await response.json();

      if (data.success) {
        const updatedRooms = pendingRooms.filter(room => room._id !== id);
        setPendingRooms(updatedRooms);

        if (updatedRooms.length > 0) {
          setEditedRoom(updatedRooms[0]);
        } else {
          setEditedRoom(null);
        }
        alert("✅ Duyệt tin thành công! Phòng trọ đã xuất hiện trên Trang chủ.");
      } else {
        alert("Thất bại: " + data.error);
      }
    } catch (error) {
      alert("Lỗi mạng khi duyệt tin: " + error.message);
    }
  };

  // ======================
  // REJECT ROOM (XÓA TIN)
  // ======================
  const handleReject = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bỏ tin này vĩnh viễn không?")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/reject-room/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        const updatedRooms = pendingRooms.filter(room => room._id !== id);
        setPendingRooms(updatedRooms);

        // Chuyển sang phòng tiếp theo sau khi xóa
        if (updatedRooms.length > 0) {
          setEditedRoom(updatedRooms[0]);
        } else {
          setEditedRoom(null);
        }
      } else {
        alert("Lỗi khi xóa: " + data.error);
      }
    } catch (error) {
      alert("Lỗi mạng khi xóa tin: " + error.message);
    }
  };

  // ======================
  // LOADING
  // ======================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] bg-gray-50">
        <FaSpinner className="animate-spin text-purple-600 text-4xl" />
      </div>
    );
  }

  // ======================
  // EMPTY STATE
  // ======================
  if (pendingRooms.length === 0 || !editedRoom) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-[80vh] flex flex-col justify-center items-center">
        <div className="w-24 h-24 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <FaCheck size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Tuyệt vời! Đã duyệt hết tin.
        </h2>
        <p className="text-gray-500 text-center">
          Hệ thống Auto-Pilot đang ngủ hoặc bạn có thể cào thủ công.
        </p>
      </div>
    );
  }

  // ======================
  // MAIN UI
  // ======================
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <span className="bg-yellow-100 text-yellow-800 font-bold px-4 py-2 rounded-lg shadow-sm">
          Đang chờ duyệt: {pendingRooms.length} tin
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* =======================================
            LEFT SIDE
        ======================================= */}
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Dữ liệu thô Crawler lấy được
            </h2>
            <button className="text-gray-400 hover:text-gray-600">
              <FaRegCopy />
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex-1">
            {/* BOT INFO */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold shrink-0">
                  Bot
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900">
                    TroSmart Crawler
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <FaLink className="text-gray-400" />
                    <a
                      href={editedRoom.source}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-purple-600 hover:underline truncate max-w-[250px] sm:max-w-[350px] block"
                    >
                      {editedRoom.source || 'Không rõ nguồn'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 max-h-64 overflow-y-auto">
              {editedRoom.description}
            </div>

            {/* IMAGE PREVIEW */}
            <div className="mb-2">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <FaImage className="text-gray-400" />
                Xem trước Hình ảnh ({editedRoom.images?.length || 0})
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {editedRoom.images && editedRoom.images.length > 0 ? (
                  editedRoom.images.slice(0, 4).map((img, idx) => (
                    <div
                      key={idx}
                      className={`
                        rounded-xl overflow-hidden border border-gray-100 bg-gray-100
                        ${idx === 0 && editedRoom.images.length % 2 !== 0 ? 'col-span-2 h-48' : 'h-32'}
                        ${editedRoom.images.length === 1 ? 'col-span-2 h-64' : ''}
                      `}
                    >
                      <img
                        src={img}
                        alt={`Preview ${idx}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 h-64 rounded-xl overflow-hidden border border-gray-100 relative group">
                    <img
                      src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop"
                      alt="Mặc định"
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm px-4 py-2 bg-black/50 rounded-full backdrop-blur-sm">
                        Chưa có ảnh (Sử dụng ảnh mặc định)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =======================================
            RIGHT SIDE
        ======================================= */}
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-2xl font-bold text-purple-700">
                Kết quả AI (Chế độ chỉnh sửa)
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Mã tin: {editedRoom._id} • Bạn có thể tự do sửa đổi
              </p>
            </div>
            <div className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 mb-1">
              <FaBolt />
              Bóc tách thành công
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-x-4">
              <AIInput
                label="Tiêu đề tin đăng"
                value={editedRoom.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
              <AIInput
                label="Số điện thoại (*Bắt buộc)"
                value={editedRoom.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
              <AIInput
                label="Giá thuê (VNĐ/tháng)"
                value={editedRoom.price}
                onChange={(e) => handleChange('price', e.target.value)}
              />
              <AIInput
                label="Diện tích (m²)"
                value={editedRoom.area}
                onChange={(e) => handleChange('area', e.target.value)}
              />
              <div className="col-span-2">
                <AIInput
                  label="Địa chỉ"
                  value={editedRoom.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <AIInput
                  label="Liên kết Hình ảnh (Mỗi link 1 dòng)"
                  type="textarea"
                  placeholder="Dán link ảnh vào đây (https://...)"
                  value={editedRoom.images?.join('\n') || ''}
                  onChange={handleImageLinksChange}
                />
              </div>
            </div>

            {/* AMENITIES */}
            <div className="mb-6 mt-2">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Tiện ích (AI đề xuất)
              </label>
              <div className="flex flex-wrap gap-2">
                {editedRoom.amenities?.map((item, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  >
                    <FaCheck className="text-green-500" size={10} />
                    {item}
                  </span>
                ))}
                <button className="border border-dashed border-gray-300 text-gray-500 text-xs px-3 py-1.5 rounded-full hover:border-purple-400 hover:text-purple-600 flex items-center gap-1.5 transition-colors">
                  <FaPlus size={10} />
                  Thêm
                </button>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end gap-3">
              {/* Nút Xóa */}
              <button
                onClick={() => handleReject(editedRoom._id)}
                className="px-6 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                Từ chối & Xóa bỏ
              </button>

              {/* Nút Phê duyệt */}
              <button
                onClick={() => handleApprove(editedRoom._id)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 flex items-center gap-2 transition-colors shadow-sm shadow-purple-200"
              >
                <FaUpload />
                Phê duyệt & Đẩy lên Web
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPendingList;