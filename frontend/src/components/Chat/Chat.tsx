
import LeftSideBar from './LeftSideBar';
import RightChatBox from './RightChatBox';

const Chat = () => {
  
  return (
    <div className="flex bg-gradient-to-r w-[100vw]  from-[#6178f9c8] via-[#AEE3F9] to-[#6178f981] h-screen">
      {/* Left Sidebar */}
        <LeftSideBar/>
      {/* Right Chatbox */}
        <RightChatBox/>
    </div>
  );
};

export default Chat;
