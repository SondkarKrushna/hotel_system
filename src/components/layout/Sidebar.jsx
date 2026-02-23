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
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isDoctor = location.pathname.startsWith("/doctor");
  const basePath = isDoctor ? "/doctor" : "/receptionist";
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsOpen(false);

    toast.success("Logged out successfully 👋");

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 500); // small delay so toast is visible
  };


  // ✅ Define menuItems ONCE
  const menuItems = isDoctor
    ? [
      { name: "Appointments", icon: CalendarCheck, link: `${basePath}/appointments` },
      { name: "My Patients", icon: Users, link: `${basePath}/mypatient` },
      { name: "Schedule", icon: Clock, link: `${basePath}/schedule` },
      { name: "Doctors", icon: Stethoscope, link: `${basePath}/doctors` },
      { name: "Invoice", icon: FileText, link: `${basePath}/invoice` },
      { name: "Prescriptions", icon: ClipboardList, link: `${basePath}/prescription` },
    ]
    : [
      { name: "Appointments", icon: CalendarCheck, link: `${basePath}/appointments` },
      { name: "Add Patients", icon: Users, link: `${basePath}/add-patient` },
      { name: "Doctors", icon: Stethoscope, link: `${basePath}/doctors` },
      { name: "Patients", icon: Users, link: `${basePath}/mypatient` },
      { name: "Payments", icon: Clock, link: `${basePath}/payments` },
      { name: "Invoice & Prescriptions", icon: FileText, link: `${basePath}/invoice` },
    ];

  return (
    <aside
      className={`
        fixed lg:sticky top-0 left-0 max-h-screen 
        ${collapsed ? "w-20" : "w-64"}
        bg-white border-r border-gray-200
        z-40 transform transition-all duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        flex flex-col
      `}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between text-[#2D9AD9]">
        <div className="flex items-center gap-2 overflow-hidden">
          {
            !collapsed ? (
              <img
                src="/images/techsuryalogo.png"
                alt="Tech Surya"
                className={`transition-all duration-300 ${collapsed ? "w-10" : "w-36"}`}
              />
            ) : (
              <img
                src="/images/colapslogo.png"
                alt="Tech Surya"
                className={`transition-all duration-300 w-36`}
              />
            )
          }


        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-9 h-9 rounded-md
                      text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
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
        {!collapsed ? (
          <p className="uppercase font-semibold text-[#E65100] text-[12px] px-3 mt-4 mb-2">
            Menu
          </p>
        ) : (
          <p className="uppercase font-semibold text-[#E65100] text-[20px] px-3 mt-4 mb-2">
            ...
          </p>)
        }
        {/* Dashboard */}
        <NavLink
          to={`${basePath}/dashboard`}
          end
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
            ${isActive
              ? "bg-[#2D9AD9] text-white"
              : "text-[#2D9AD9] hover:bg-[#2D9AD9] hover:text-white"
            }`
          }
          title={collapsed ? "Dashboard" : ""}
        >
          <LayoutDashboard size={20} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        {!collapsed ? (
          <p className="uppercase font-semibold text-[#2D9AD9] text-[12px] px-3 mt-4 mb-2">
            Healthcare
          </p>
        ) : (
          <p className="uppercase font-semibold text-[#2D9AD9] text-[20px] px-3 mt-4 mb-2">
            ...
          </p>)}

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
                  ? "bg-[#2D9AD9] text-white"
                  : "text-[#2D9AD9] hover:bg-[#2D9AD9] hover:text-white"
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


      {/* Footer */}
      <div className="p-4">
        {!collapsed ? (
          <div className="bg-[#2D9AD92B] rounded-xl p-4 text-center">
            <p className="text-[15px] font-semibold text-[#2D9AD9]">
              Need Help?
            </p>
            <p className="text-[12px] text-[#1E1E1EB8] mb-4">
              Contact support team
            </p>
            <button className="w-full bg-[#5000FF] font-semibold text-white py-2 rounded-lg text-[12px] hover:opacity-90">
              Get Support
            </button>
          </div>
        ) : (
          <div className="bg-[#2D9AD92B] rounded-xl p-1 text-center">

            <button
              className="w-full bg-[#5000FF] text-white py-2 rounded-full hover:opacity-90"
              title="Get Support"
            >
              ?
            </button>
          </div>
        )}

      </div>
    </aside>
  );
};

export default Sidebar;
