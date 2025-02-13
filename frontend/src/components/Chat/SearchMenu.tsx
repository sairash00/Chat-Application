import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { search } from "../../Functions/QueryFns";
import { PulseLoader } from "react-spinners";
import SearchedUserCard from "./SearchedUserCard";

const SearchMenu = () => {
  // Initialize searchText as an empty string
  const [searchText, setSearchText] = useState<string>("");
  

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
      <div className="h-[6vh] mb-2 w-full flex items-center px-6 justify-between bg-transparen border-b border-black ">
        <input
          type="text"
          onChange={handleSearch}
          value={searchText}
          className="w-full bg-transparent text-center text-gray-700 placeholder:text-gray-700 focus:outline-none py-2 text-md px-1"
          placeholder={`Enter friend's username`}
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
            <SearchedUserCard user = {user} />
          ))
        )}
      </div>
    </>
  );
};

export default SearchMenu;
