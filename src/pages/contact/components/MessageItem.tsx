import type { Message, MessageUser } from "../../../store/slices/messagesSlice";

interface MessageItemProps {
  message: Message;
  currentUserId: string;
  /** Role of the currently logged-in user */
  currentUserRole?: string;
  onReply?: (studentId: string, studentName: string) => void;
}

export const MessageItem = ({ message, currentUserId, currentUserRole, onReply }: MessageItemProps) => {
  // Normalize sender to an object for display
  const senderObj: MessageUser | null =
    typeof message.sender === "object" ? message.sender : null;

  const senderId = senderObj?._id || (typeof message.sender === "string" ? message.sender : "");

  // Dual identification strategy:
  // 1. Match by user _id (primary)
  // 2. Fallback: if current user is a student, match by sender.role (for cases where IDs mismatch)
  const isMine =
    senderId === currentUserId ||
    (currentUserRole === "student" && senderObj?.role === "student" && !currentUserId);

  // Formatting date
  const dateObj = new Date(message.createdAt);
  const timeString = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(dateObj);

  const isStudent = senderObj?.role === "student";

  return (
    <div className={`flex w-full mb-4 ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`flex flex-col max-w-[75%] ${isMine ? "items-end" : "items-start"}`}>
        {/* Name and Role */}
        <div className="flex items-center gap-2 mb-1">
          {!isMine && senderObj && (
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-xs font-bold shrink-0 overflow-hidden">
              {senderObj.avatar ? (
                <img src={senderObj.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                senderObj.name.charAt(0).toUpperCase()
              )}
            </div>
          )}
          <span className="text-xs text-gray-500 font-medium">
            {senderObj?.name || "Unknown"} {senderObj?.role ? `(${senderObj.role})` : ""}
          </span>
        </div>

        {/* Message Bubble */}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isMine
              ? "bg-[#0F0FBD] text-white rounded-tr-none"
              : "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm"
          }`}
        >
          <p className="m-0 text-sm whitespace-pre-wrap leading-relaxed">{message.message}</p>
        </div>

        {/* Footer: Time & Action */}
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] text-gray-400">{timeString}</span>
          {!isMine && isStudent && onReply && (
            <button
              onClick={() => onReply(senderId, senderObj?.name || "Student")}
              className="text-[11px] text-blue-600 font-medium hover:underline bg-transparent border-none cursor-pointer p-0"
            >
              Reply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
