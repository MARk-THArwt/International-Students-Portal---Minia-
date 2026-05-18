import type { Conversation } from "../../../store/slices/messagesSlice";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export const ConversationItem = ({ conversation, isSelected, onClick }: ConversationItemProps) => {
  const { with: partner, messages, unreadCount } = conversation;

  // Last message preview
  const lastMsg = messages[messages.length - 1];
  const preview = lastMsg?.message
    ? lastMsg.message.length > 40
      ? lastMsg.message.slice(0, 40) + "…"
      : lastMsg.message
    : "No messages yet";

  const lastTime = lastMsg
    ? new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(
        new Date(lastMsg.createdAt)
      )
    : "";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-original-border-light cursor-pointer transition-colors border-l-4 ${
        isSelected
          ? "bg-original-background-alt text-original-primary border-l-original-primary"
          : "bg-original-card border-l-transparent hover:bg-original-background-alt"
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-original-secondary/10 flex items-center justify-center text-original-secondary text-sm font-bold overflow-hidden">
          {partner.avatar ? (
            <img src={partner.avatar} alt={partner.name} className="w-full h-full object-cover" />
          ) : (
            partner.name.charAt(0).toUpperCase()
          )}
        </div>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-original-danger text-white text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`text-sm truncate ${isSelected ? "font-bold text-original-primary" : "font-semibold text-original-text"}`}>
            {partner.name}
          </span>
          <span className="text-[10px] text-original-text-muted/70 shrink-0 ml-1">{lastTime}</span>
        </div>
        <p className={`text-xs truncate m-0 ${unreadCount > 0 ? "font-semibold text-original-text" : "text-original-text-muted/70"}`}>
          {preview}
        </p>
      </div>
    </button>
  );
};
