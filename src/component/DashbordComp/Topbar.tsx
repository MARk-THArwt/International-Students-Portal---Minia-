import { Bell } from "lucide-react";
export const Topbar = () => {
  return (
    <div className="flex flex-col align-middle md:flex-row md:items-center md:justify-between gap-4 mb-6">

      {/* Welcome */}
              <div>
                <h1 className="text-xl font-bold">
                  Welcome back, Ahmed 👋
                </h1>
                <p className="text-gray-500 text-sm">
                  Here's what's happening with your international application today.
                </p>
              </div>
      

      {/* right */}
      <div className="flex items-center justify-between md:justify-end gap-4">
        <span className="text-sm">EN</span>
        <Bell className="cursor-pointer" />

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gray-300 rounded-full" />
          <div>
            <p className="text-sm font-medium">Ahmed Hassan</p>
            <p className="text-xs text-gray-500">ID: 20230045</p>
          </div>
        </div>
      </div>

    </div>
  );
};
