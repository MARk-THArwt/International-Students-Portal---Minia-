import React from 'react'
import { Bell, Search } from "lucide-react";
export const Topbar = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

      {/* search */}
      <div className="flex items-center bg-white px-4 py-2 rounded-xl w-full md:w-[400px] shadow-sm">
        <Search className="text-gray-400 mr-2" size={18} />
        <input
          type="text"
          placeholder="Search for documents, applications..."
          className="outline-none w-full text-sm"
        />
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
