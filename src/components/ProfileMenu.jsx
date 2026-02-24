import { useNavigate } from "react-router-dom";
import { LogOut, User, Phone, Shield } from "lucide-react";
import { useEffect, useState } from "react";

const ProfileMenu = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);

  // ✅ Get adminUser from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("adminUser"); // remove only adminUser
    navigate("/", { replace: true });
  };

  return (
    <div className="w-64 bg-white rounded-2xl shadow-xl border p-4 z-50">

      {/* User Info Section */}
      <div className="border-b pb-3 mb-3">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <User size={18} />
          <span className="font-semibold">
            {adminUser?.name || "Admin"}
          </span>
        </div>

        {/* <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
          <Shield size={16} />
          <span>{adminUser?.role || "No Role"}</span>
        </div> */}

        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Phone size={16} />
          <span>{adminUser?.phone || "-"}</span>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-500 text-left rounded-xl transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default ProfileMenu;