import { useMutation } from "@tanstack/react-query"
import { PulseLoader } from "react-spinners"
import { createChat } from "../../Functions/QueryFns"
import showToast from "../../Functions/CustomToast"
import { useChats } from "../../contexts/ChatContext"
import axios from "axios"
import { IoAdd } from "react-icons/io5";


interface Props {
    user: {
    _id: string,
    profileImage: string,
    username: string,
    email: string}
}

const SearchedUserCard = ({user}:Props) => {

    const {setChatsRefetcher} = useChats()
    const {mutate, status} = useMutation({
        mutationFn: createChat,
        onSuccess: (_) => {
          showToast("New chat Created", "success")
          setChatsRefetcher(1)
        },
        onError: (error) => {
          if(axios.isAxiosError(error)) {
    
            if(error.response?.status === 409) return showToast("Chat already exists", "error");
            if(error.response?.status === 404) return showToast("User not found", "error");
          }
          showToast("Error creating chat", "error")
        }
      })
    
      const createChatFn = (userId:string) => {
        if(!userId) return showToast("Invalid Credentials", "error");
        mutate(userId)
      }

  return (
    <div
              key={user._id} 
              className="w-full flex justify-between items-center border-b py-3 px-5 border-[#577fee73]"
            >
              <div className="flex gap-4 items-center">
                <img
                  className="w-10 h-10 rounded-full object-cover object-center border-gray-200 border"
                  src={user.profileImage}
                  alt={user.username}
                />
                <div>
                  <h2 className="font-bold text-gray-700 text-lg ">
                    {user.username}
                  </h2>
                  <p className="text-gray-900 text-sm">{user.email}</p>
                </div>
              </div>
              { status === 'pending' ? <PulseLoader size={6} color="#212121" /> : <IoAdd
               onClick={() => createChatFn(user._id)}
                size={30}
                title="Create Chat"
                className="hover:text-gray-700 transition"
              />}
            </div>
  )
}

export default SearchedUserCard