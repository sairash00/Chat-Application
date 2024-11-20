import { FaPaperPlane } from "react-icons/fa";
import showToast from "../../Functions/CustomToast";
import { useEffect, useState } from "react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useQuery } from "@tanstack/react-query";
import { getChatMessage } from "../../Functions/QueryFns";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { LocalStorageData, MessageData, Messages, User } from "../../Interfaces/interface";
import ScrollableFeed from "react-scrollable-feed";
import ProfileCard from "./InfoCard";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSocket } from "../../contexts/SocketContext";
import { useChats } from "../../contexts/ChatContext";
import { IoArrowBack } from "react-icons/io5";
import MessageBox from "./message";

const RightChatBox = () => { 
  const socket = useSocket();
  const { setChatsRefetcher, chatsRefetcher } = useChats();
  const [otherUser, setOtherUser] = useState<User | undefined>();
  const navigate = useNavigate();
  const [sending, setSending] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false);
  const stringUserData = localStorage.getItem('userData');
  const [userData, setUserData] = useState<LocalStorageData | null>(null);
  const [showCard, setShowCard] = useState<boolean>(false);
  const { id } = useParams();
  const [typing, setTyping] = useState({
    typing: false,
    userId: ""
  });
  const [messages, setMessages] = useState<Messages[]>([]);
  const [width, setWidth] = useState<number>(window.innerWidth)
  const [messageData, setMessageData] = useState<MessageData>({
    content: "",
    chatId: "",
    senderId: ""
  });

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (userData && id) {
      setMessageData((prev) => ({
        ...prev,
        chatId: id,
        senderId: userData._id,
      }));
    }
  }, [userData, id]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageData({ ...messageData, content: e.target.value });
    socket?.emit("typing", {id, senderId: userData?._id})
  };

  const handleShowCard = () => {
    setShowCard(!showCard);
  };

  useEffect(() => {
    if (stringUserData) {
      const parsedUserData: LocalStorageData = JSON.parse(stringUserData);
      setUserData(parsedUserData);
    } else {
      navigate("/login");
    }
  }, [stringUserData, navigate]);

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["getChatMessage", id],
    queryFn: ({ queryKey }) => getChatMessage(queryKey[1]),
    staleTime: 30000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    enabled: !!id,  // Only fetch if `id` is present
  });

  useEffect(() => {
    if (data?.data.chat.messages) setMessages(data?.data.chat.messages);
    setOtherUser({
      _id: data?.data.chat.users[0]._id,
      username: data?.data.chat.users[0].username,
      profileImage: data?.data.chat.users[0].profileImage,
    });
  }, [data]);

  useEffect(() => {
    socket?.emit("join_room", id);

    socket?.on("receive_message", (newMessage: Messages) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setSending(false)
    });

    socket?.on("isTyping",(id) => {
      setTyping({
        typing: true,
        userId: id,
      })

    })

    socket?.on("stopTyping",() => {
      setTyping({
        typing: false,
        userId: "",
      })
    })

    return () => {
      socket?.off("receive_message");
      socket?.off("isTyping")
    };
  }, [socket, id]);

  useEffect(() => {
    setChatsRefetcher(chatsRefetcher + 1);
  }, [messages]);

  const handleMessageSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!messageData.chatId || !messageData.content || !messageData.senderId) return showToast("Write something.", "error");
    if (messageData.content.length > 100) return showToast("Message too long.", "error");
    socket?.emit("send_message", messageData);
    setSending(true)
    setMessageData({ ...messageData, content: "" });
    setLoading(false);
  };

  useEffect(() => {
    if (isError && error instanceof Error) {
      showToast(error.message || "Something went wrong, reload the page.", "error");
    }
  }, [isError, error]);

  

  return (
    <>
      {showCard ? <ProfileCard chatId={id} otherUser={otherUser} currentUser={false} handleShow={handleShowCard} /> : null}
      
      <div className= { id && width < 640 ? " w-full flex flex-col h-full" : "max-sm:hidden sm:w-2/3 max-lg:w-full flex flex-col h-full" }>
        {!id ? (
          <div className="flex justify-center w-full text-center px-3 items-center h-full text-gray-500 font-semibold">
            <p className="bebas text-3xl text-[#212121] tracking-wide " >Start gossiping with friends by clicking on the chats.</p>
          </div>
        ) : (
          <>
            {/* Top bar with chat contact name and options */}
            <div className="flex justify-between shadow-lg shadow-black/5 items-center w-full h-[10vh] bg-white/30 backdrop-blur-md">
              <div className="flex items-center justify-center gap-2 sm:gap-3 py-1 px-1 sm:px-4">
                {width < 640 ? <Link to={"/chat"} ><IoArrowBack size={20} /></Link>: <></>}
                {isLoading ? (
                  <Skeleton height={40} width={40} highlightColor="#577fee70" circle baseColor="#577fee70" />
                ) : (
                  <img src={otherUser?.profileImage} className="max-900:w-8 max-900:h-8 object-cover w-10 ml-1 h-10 rounded-full bg-gray-600" />
                )}
                {isLoading ? (
                  <Skeleton height={25} width={100} highlightColor="#577fee70" baseColor="#577fee70" />
                ) : (
                  <span className="text-lg font-semibold">{typing.typing && typing.userId !== userData?._id ? "typing..." : otherUser?.username}</span>
                )}
              </div>
              <BsThreeDotsVertical onClick={handleShowCard} className="mr-4" size={20} />
            </div>

            {/* Chat messages */}
            <ScrollableFeed forceScroll className=" px-1 sm:px-4 scrollbar-thin scrollbar-thumb-[#577fee44] scrollbar-track-transparent py-2 ">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <PulseLoader size={12} className="self-center mt-5" color="#212121" />
                </div>
              ) : isError ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-red-500">Couldn't load messages.</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500 font-semibold">Start a conversation.</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <MessageBox
                  key={index}
                  message={message}
                  userId={userData?._id}
                  chatId = {id}
                  />
                ))
              )}
            </ScrollableFeed>

            {/* Message input bar */}
            <form onSubmit={handleMessageSend} className="flex items-end py-3 px-2 border-t gap-3 w-full bg-white/50 backdrop-blur-sm">
              <input
                type="text"
                onChange={handleMessageChange}
                value={messageData.content}
                className="flex-1 px-2 text-lg bg-transparent border-b border-[#577fee] text-black font-semibold tracking-wide focus:outline-none"
                placeholder="Say something..."
              />
              {sending ? <PulseLoader size={4}  /> :<button type="submit" disabled={loading || messageData.content?.length === 0}>
                <FaPaperPlane className="text-2xl text-blue-700 hover:text-[#577fee] transition cursor-pointer" />
              </button>}
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default RightChatBox;
