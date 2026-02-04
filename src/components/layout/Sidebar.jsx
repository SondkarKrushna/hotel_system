import { useState } from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Clock,
  Stethoscope,
  FileText,
  ClipboardList,
  X,
  Menu,
  ShoppingCart,
  IndianRupee,
  UtensilsCrossed,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const basePath = "/";
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsOpen(false);

    toast.success("Logged out successfully 👋");

    setTimeout(() => {
      navigate("/", { replace: true });
    }, 500); // small delay so toast is visible
  };

  const menuItems = [
    {
      name: "Orders",
      icon: ShoppingCart,
      link: "/myorders",
    },
    // {
    //   name: "Revenue",
    //   icon: IndianRupee,
    //   link: "/totalrevenue",
    // },
    // {
    //   name: "Food Menu",
    //   icon: UtensilsCrossed,
    //   link: "/menu",
    // },
  ];

  return (
    <aside
      className={`
    fixed inset-y-0 left-0
    ${collapsed ? "w-20" : "w-64"}
    bg-white border-r border-gray-200
    z-40 transform transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:static lg:translate-x-0
    flex flex-col
  `}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between text-[#0d1827]">
        <div className="flex items-center gap-2 overflow-hidden">
          {
            !collapsed && (
              <img
                src="/images/logo_1.png"
                alt="Tech Surya"
                className={`transition-all duration-300 ${collapsed ? "w-10" : "w-36"}`}
              />
            )}


        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-9 h-9 rounded-md
                      text-gray-500 hover:text-gray-500 hover:bg-gray-100 transition"
          >
            <Menu size={22} />
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-800"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">

        {/* Dashboard */}
        <NavLink
          to={`/dashboard`}
          end
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `flex items-center ${collapsed ? "justify-center" : "gap-3"
            } px-4 py-2 rounded-lg text-sm transition
    ${isActive
              ? "bg-[#0d1827] text-white"
              : "text-[#0d1827] hover:bg-[#0d1827b5] hover:text-white"
            }`
          }
          title={collapsed ? "Dashboard" : ""}
        >
          <LayoutDashboard size={20} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>


        {/* Dynamic Menu */}
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={index}
              to={item.link}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
                ${isActive
                  ? "bg-[#0d1827] text-white"
                  : "text-[#0d1827] hover:bg-[#0d1827b5] hover:text-white"
                }`
              }
              title={collapsed ? item.name : ""}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>
      {/* Logout */}
      <div className="px-2 mt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
                    text-red-600 hover:bg-red-50"
          title={collapsed ? "Logout" : ""}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
