import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { createChat, search } from "../../Functions/QueryFns";
import { PulseLoader } from "react-spinners";
import showToast from "../../Functions/CustomToast";
import axios from "axios";
import { useChats } from "../../contexts/ChatContext";

const SearchMenu = () => {
  // Initialize searchText as an empty string
  const [searchText, setSearchText] = useState<string>("");
  const {setChatsRefetcher} = useChats()

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["searchUser", searchText],
    queryFn: ({ queryKey }) => search(queryKey[1]),
    staleTime: Infinity,
    enabled: !!searchText && searchText.length > 0, 
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Handle input change for search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchText(e.target.value); 
  };

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

  useEffect(() => {
    // Trigger search after debounce
    if (searchText && searchText.length > 0) {
      const delayDebounceFn = setTimeout(() => {
        refetch(); 
      }, 800);

      return () => clearTimeout(delayDebounceFn); 
    }
  }, [searchText, refetch]);

  return (
    <>
      <div className="h-[6vh] mb-2 w-full flex items-center px-6 justify-between bg-gray-700 ">
        <input
          type="text"
          onChange={handleSearch}
          value={searchText}
          className="w-full bg-transparent text-center text-gray-200 placeholder:text-gray-200 focus:outline-none py-2 text-md px-1"
          placeholder={`Search User`}
        />
      </div>
      <div className="overflow-y-auto h-[69vh] w-full flex flex-col items-center scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#577fee75]">
        {!searchText ? (
          <p className="text-center bebas text-2xl tracking-wide text-gray-900 mt-5">
            Search for friends to gossip.
          </p>
        ) : isLoading ? (
          <PulseLoader size={10} className="mt-5" color="#212121" />
        ) : isError ? (
          <p className="text-center text-red-500 mt-5">Something went wrong!</p>
        ) : !data?.data.users || data?.data.users.length === 0 ? (
          <p className="text-center font-semibold text-gray-900 mt-5">
            User not found.
          </p>
        ) : (
          data?.data.users.map((user) => (
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
          ))
        )}
      </div>
    </>
  );
};

export default SearchMenu;
