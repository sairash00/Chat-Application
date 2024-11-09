import { createContext, useState, useContext, ReactNode} from 'react';
import { ChatUser, ChatContextType} from '../Interfaces/interface.ts';


// Create the chat context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create a provider component
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<ChatUser[]>([]);
  const [chatsRefetcher, setChatsRefetcher] = useState<number>(0)
  const [showChats, setShowChats] = useState<boolean>(true)

  return (
    <ChatContext.Provider value={{ chats, setChats, chatsRefetcher, setChatsRefetcher, showChats, setShowChats}}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use chat context
export const useChats = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChats must be used within a ChatProvider');
  }
  return context;
};
