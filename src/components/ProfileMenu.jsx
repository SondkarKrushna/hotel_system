import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const ProfileMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    // dispatch(logout()); // if using redux auth

    localStorage.clear();
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  return (
    <div className="w-48 bg-white rounded-xl shadow-lg border z-50">
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-500 text-left rounded-xl"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default ProfileMenu;
