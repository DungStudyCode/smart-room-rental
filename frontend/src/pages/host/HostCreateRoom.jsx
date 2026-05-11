// frontend/src/pages/host/HostCreateRoom.jsx
import { useState, useRef, useMemo, useEffect } from 'react';
import { FaUpload, FaMapMarkerAlt, FaImages, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icon Ghim
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', 
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Ép bản đồ bay theo tọa độ
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => { map.flyTo(center, 16); }, [center, map]);
  return null;
};

const DraggableMarker = ({ position, setPosition }) => {
  const markerRef = useRef(null);
  const map = useMapEvents({
    click(e) { setPosition(e.latlng); map.flyTo(e.latlng, map.getZoom()); },
  });
  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current;
      if (marker != null) setPosition(marker.getLatLng());
    },
  }), [setPosition]);

  return <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef} icon={customIcon} />;
};

const HostCreateRoom = () => {
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '', phone: '', price: '', area: '', address: '', description: '',
    location: { lat: 16.0544, lng: 108.2022 },
    amenities: [], images: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    
    // Tạo preview ảnh thật
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...previews]);
  };

  const handleGeocode = async () => {
    if (!formData.address) return alert("Vui lòng nhập địa chỉ!");
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address + ', Đà Nẵng')}`);
      const data = await res.json();
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, location: { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }}));
      }
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Dùng FormData để hỗ trợ gửi File thật lên Server
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('phone', formData.phone);
    submitData.append('price', formData.price);
    submitData.append('area', formData.area);
    submitData.append('address', formData.address);
    submitData.append('description', formData.description);
    submitData.append('location', JSON.stringify(formData.location));
    submitData.append('amenities', JSON.stringify(formData.amenities));
    formData.images.forEach(img => submitData.append('images', img));

    try {
      // Gọi API thực tế của bạn ở đây
      const response = await fetch('http://localhost:5000/api/host/rooms', {
        method: 'POST',
        body: submitData, // Không set Content-Type, trình duyệt sẽ tự set boundary
        // headers: { 'Authorization': `Bearer ${token}` } // Thêm token nếu có
      });
      const data = await response.json();
      if (data.success) {
        alert("🎉 Đăng tin thành công! Tin của bạn đang chờ Admin duyệt.");
        // Chuyển hướng về trang Quản lý tin đăng
      }
    } catch (error) {
      console.error("Lỗi khi đăng tin:", error);
      alert("Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 bg-[#f8f9fa] min-h-screen">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tạo tin đăng mới</h1>
        <p className="text-gray-500 mt-2">Thông tin càng chi tiết, cơ hội tìm được người thuê càng cao.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* CARD 1: THÔNG TIN CƠ BẢN */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaInfoCircle className="text-purple-600" /> 1. Thông tin cơ bản
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề bài đăng *</label>
              <input type="text" name="title" required value={formData.title} onChange={handleInputChange} placeholder="VD: Phòng trọ ban công thoáng mát..." className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giá thuê (VNĐ/tháng) *</label>
              <input type="number" name="price" required value={formData.price} onChange={handleInputChange} placeholder="VD: 3500000" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diện tích (m²) *</label>
              <input type="number" name="area" required value={formData.area} onChange={handleInputChange} placeholder="VD: 25" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại liên hệ *</label>
              <input type="text" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="Nhập SĐT của bạn" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
          </div>
        </div>

        {/* CARD 2: VỊ TRÍ & BẢN ĐỒ */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaMapMarkerAlt className="text-purple-600" /> 2. Vị trí phòng trọ
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ chi tiết *</label>
            <div className="flex gap-2">
              <input type="text" name="address" required value={formData.address} onChange={handleInputChange} placeholder="Số nhà, tên đường, phường..." className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none" />
              <button type="button" onClick={handleGeocode} className="bg-purple-100 text-purple-700 font-bold px-6 rounded-xl hover:bg-purple-200 whitespace-nowrap">
                📍 Tìm Map
              </button>
            </div>
          </div>

          <div className="w-full h-[300px] rounded-xl overflow-hidden border border-gray-200 relative z-0 mt-4">
            <MapContainer center={[formData.location.lat, formData.location.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapUpdater center={[formData.location.lat, formData.location.lng]} />
              <DraggableMarker position={[formData.location.lat, formData.location.lng]} setPosition={(pos) => setFormData(prev => ({...prev, location: pos}))} />
            </MapContainer>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center italic">* Vui lòng kéo thả ghim màu đỏ vào đúng vị trí hẻm/nhà của bạn trên bản đồ.</p>
        </div>

        {/* CARD 3: HÌNH ẢNH & MÔ TẢ */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaImages className="text-purple-600" /> 3. Hình ảnh & Mô tả
          </h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết *</label>
            <textarea name="description" required rows="5" value={formData.description} onChange={handleInputChange} placeholder="Nêu rõ ưu điểm, điện nước, tiện ích xung quanh..." className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none resize-y"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh thực tế (Tối thiểu 3 ảnh) *</label>
            
            {/* Khung Kéo thả Upload Ảnh */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50 relative hover:bg-gray-100 transition-colors cursor-pointer group">
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FaUpload size={24} />
              </div>
              <p className="font-semibold text-gray-700">Kéo thả ảnh vào đây hoặc Click để chọn</p>
              <p className="text-sm text-gray-500 mt-1">Hỗ trợ JPG, PNG. Khuyến khích ảnh chụp ngang.</p>
            </div>

            {/* Preview Ảnh */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    {index === 0 && <span className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded">ẢNH BÌA</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* NÚT SUBMIT */}
        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className={`px-8 py-4 rounded-xl font-bold text-white shadow-lg shadow-purple-200 transition-all ${loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 hover:-translate-y-1'}`}>
            {loading ? <span className="flex items-center gap-2"><FaSpinner className="animate-spin" /> Đang tải lên...</span> : '🚀 Hoàn tất & Đăng tin'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default HostCreateRoom;