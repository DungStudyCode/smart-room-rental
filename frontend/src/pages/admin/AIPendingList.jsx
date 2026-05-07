// frontend/src/pages/admin/AIPendingList.jsx

import { useState, useEffect, memo } from 'react';

import {
  FaBolt,
  FaRegCopy,
  FaEdit,
  FaUpload,
  FaCheck,
  FaPlus,
  FaSpinner
} from 'react-icons/fa';


// ======================
// COMPONENT PHỤ
// ======================

const AIInput = memo(({
  label,
  value,
  type = "text",
  placeholder = ""
}) => (
  <div className="mb-4">
    <label className="block text-xs font-medium text-gray-600 mb-1.5">
      {label}
    </label>

    <div className="relative">

      {type === "textarea" ? (
        <textarea
          className="w-full bg-[#fcfaff] border border-purple-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-purple-400 min-h-[100px]"
          defaultValue={value}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          className="w-full bg-[#fcfaff] border border-purple-100 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-purple-400"
          defaultValue={value}
          placeholder={placeholder}
        />
      )}

      <span className="absolute right-3 top-3 bg-purple-100 text-purple-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
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


  // ======================
  // FETCH DATA
  // ======================

  useEffect(() => {

    const fetchPendingRooms = async () => {

      try {

        const response = await fetch(
          'http://localhost:5000/api/admin/pending-rooms'
        );

        const data = await response.json();

        if (data.success) {
          setPendingRooms(data.data);
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
  // APPROVE ROOM
  // ======================

  const handleApprove = async (id) => {

    try {

      const response = await fetch(
        `http://localhost:5000/api/admin/approve-room/${id}`,
        {
          method: 'PUT'
        }
      );

      const data = await response.json();

      if (data.success) {

        // Remove khỏi danh sách chờ
        setPendingRooms(prev =>
          prev.filter(room => room._id !== id)
        );

        alert(
          "✅ Duyệt tin thành công! Phòng trọ đã xuất hiện trên Trang chủ."
        );
      }

    } catch (error) {

      alert("Lỗi khi duyệt tin: " + error.message);

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

  if (pendingRooms.length === 0) {

    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-[80vh] flex flex-col justify-center items-center">

        <div className="w-24 h-24 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center mb-6 shadow-sm">

          <FaCheck size={40} />

        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Tuyệt vời! Đã duyệt hết tin.
        </h2>

        <p className="text-gray-500 text-center">
          Hiện tại không có dữ liệu nào chờ AI xử lý.
          Hãy sang mục "Quản lý Crawler" để cào thêm nhé!
        </p>

      </div>
    );

  }


  // ======================
  // CURRENT ROOM
  // ======================

  const currentRoom = pendingRooms[0];


  // ======================
  // MAIN UI
  // ======================

  return (

    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <span className="bg-yellow-100 text-yellow-800 font-bold px-4 py-2 rounded-lg shadow-sm">

          Đang chờ duyệt: {pendingRooms.length} tin

        </span>

      </div>


      {/* Grid Layout */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        {/* =======================================
            LEFT SIDE - RAW DATA
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

            {/* Bot Header */}

            <div className="flex items-center justify-between mb-6">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">

                  Bot

                </div>

                <div>

                  <div className="font-bold text-sm text-gray-900">
                    TroSmart Crawler
                  </div>

                  <div className="text-xs text-gray-500">
                    Nguồn: Tự động trích xuất
                  </div>

                </div>

              </div>

            </div>


            {/* Description */}

            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">

              {currentRoom.description}

            </div>


            {/* Image */}

            <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-100">

              <img
                src={currentRoom.images?.[0]}
                alt="Room"
                className="w-full h-full object-cover"
              />

            </div>

          </div>

        </div>



        {/* =======================================
            RIGHT SIDE - AI RESULT
        ======================================= */}

        <div className="flex flex-col h-full">


          {/* Header */}

          <div className="flex justify-between items-end mb-4">

            <div>

              <h2 className="text-2xl font-bold text-purple-700">

                Kết quả AI Phân tích

              </h2>

              <p className="text-xs text-gray-500 mt-1">

                Mã tin: {currentRoom._id} • Đã tự động điền

              </p>

            </div>


            <div className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">

              <FaBolt />

              Đã xử lý JSON

            </div>

          </div>


          {/* Card */}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col">


            {/* Inputs */}

            <div className="grid grid-cols-2 gap-x-4">

              <AIInput
                label="Tiêu đề tin đăng"
                value={currentRoom.title}
              />

              <AIInput
                label="Số điện thoại"
                value={currentRoom.phone}
              />

              <AIInput
                label="Giá thuê (VNĐ/tháng)"
                value={currentRoom.price?.toLocaleString()}
              />

              <AIInput
                label="Diện tích (m²)"
                value={currentRoom.area}
              />

              <AIInput
                label="Địa chỉ"
                value={currentRoom.address}
              />

            </div>


            {/* Amenities */}

            <div className="mb-6 mt-4">

              <label className="block text-xs font-medium text-gray-600 mb-2">

                Tiện ích (AI đề xuất)

              </label>


              <div className="flex flex-wrap gap-2">

                {currentRoom.amenities?.map((item, index) => (

                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  >

                    <FaCheck
                      className="text-green-500"
                      size={10}
                    />

                    {item}

                  </span>

                ))}


                <button className="border border-dashed border-gray-300 text-gray-500 text-xs px-3 py-1.5 rounded-full hover:border-purple-400 hover:text-purple-600 flex items-center gap-1.5 transition-colors">

                  <FaPlus size={10} />

                  Thêm tiện ích

                </button>

              </div>

            </div>


            {/* Buttons */}

            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end gap-3">

              <button className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors">

                <FaEdit />

                Sửa chữa

              </button>


              <button
                onClick={() => handleApprove(currentRoom._id)}
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