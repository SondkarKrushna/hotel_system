import { Menu } from "lucide-react";
import SearchInput from "../SearchInput.jsx";
import { useLocation } from "react-router-dom";

const Header = ({ onMenuClick }) => {
  const location = useLocation();

  const isDoctor = location.pathname.startsWith("/doctor");
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 py-1 shadow-sm">

      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Hamburger (mobile only) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-900"
        >
          <Menu size={24} />
        </button>

        {/* Doctor → Title | Receptionist → Search */}
        {isDoctor ? (
          <h1 className="text-lg sm:text-xl font-semibold">
            Doctor Dashboard
          </h1>
        ) : (
          <div className="hidden sm:block w-[260px]">
            <SearchInput />
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* Search on right ONLY for doctor */}
        {isDoctor && (
          <div className="hidden sm:block">
            <SearchInput />
          </div>
        )}

        
        {/* Profile */}
        {isDoctor && user && (
          <div className="flex items-center gap-3 bg-[#D9D9D961] px-3 py-2 w-[200px] sm:w-[240px] h-[58px] rounded-2xl text-sm">
            <div className="w-[40px] h-[40px] flex-shrink-0">
              <img
                className="bg-[#2D9AD8] rounded-full p-2 w-full h-full object-cover"
                src={user.profileImage || "/images/user.png"}
                alt="Doctor"
              />
            </div>

            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="font-medium text-[#1E1E1E] truncate">
                {user.name || "Doctor"}
              </span>
              <span className="text-[11px] font-normal text-[#1E1E1E]">
                {user.specialization || "Specialist"}
              </span>
            </div>
          </div>
        )}

        {/* Receptionist */}
        {!isDoctor && user && (
          <div className="flex items-center gap-2 px-4 py-2 min-w-[130px] sm:min-w-[240px] h-[58px] rounded-2xl">
            <div className="flex flex-col leading-tight flex-1">
              <span className="text-sm text-right font-medium text-[#1E1E1E] truncate">
                {user.name || "Receptionist"}
              </span>
            </div>

            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-white">
              <img
                src={user.profileImage || "/images/vaadin_nurse.png"}
                alt="Receptionist"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

      </div>

    </header>
  );
};

export default Header;
