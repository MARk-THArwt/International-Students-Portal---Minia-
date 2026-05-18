import { useEffect, useMemo, useRef } from "react";
import type { Message, Conversation, MessageUser } from "../../../store/slices/messagesSlice";
import { useAppSelector } from "../../../store/hooks/hook";
import { MessageInput } from "./MessageInput";

// ─── MessageItem ─────────────────────────────────────────────────────────────

interface MessageItemProps {
  message: Message;
  currentUserId: string;
}

const MessageItem = ({ message, currentUserId }: MessageItemProps) => {
  // Strict _id comparison — do NOT use role
  const isMine = message.sender._id === currentUserId;

  const timeStr = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(message.createdAt));

  return (
    <div className={`flex w-full mb-3 ${isMine ? "justify-end" : "justify-start"}`}>
      {/* Avatar for received messages */}
      {!isMine && (
        <div className="w-8 h-8 rounded-full bg-original-secondary/10 flex items-center justify-center text-original-secondary text-xs font-bold overflow-hidden shrink-0 mr-2 mt-1">
          {message.sender.avatar ? (
            <img src={message.sender.avatar} alt={message.sender.name} className="w-full h-full object-cover" />
          ) : (
            message.sender.name.charAt(0).toUpperCase()
          )}
        </div>
      )}

      <div className={`flex flex-col max-w-[72%] ${isMine ? "items-end" : "items-start"}`}>
        {/* Sender name — only for received */}
        {!isMine && (
          <span className="text-[11px] text-original-text-muted font-medium mb-0.5 ml-1">
            {message.sender.name}
          </span>
        )}

        {/* Bubble */}
        <div
          className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isMine
              ? "bg-original-primary text-white rounded-tr-sm"
              : "bg-original-card border border-original-border text-original-text rounded-tl-sm shadow-sm"
          }`}
        >
          {message.message}
        </div>

        {/* Time */}
        <span className="text-[10px] text-original-text-muted/70 mt-1 mx-1">{timeStr}</span>
      </div>

      {/* Avatar placeholder for sent messages (keeps alignment) */}
      {isMine && <div className="w-8 shrink-0 ml-2" />}
    </div>
  );
};

// ─── ChatWindow ───────────────────────────────────────────────────────────────

interface ChatWindowProps {
  selectedConversation: Conversation | null;
  isStudent: boolean;
  sendLoading: boolean;
  onSend: (text: string) => void;
}

export const ChatWindow = ({
  selectedConversation,
  isStudent,
  sendLoading,
  onSend,
}: ChatWindowProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Get current user _id directly from auth slice — never pass as prop to avoid stale values
  const authUser = useAppSelector((s) => s.auth.user);
  const currentUserId: string = authUser?._id ?? "";

  // Sort messages oldest → newest — do NOT mutate original array
  const sortedMessages = useMemo(() => {
    if (!selectedConversation) return [];
    return [...selectedConversation.messages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [selectedConversation]);

  // Auto-scroll to latest message whenever sortedMessages changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages]);

  // The "other" person in the conversation
  const partner: MessageUser | null = selectedConversation?.with ?? null;

  // Empty placeholder when no conversation is selected
  if (!selectedConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-original-background-alt rounded-xl border border-original-border">
        <div className="text-5xl mb-3">💬</div>
        <h3 className="text-base font-bold text-original-text m-0">No conversation selected</h3>
        <p className="text-sm text-original-text-muted/70 mt-1">Choose one from the sidebar to start.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-original-card rounded-xl border border-original-border shadow-sm overflow-hidden h-full">
      {/* Header */}
      <div className="bg-original-secondary px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-original-card/20 flex items-center justify-center font-bold text-white text-sm overflow-hidden shrink-0">
          {partner?.avatar ? (
            <img src={partner.avatar} alt={partner.name} className="w-full h-full object-cover" />
          ) : (
            partner?.name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <p className="m-0 text-sm font-bold text-white">{partner?.name}</p>
          <p className="m-0 text-[11px] text-white/60 capitalize">{partner?.role}</p>
        </div>
        {selectedConversation.unreadCount > 0 && (
          <span className="ml-auto bg-original-danger text-white text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {selectedConversation.unreadCount} unread
          </span>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-original-background-alt flex flex-col">
        {sortedMessages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-original-text-muted/70">No messages yet. Say hi! 👋</p>
          </div>
        ) : (
          sortedMessages.map((msg) => (
            <MessageItem key={msg._id} message={msg} currentUserId={currentUserId} />
          ))
        )}
        <div ref={bottomRef} className="h-1 shrink-0" />
      </div>

      {/* Input */}
      <div className="shrink-0 p-3 bg-original-card border-t border-original-border-light">
        <MessageInput
          onSend={onSend}
          loading={sendLoading}
          replyTo={
            !isStudent && partner
              ? { studentId: partner._id, name: partner.name }
              : null
          }
          onCancelReply={undefined}
        />
      </div>
    </div>
  );
};
