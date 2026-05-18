import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hook";
import { getMyNotifications, markNotificationAsRead } from "../../store/slices/notificationsSlice";
import { Bell, Check, Loader2, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Helper for relative time
function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMins < 1) return "Just now";
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

export function NotificationsDropdown() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, loading } = useAppSelector((state) => state.notifications);
  const user = useAppSelector((state) => state.auth.user);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Fetch notifications on mount if user is logged in
  useEffect(() => {
    if (user) {
      dispatch(getMyNotifications({ page: 1, limit: 10 }));
    }
  }, [dispatch, user]);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleNotificationClick = async (id: string, isRead: boolean, message: string) => {
    if (!isRead) {
      try {
        await dispatch(markNotificationAsRead(id)).unwrap();
      } catch (err) {
        toast.error("Failed to mark notification as read");
      }
    }

    setIsOpen(false);
    
    // Navigation logic based on message content
    const msg = message.toLowerCase();
    if (msg.includes("request")) {
      navigate("/student-dashboard/requests");
    } else if (msg.includes("event")) {
      navigate("/announcement");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="w-10 h-10 rounded-full border border-original-border flex items-center justify-center hover:bg-original-background-alt transition-colors bg-original-card text-original-text-muted focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-original-danger text-white text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-original-border-light shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-original-card rounded-2xl shadow-xl border border-original-border-light z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="px-4 py-3 border-b border-original-border-light flex items-center justify-between bg-original-background-alt/50">
            <h3 className="font-bold text-original-text-dark m-0 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold text-original-primary bg-original-background-alt text-original-primary px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto overscroll-contain">
            {loading && notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-original-primary animate-spin mb-2" />
                <p className="text-xs text-original-text-muted">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="w-12 h-12 bg-original-background-alt rounded-full flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-original-text-muted" />
                </div>
                <p className="text-sm font-semibold text-original-text m-0">All caught up!</p>
                <p className="text-xs text-original-text-muted mt-1">You have no new notifications.</p>
              </div>
            ) : (
              <div className="divide-y divide-original-border-light">
                {notifications.map((notif) => (
                  <div
                    key={notif._id}
                    onClick={() => handleNotificationClick(notif._id, notif.isRead, notif.message)}
                    className={`p-4 hover:bg-original-background-alt transition-colors cursor-pointer flex gap-3 ${
                      !notif.isRead ? "bg-original-background-alt text-original-primary/30" : "opacity-75"
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {notif.isRead ? (
                        <div className="w-8 h-8 rounded-full bg-original-background-alt flex items-center justify-center text-original-text-muted/70">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-original-background-alt text-original-primary flex items-center justify-center text-original-primary">
                          <Info className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm m-0 leading-snug ${
                          !notif.isRead ? "text-original-text-dark font-semibold" : "text-original-text-muted font-medium"
                        }`}
                      >
                        {notif.message}
                      </p>
                      <p className="text-[11px] text-original-text-muted/70 mt-1 font-medium">
                        {getRelativeTime(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="shrink-0 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-original-primary text-white"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-original-border-light text-center bg-original-background-alt/50">
              <Link
                to="/events" // Or a specific notifications page if you have one
                className="text-xs font-bold text-original-primary hover:text-original-primary-hover transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View All Notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
