import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LocalStorageData } from '../../Interfaces/interface';
import ProfileCard from './InfoCard';
import { BsThreeDotsVertical } from 'react-icons/bs';
import LeftSidebarContactList from './LeftSidebarContactList';
import { FaSearch } from 'react-icons/fa';
import SearchMenu from './SearchMenu';

const LeftSideBar = () => {
  const navigate = useNavigate()
  const [width, setWidth] = useState<number>(window.innerWidth)
  const {id} = useParams()
  const stringUserData = localStorage.getItem('userData');
  const [userData, setUserData] = useState<LocalStorageData| null>(null); 
  const [showCard, setShowCard] = useState<boolean>(false)
  const [showSearch, setShowSearch] = useState<boolean>(false);
  
  const handleShowSearch = () => {
    setShowSearch(!showSearch)
  }
  
  const handleShowCard = () => {
    setShowCard(!showCard)
  }

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (stringUserData) {
      const parsedUserData:LocalStorageData = JSON.parse(stringUserData);
      setUserData(parsedUserData);
    }else{
      navigate("/login")
    }
  }, [stringUserData]);
  
  return ( 
    <>
    { showCard ? <ProfileCard currentUser = {true} handleShow = {handleShowCard} /> : null}

    <div className={id && width < 640 ? "hidden":" max-sm:w-[100%] h-full sm:w-[50%] backdrop-blur-md shadow-xl  max-lg:w-4/6  border-r border-[#577fee73] bg-white/30 flex flex-col"}>
      {/* Top section with GOSSIP and*/}
      <div className="flex items-center justify-center w-full h-[8vh] 900:h-[9vh] px-4 ">
        <h1 className= " text-[1.4rem] 800:text-[1.7rem] 900:text-3xl bebas text-gray-600 md:tracking-wide " >WHO ARE YOU GOSSIPING WITH ?</h1>
      </div>
      <div onClick={handleShowSearch} className={ showSearch ? 'w-full px-4 py-2 flex gap-2 items-center text-gray-700 hover:bg-white/30  justify-center font-semibold bg-white/50 h-[6vh] ' : 'w-full h-[6vh] px-4 py-2 flex gap-2 items-center  justify-center text-gray-700 font-semibold hover:bg-white/50  transition bg-white/30 ' } > {showSearch ? "Gossip with friends" :  <> Find more friends <FaSearch size={15} className='text-gray-600' /> </> } </div>

      { showSearch ? <SearchMenu/>: <LeftSidebarContactList/> }

      {/* Bottom section with current user */}
      { showSearch ? null :<div className="flex absolute bottom-0 bg-[#212121]  items-center justify-between w-full h-[10vh]  ">
        <div className="flex items-center pl-4">
          <img
            src={userData?.profileImage}
            loading='lazy'
            alt="User"
            className=" w-10 object-cover object-center h-10 border rounded-full mr-3"
          />
          <div className='flex flex-col' >
            <h2 className="font-bold text-gray-100 ">{userData?.username}</h2>
            <p className="text-gray-200  text-[0.7rem] md:text-sm">{userData?.email}</p>
          </div>
        </div>
        <BsThreeDotsVertical onClick={handleShowCard} className="mr-4 text-gray-200 " size={20} /> 
      </div>}
    </div>
  </>

  )
}

export default LeftSideBar