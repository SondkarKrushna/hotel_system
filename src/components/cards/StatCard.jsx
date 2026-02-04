import { useLocation } from "react-router-dom";

const StatCard = ({ icon: Icon, title, value, subtitle, bg, onClick }) => {
  const location = useLocation();
  const isDoctor = location.pathname.startsWith("/doctor");

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition 
      ${onClick ? "cursor-pointer hover:shadow-md hover:scale-[1.02]" : ""}`}
    >
      {/* Top */}
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: bg }}
        >
          {Icon && <Icon size={20} className="text-black" />}
        </div>
      </div>

      {/* Value */}
      <h2 className="text-lg sm:text-xl font-bold mt-3 truncate">
        {value}
      </h2>

      {/* Title */}
      <p className="text-gray-600 text-sm truncate">{title}</p>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-blue-500 text-xs mt-1 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
