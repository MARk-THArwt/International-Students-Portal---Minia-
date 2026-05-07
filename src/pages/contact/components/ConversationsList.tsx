import type { Conversation } from "../../../store/slices/messagesSlice";
import { ConversationItem } from "./ConversationItem";

interface ConversationsListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (conv: Conversation) => void;
  loading: boolean;
  title?: string;
}

export const ConversationsList = ({
  conversations,
  selectedId,
  onSelect,
  loading,
  title = "Messages",
}: ConversationsListProps) => {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden h-full md:h-[500px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <h3 className="m-0 text-base font-bold text-[#002147]">{title}</h3>
        <p className="m-0 text-xs text-gray-400 mt-0.5">
          {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center text-sm text-gray-400">Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">No conversations found.</div>
        ) : (
          <ul className="list-none p-0 m-0">
            {conversations.map((conv) => (
              <li key={conv.with._id}>
                <ConversationItem
                  conversation={conv}
                  isSelected={selectedId === conv.with._id}
                  onClick={() => onSelect(conv)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
