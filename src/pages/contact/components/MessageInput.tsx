import { useState } from "react";
import type { KeyboardEvent } from "react";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

interface ReplyTo {
  studentId: string;
  name: string;
}

interface MessageInputProps {
  onSend: (text: string) => void;
  loading?: boolean;
  replyTo?: ReplyTo | null;
  onCancelReply?: () => void;
}

export const MessageInput = ({ onSend, loading, replyTo, onCancelReply }: MessageInputProps) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || loading) return;
    onSend(text);
    setText("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full bg-original-card border border-original-border rounded-xl overflow-hidden shadow-sm flex flex-col">
      {replyTo && (
        <div className="bg-original-background-alt text-original-primary px-3 py-2 flex items-center justify-between border-b border-original-border-light">
          <span className="text-xs text-original-primary-hover font-medium">
            Replying to <span className="font-bold">{replyTo.name}</span>
          </span>
          <button
            onClick={onCancelReply}
            className="text-original-primary hover:text-original-primary-hover bg-transparent border-none cursor-pointer p-0 flex items-center"
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      )}
      <div className="flex items-center p-2 gap-2">
        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-original-text placeholder-original-text-muted/50"
          placeholder={replyTo ? "Write a reply..." : "Type your message..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || loading}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
            !text.trim() || loading
              ? "bg-original-background-alt text-original-text-muted/70 cursor-not-allowed"
              : "bg-original-primary text-white hover:bg-original-primary-active shadow-md"
          } border-none cursor-pointer`}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-original-border-light border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <SendIcon sx={{ fontSize: 18 }} />
          )}
        </button>
      </div>
    </div>
  );
};
