import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import ProfileMenu from "../ProfileMenu";
import { useState } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
=======
>>>>>>> 8d7bf0b0f71c57eb9a06e99423c7a209f8f1c5d7

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const [showProfile, setShowProfile] = useState(false);

<<<<<<< HEAD
  const navigate = useNavigate();

=======
>>>>>>> 8d7bf0b0f71c57eb9a06e99423c7a209f8f1c5d7
  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 py-2 shadow-sm">
      
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-900"
        >
          <Menu size={24} />
        </button>

        <h1 className="text-lg sm:text-xl font-semibold"
        onClick={() => navigate('/dashboard')}
        >
          Admin Dashboard
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        <div className="flex items-center gap-3 px-4 py-2 min-w-[160px] h-[58px] rounded-2xl relative">
          
          {/* Name */}
<<<<<<< HEAD
          <div className="flex flex-col leading-tight text-right ml-6 pl-6">
=======
          <div className="flex flex-col leading-tight text-right">
>>>>>>> 8d7bf0b0f71c57eb9a06e99423c7a209f8f1c5d7
            <span className="text-sm font-medium text-[#1E1E1E] truncate">
              {user?.name || "Admin"}
            </span>
          </div>

          {/* Profile Image */}
          <div
            className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 cursor-pointer"
            onClick={() => setShowProfile(!showProfile)}
          >
            <img
              src="/images/user.png"
              alt="admin"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Dropdown */}
          {showProfile && (
            <div className="absolute right-0 top-16 z-50">
              <ProfileMenu />
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;
