import React from 'react'

export const Sidebar = () => {
  return (
    <aside className="w-[260px] bg-[#0A1931] text-white flex flex-col p-5">
      <div className="mb-8">
        <h2 className="font-bold text-lg">Minia University</h2>
        <p className="text-xs text-gray-400">
          International Students Portal
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        <div className="bg-[#1E2A47] p-2 rounded-lg">Dashboard</div>
        <div className="p-2 rounded-lg hover:bg-[#1E2A47] cursor-pointer">
          My Requests
        </div>
        <div className="p-2 rounded-lg hover:bg-[#1E2A47] cursor-pointer">
          Documents
        </div>
      </nav>

      <button className="mt-auto bg-[#1E2A47] py-2 rounded-lg hover:bg-[#26345a] transition">
        Logout
      </button>
    </aside>
  );
};
