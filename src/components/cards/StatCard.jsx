import { useLocation } from "react-router-dom";

const StatCard = ({ img, title, value, subtitle, bg }) => {
  const location = useLocation();
  const isDoctor = location.pathname.startsWith("/doctor");

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition">
      {/* Top */}
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: bg }}
        >
          <img src={img} alt={title} className="w-5 h-5" />
        </div>

        {isDoctor && (
          <img src="/images/uil_statistics.png" alt="stats" className="w-5 h-5" />
        )}
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
