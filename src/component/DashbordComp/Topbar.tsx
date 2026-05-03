import { Bell, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks/hook";
import { selectUser } from "../../store/slices/authSlice";

interface TopbarProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
}

export const Topbar = ({
  title = "Dashboard",
  subtitle,
  showSearch = true,
}: TopbarProps = {}) => {
  const user = useAppSelector(selectUser);

  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {subtitle || `Welcome back, ${user?.name || "Student"}! Here's what's happening today.`}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center justify-between md:justify-end gap-5">
        {/* Search */}
        {showSearch && (
          <div className="relative hidden sm:block w-64">
            <input
              type="text"
              placeholder="Search applications..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        )}

        {/* Notifications */}
        <div className="relative">
          <Link
            to={"/events"}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors bg-white text-gray-600"
          >
            <Bell className="w-5 h-5" />
          </Link>
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-[#F4F7FB] rounded-full"></span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-gray-200 flex">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {user?.name || "Staff Member"}
            </p>
            <p className="text-xs text-gray-500 font-medium uppercase mt-0.5">
              {user?.email || "Admin"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-blue-100 text-blue-600 shrink-0 border border-blue-200">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase() || "M"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
