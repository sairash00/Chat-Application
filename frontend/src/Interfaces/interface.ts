

export interface SignUp {
  signUp: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}
export interface RegisterData {
  email: string;
  password: string;
  username: string;
}

export interface RegistrationOtpData extends RegisterData {
  otp: number | null;
  encryptedOtp: string;
}

export interface UserData {
  success: boolean;
  user: {
    _id: string;
    username: string;
    email: string;
    lastSeen: string;
    profileImage: string;
  };
}

export interface RegisterUserData {
  success: boolean;
  message: string;
  user: {
    email: string;
    password: string;
    username: string;
    encryptedOtp: string;
  };
}

export interface LocalStorageData {
  email: string;
  lastSeen: string;
  loggedIn: string;
  profileImage: string;
  username: string;
  _id: string;
}
// Define the shape of the context

export interface ChatUser{
  _id: string;
  users:[{
    _id: string,
    username:string,
    profileImage: string
  }],
  lastMessage?:{
    _id: string,
    content: string
  }
}

export interface ChatUserWithMessage extends ChatUser{
  messages:[{
    _id: string,
    content: string,
    sender: {
      _id: string,
      profileImage: string
    }
  }]
}

export interface Messages {
    _id: string,
    content: string,
    sender: {
      _id: string,
      profileImage: string
    }
}


export interface ChatContextType {
  chats: ChatUser[];
  setChats: React.Dispatch<React.SetStateAction<ChatUser[]>>;
  chatsRefetcher: number,
  setChatsRefetcher: React.Dispatch<React.SetStateAction<number>>;
  showChats: boolean,
  setShowChats: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ChatsData{
  success: boolean; 
  message: string;
  chats?: ChatUser[]
}

export interface ChatsMessageData{
  success: boolean;
  message: string;
  chat: ChatUserWithMessage
}

export interface User {
  _id: string | undefined
  profileImage: string | undefined
  username: string | undefined
}

export interface DeleteChatIds {
  userId: string | undefined
  chatId: string | undefined
}
export interface MessageData{
  chatId: string | undefined
  content: string | undefined
  senderId: string | undefined
}

export interface SearchedUser {
  _id: string;
  username: string,
  profileImage: string,
  email: string
}

export interface SearchedData {
  success: boolean,
  users: SearchedUser[]
}

export interface IsLoggedInData {
  success: boolean
}