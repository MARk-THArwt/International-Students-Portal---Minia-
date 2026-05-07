import type { Message, MessageUser } from "../../../store/slices/messagesSlice";

export const extractUniqueStudents = (messages: Message[]): MessageUser[] => {
  const usersMap = new Map<string, MessageUser>();

  messages.forEach((msg) => {
    // 1. Check sender
    if (typeof msg.sender === "object" && msg.sender.role === "student") {
      usersMap.set(msg.sender._id, msg.sender);
    }
    
    // 2. Check receiver if it's populated
    if (typeof msg.receiver === "object" && msg.receiver.role === "student") {
      if (!usersMap.has(msg.receiver._id)) {
        usersMap.set(msg.receiver._id, msg.receiver);
      }
    }
  });

  return Array.from(usersMap.values());
};

/**
 * Filters messages for a specific user and sorts them by createdAt ASC.
 * Includes messages where user is sender OR receiver.
 * Used for Staff/Admin view to see full conversation with a student.
 */
export const filterMessagesForUser = (messages: Message[], userId: string): Message[] => {
  return messages
    .filter((msg) => {
      const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
      const receiverId = typeof msg.receiver === "object" ? msg.receiver?._id : msg.receiver;
      
      return senderId === userId || receiverId === userId;
    })
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

/**
 * Filters messages for a student - only messages where student is the SENDER.
 * Uses sender._id === currentUserId (strict ID match, NOT role-based).
 * Sorts from oldest → newest without mutating the original array.
 */
export const filterStudentSentMessages = (messages: Message[], currentUserId: string): Message[] => {
  return [...messages]
    .filter((msg) => {
      const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
      return senderId === currentUserId;
    })
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};
