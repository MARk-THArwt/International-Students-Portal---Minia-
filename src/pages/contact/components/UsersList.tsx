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
    <div className="w-full bg-original-card border border-original-border rounded-xl flex flex-col overflow-hidden h-full md:h-[500px]">
      <div className="p-4 border-b border-original-border bg-original-background-alt">
        <h3 className="m-0 text-lg font-bold text-original-secondary">Conversations</h3>
        <p className="m-0 text-xs text-original-text-muted mt-1">Select a student to view chat</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && memoizedUsers.length === 0 ? (
          <div className="p-4 text-center text-original-text-muted text-sm">Loading conversations...</div>
        ) : memoizedUsers.length === 0 ? (
          <div className="p-4 text-center text-original-text-muted text-sm">No active conversations found.</div>
        ) : (
          <ul className="list-none p-0 m-0">
            {memoizedUsers.map((user) => {
              const isSelected = selectedUserId === user._id;
              return (
                <li key={user._id}>
                  <button
                    onClick={() => onSelectUser(user)}
                    className={`w-full text-left p-3 border-b border-original-border-light cursor-pointer transition-colors border-l-4 ${
                      isSelected
                        ? "bg-original-background-alt text-original-primary border-l-original-primary"
                        : "bg-original-card border-l-transparent hover:bg-original-background-alt"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-original-background-alt text-original-primary flex items-center justify-center text-original-primary-active text-xs font-bold overflow-hidden shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        {/* Optional Unread/Active indicator can be placed here */}
                      </div>
                      <div className="overflow-hidden">
                        <p className={`m-0 text-sm truncate ${isSelected ? "font-bold text-original-primary" : "font-medium text-original-text"}`}>
                          {user.name}
                        </p>
                        <p className="m-0 text-xs text-original-text-muted truncate">
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
