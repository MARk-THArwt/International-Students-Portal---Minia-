import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../store/hooks/hook";
import { selectUser } from "../../store/slices/authSlice";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";

interface TopbarProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
}

export const Topbar = ({
  title,
  subtitle,
  showSearch = true,
}: TopbarProps = {}) => {
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);

  const displayTitle = title || t("dashboard");

  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{displayTitle}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {subtitle || `${t("welcome")}, ${user?.name || t("student")}!`}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center justify-between md:justify-end gap-5">
        {/* Search */}
        {showSearch && (
          <div className="relative hidden sm:block w-64">
            <input
              type="text"
              placeholder={t("search")}
              className="w-full ps-10 pe-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
            />
            <Search className="w-4 h-4 text-gray-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          </div>
        )}

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Notifications */}
        <NotificationsDropdown />

        {/* Profile */}
        <div className="flex items-center gap-3 ps-2 border-s border-gray-200 flex">
          <div className="text-end hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {user?.name || t("staffMember")}
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
