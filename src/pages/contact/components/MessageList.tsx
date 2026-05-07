import { useEffect, useMemo, useRef } from "react";
import type { Message } from "../../../store/slices/messagesSlice";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  currentUserRole?: string;
  loading?: boolean;
  onReply?: (studentId: string, studentName: string) => void;
}

export const MessageList = ({ messages, currentUserId, currentUserRole, loading, onReply }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Sort messages by createdAt ASC (oldest → newest) without mutating the original array
  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-2 rounded-t-xl border border-gray-200 border-b-0 h-[400px]">
      {loading && sortedMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 font-medium">Loading messages...</p>
        </div>
      ) : sortedMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 font-medium">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        sortedMessages.map((msg) => (
          <MessageItem
            key={msg._id}
            message={msg}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
            onReply={onReply}
          />
        ))
      )}
      {/* Invisible anchor element to auto-scroll to */}
      <div ref={bottomRef} className="h-1" />
    </div>
  );
};
