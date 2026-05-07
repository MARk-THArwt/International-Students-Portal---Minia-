import { useMemo } from "react";
import type { MessageUser } from "../../../store/slices/messagesSlice";

interface UsersListProps {
  users: MessageUser[];
  selectedUserId: string | null;
  onSelectUser: (user: MessageUser) => void;
  loading?: boolean;
}

export const UsersList = ({ users, selectedUserId, onSelectUser, loading }: UsersListProps) => {
  // Memoize users just in case parent doesn't, to avoid unnecessary re-renders if list doesn't change
  const memoizedUsers = useMemo(() => users, [users]);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden h-full md:h-[500px]">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="m-0 text-lg font-bold text-[#002147]">Conversations</h3>
        <p className="m-0 text-xs text-gray-500 mt-1">Select a student to view chat</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && memoizedUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">Loading conversations...</div>
        ) : memoizedUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">No active conversations found.</div>
        ) : (
          <ul className="list-none p-0 m-0">
            {memoizedUsers.map((user) => {
              const isSelected = selectedUserId === user._id;
              return (
                <li key={user._id}>
                  <button
                    onClick={() => onSelectUser(user)}
                    className={`w-full text-left p-3 border-b border-gray-100 cursor-pointer transition-colors border-l-4 ${
                      isSelected
                        ? "bg-blue-50 border-l-[#0F0FBD]"
                        : "bg-white border-l-transparent hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-xs font-bold overflow-hidden shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        {/* Optional Unread/Active indicator can be placed here */}
                      </div>
                      <div className="overflow-hidden">
                        <p className={`m-0 text-sm truncate ${isSelected ? "font-bold text-[#0F0FBD]" : "font-medium text-gray-800"}`}>
                          {user.name}
                        </p>
                        <p className="m-0 text-xs text-gray-500 truncate">
                          Role: {user.role || "student"}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
