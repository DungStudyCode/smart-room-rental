// frontend/src/pages/FindRoom.jsx

import { useState, useEffect } from 'react';
import {
  FaSearch,
  FaMapMarkerAlt,
  FaRegHeart,
  FaSlidersH,
  FaVectorSquare,
  FaTimes
} from 'react-icons/fa';

const AMENITIES_LIST = [
  'Có gác lửng',
  'Máy lạnh',
  'Máy giặt',
  'Wifi',
  'Chỗ để xe',
  'Nuôi thú cưng',
  'Không chung chủ'
];

const FindRoom = () => {
  // DỮ LIỆU
  const [allRooms, setAllRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // TRẠNG THÁI BỘ LỌC
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(15000000);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // FETCH DỮ LIỆU
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/rooms');
        const data = await response.json();

        if (data.success) {
          setAllRooms(data.data);
          setFilteredRooms(data.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu phòng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // CHỌN/BỎ CHỌN TIỆN ÍCH
  const handleToggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  // ÁP DỤNG BỘ LỌC
  const handleApplyFilter = () => {
    let result = allRooms;

    // LỌC THEO GIÁ
    result = result.filter((room) => {
      const price = room.price || 0;
      return price >= minPrice && price <= maxPrice;
    });

    // LỌC THEO TIỆN ÍCH
    if (selectedAmenities.length > 0) {
      result = result.filter((room) => {
        if (!room.amenities || room.amenities.length === 0) {
          return false;
        }

        return selectedAmenities.every((selected) =>
          room.amenities.some((roomAmenity) =>
            roomAmenity
              .toLowerCase()
              .includes(selected.toLowerCase())
          )
        );
      });
    }

    setFilteredRooms(result);
    setShowFilterModal(false);
  };

  // RESET FILTER
  const handleResetFilter = () => {
    setMinPrice(0);
    setMaxPrice(15000000);
    setSelectedAmenities([]);
    setFilteredRooms(allRooms);
    setShowFilterModal(false);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-12 relative">

      {/* ==========================================
          THANH TÌM KIẾM & BỘ LỌC
      ========================================== */}
      <div className="bg-white border-b border-gray-100 py-4 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap lg:flex-nowrap items-center gap-4">

          {/* SEARCH */}
          <div className="flex-1 min-w-[280px] relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Tìm theo khu vực, đường..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 hide-scrollbar">

            {['Quận/Huyện', 'Loại phòng'].map((filter, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-purple-400 hover:text-purple-600 whitespace-nowrap transition-colors"
              >
                {filter}
                <span className="ml-1 text-[10px]">▼</span>
              </button>
            ))}

            {/* ADVANCED FILTER */}
            <button
              onClick={() => setShowFilterModal(true)}
              className="px-4 py-2 bg-purple-50 border border-purple-100 rounded-full text-sm font-medium text-purple-700 hover:bg-purple-100 flex items-center gap-2 whitespace-nowrap"
            >
              <FaSlidersH />

              Bộ lọc nâng cao

              {(minPrice > 0 ||
                maxPrice < 15000000 ||
                selectedAmenities.length > 0) && (
                <span className="w-2 h-2 bg-red-500 rounded-full ml-1"></span>
              )}
            </button>

          </div>

        </div>
      </div>

      {/* ==========================================
          DANH SÁCH PHÒNG
      ========================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Phòng trọ nổi bật
          </h1>

          <p className="text-gray-500">
            Tìm thấy{' '}
            <span className="font-bold text-purple-600">
              {filteredRooms.length}
            </span>{' '}
            không gian sống phù hợp với bạn.
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
          </div>
        ) : filteredRooms.length === 0 ? (

          /* EMPTY */
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 mb-4">
              Không tìm thấy phòng trọ nào phù hợp với bộ lọc của bạn.
            </p>

            <button
              onClick={handleResetFilter}
              className="px-6 py-2 bg-purple-100 text-purple-700 rounded-full font-medium hover:bg-purple-200"
            >
              Xóa bộ lọc
            </button>
          </div>

        ) : (

          /* GRID ROOM */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {filteredRooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group relative flex flex-col"
              >

                {/* HEART */}
                <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                  <FaRegHeart />
                </button>

                {/* IMAGE */}
                <div className="aspect-[4/3] bg-gray-200 overflow-hidden relative">

                  <img
                    src={
                      room.images && room.images.length > 0
                        ? room.images[0]
                        : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop'
                    }
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop';
                    }}
                  />

                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-1 rounded-md">
                    {room.images?.length || 0} ảnh
                  </div>

                </div>

                {/* CONTENT */}
                <div className="p-4 flex-1 flex flex-col">

                  {/* PRICE */}
                  <div className="flex justify-between items-start mb-2">

                    <h3 className="text-xl font-bold text-purple-700">
                      {room.price
                        ? room.price.toLocaleString('vi-VN')
                        : 'Thỏa thuận'}

                      <span className="text-xs font-normal text-gray-500">
                        {' '}
                        đ/tháng
                      </span>
                    </h3>

                    <div className="flex items-center gap-1 text-gray-500 text-[11px] font-medium bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                      <FaVectorSquare className="text-[10px]" />
                      {room.area}m²
                    </div>

                  </div>

                  {/* TITLE */}
                  <h2
                    className="text-gray-800 font-semibold text-sm mb-2 line-clamp-2 hover:text-purple-600 cursor-pointer transition-colors"
                    title={room.title}
                  >
                    {room.title}
                  </h2>

                  {/* ADDRESS */}
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-4">
                    <FaMapMarkerAlt className="text-gray-400 shrink-0" />

                    <span
                      className="truncate"
                      title={room.address}
                    >
                      {room.address}
                    </span>
                  </div>

                  {/* AMENITIES */}
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-3 border-t border-gray-50">

                    {room.amenities &&
                      room.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-50 text-purple-700 text-[10px] font-medium px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}

                    {room.amenities?.length > 3 && (
                      <span className="bg-gray-50 text-gray-600 text-[10px] font-medium px-2 py-1 rounded">
                        +{room.amenities.length - 3}
                      </span>
                    )}

                  </div>

                </div>

              </div>
            ))}

          </div>

        )}

      </div>

      {/* ==========================================
          MODAL FILTER
      ========================================== */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up">

            {/* HEADER */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100">

              <h3 className="font-bold text-gray-900 text-lg">
                Bộ lọc nâng cao
              </h3>

              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <FaTimes size={20} />
              </button>

            </div>

            {/* BODY */}
            <div className="p-6">

              {/* PRICE */}
              <div className="mb-8">

                <h4 className="font-semibold text-gray-800 mb-4">
                  Mức giá
                </h4>

                {/* DECORATION */}
                <div className="relative h-1 bg-gray-200 rounded-full mb-6">

                  <div className="absolute top-0 left-0 h-1 bg-purple-600 rounded-full w-full"></div>

                  <div className="absolute top-1/2 left-0 w-4 h-4 bg-purple-600 rounded-full -translate-y-1/2 shadow ring-2 ring-white"></div>

                  <div className="absolute top-1/2 right-0 w-4 h-4 bg-purple-600 rounded-full -translate-y-1/2 shadow ring-2 ring-white"></div>

                </div>

                <div className="flex items-center gap-4">

                  {/* MIN */}
                  <div className="flex-1">

                    <label className="text-xs text-gray-500 mb-1 block">
                      Tối thiểu
                    </label>

                    <div className="relative">

                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) =>
                          setMinPrice(Number(e.target.value))
                        }
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                      />

                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        đ
                      </span>

                    </div>

                  </div>

                  <span className="text-gray-300 font-bold mt-4">
                    -
                  </span>

                  {/* MAX */}
                  <div className="flex-1">

                    <label className="text-xs text-gray-500 mb-1 block">
                      Tối đa
                    </label>

                    <div className="relative">

                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) =>
                          setMaxPrice(Number(e.target.value))
                        }
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                      />

                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        đ
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              <hr className="border-gray-100 mb-6" />

              {/* AMENITIES */}
              <div>

                <h4 className="font-semibold text-gray-800 mb-4">
                  Tiện ích
                </h4>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2">

                  {AMENITIES_LIST.map((amenity, idx) => (
                    <label
                      key={idx}
                      onClick={() => handleToggleAmenity(amenity)}
                      className="flex items-center gap-3 cursor-pointer group"
                    >

                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          selectedAmenities.includes(amenity)
                            ? 'bg-purple-600 border-purple-600'
                            : 'border-gray-300 group-hover:border-purple-400'
                        }`}
                      >
                        {selectedAmenities.includes(amenity) && (
                          <FaTimes className="text-white text-[10px] rotate-45" />
                        )}
                      </div>

                      <span className="text-sm text-gray-600">
                        {amenity}
                      </span>

                    </label>
                  ))}

                </div>

              </div>

            </div>

            {/* FOOTER */}
            <div className="p-5 border-t border-gray-100 flex justify-between items-center bg-gray-50">

              <button
                onClick={handleResetFilter}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
              >
                Đặt lại
              </button>

              <button
                onClick={handleApplyFilter}
                className="px-8 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 shadow-md shadow-purple-200 transition-colors"
              >
                Áp dụng
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default FindRoom;