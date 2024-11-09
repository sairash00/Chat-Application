import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react'
import { PulseLoader } from 'react-spinners'
import { getUserChats } from '../../Functions/QueryFns';
import showToast from '../../Functions/CustomToast';
import { useChats } from '../../contexts/ChatContext';
import { Link } from 'react-router-dom';

const LeftSidebarContactList = () => {
    const {chats, setChats, chatsRefetcher} = useChats()

    const { data, isError, isLoading, error, refetch} = useQuery({
        queryKey: ["getUserChats"],
        queryFn: getUserChats,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: true
      });
    
      useEffect(() => {
        if (isError && error instanceof Error) {
          showToast("Couldn't get chats", "error");
        }
        if(data?.data?.chats){
          setChats(data?.data?.chats)
        }
        
      }, [isError, error, data]);

      useEffect(() => {
        refetch()
      },[chatsRefetcher])


  return (
    <div className='h-[75vh] flex items-center flex-col scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#577fee75] '>
        {/* Middle section with contact list */}
        {isLoading ? (
            <PulseLoader size={10} className="self-center mt-5" color="#212121" />
          ) : isError ? (
            <p className="text-center text-red-500 mt-5">Failed to load chats. Please try again.</p>
          ) : !chats || chats.length === 0 ? (
            <p className="text-center font-semibold text-gray-900 mt-5">No chats found.</p>
          ) : (
            <ul className="flex-1 w-full overflow-y-auto">
              {chats.map((chat) => (
                <Link
                  to={`/chat/${chat?._id}`}
                  key={chat?._id}
                  className="flex w-full justify-between border-b transition lg:py-3 py-2 px-3 md:px-5 hover:bg-white/30 border-[#577fee73] items-center"
                >
                  <div className="flex gap-2 md:gap-4 items-center">
                    <img className="lg:w-14 lg:h-14 w-10 h-10 rounded-full object-cover object-center border-gray-200 border " src={chat?.users?.[0].profileImage}  />
                    <div>
                      <h2 className="font-bold 1k:text-lg ">{ chat?.users?.[0].username }</h2>
                      <p className="text-gray-700 text-[0.75rem] 1k:text-md 350:text-sm 1k:font-semibold"> {chat?.lastMessage ? chat.lastMessage.content : "Start a conversation."} </p>
                    </div>
                  </div>
                </Link>
              ))}
            </ul>
          )}
    </div>
  )
}

export default LeftSidebarContactList