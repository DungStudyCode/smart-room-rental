const StatusBadge = ({ type }) => {
    const styles = {
        // Trạng thái Phòng (Dựa trên Model Room.js của bạn)
        AVAILABLE: 'bg-green-50 text-green-600 border-green-100',
        PENDING: 'bg-yellow-50 text-yellow-600 border-yellow-100',
        HIDDEN: 'bg-gray-50 text-gray-400 border-gray-100',
        // Trạng thái Người dùng
        ACTIVE: 'bg-cyan-50 text-cyan-600 border-cyan-100',
        BANNED: 'bg-red-50 text-red-600 border-red-100',
    };

    return (
        <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${
                styles[type] || styles.HIDDEN
            }`}
        >
            ● {type}
        </span>
    );
};
export default StatusBadge;
