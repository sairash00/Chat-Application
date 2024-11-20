import { ChangeEvent, useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineLogout } from "react-icons/ai";
import { MdOutlineAddAPhoto, MdOutlineCloudUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  DeleteChatIds,
  LocalStorageData,
  User,
} from "../../Interfaces/interface";
import { IoTrashBin } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { addProfile, deleteChatFn, logout } from "../../Functions/QueryFns";
import showToast from "../../Functions/CustomToast";
import { handleError } from "../../Functions/FetchErrorHandler";
import { PulseLoader } from "react-spinners";
import { useChats } from "../../contexts/ChatContext";
import 'react-loading-skeleton/dist/skeleton.css'


interface Props {
  handleShow: () => void;
  currentUser: boolean;
  otherUser?: User;
  chatId?: string;
}

const ProfileCard = ({ handleShow, chatId, currentUser, otherUser }: Props) => {
  const { chats, setChats } = useChats();
  const navigate = useNavigate();
  const stringUserData = localStorage.getItem("userData");
  const [userData, setUserData] = useState<LocalStorageData | null>(null);
  const [img, setImg] = useState<File | null>(null);

  const removeChat = (chatId: string) => {
    setChats(() => chats.filter((chat) => chat._id !== chatId));
  };

  const [ids, _setIds] = useState<DeleteChatIds>({
    userId: otherUser?._id,
    chatId: chatId,
  });

  useEffect(() => {
    if (stringUserData) {
      const parsedUserData: LocalStorageData = JSON.parse(stringUserData);
      setUserData(parsedUserData);
    } else {
      navigate("/login");
    }
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setImg(selectedFile);
    }
  };

  // const handleClickAnywhere = (e: React.MouseEvent<HTMLDivElement>) => {
  //   // e.stopPropagation();
  //   e.preventDefault();
  // };

  const { mutate, status } = useMutation({
    mutationFn: deleteChatFn,
    onSuccess: async (_) => {
      showToast("Chat Deleted", "success");
      handleShow()
      chatId ? removeChat(chatId) : null;
      navigate("/chat");
    },
    onError: (error) => {

      const errorMessage = handleError(error);
      showToast(errorMessage, "error");
    },
  });

  const deleteChat = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!ids.chatId || !ids.userId) return showToast("Invalid Action", "error");
    mutate(ids);
  };

  const { mutate: logoutFn, status: logoutStatus } = useMutation({
    mutationFn: logout,
    onSuccess: (_) => {
      showToast("Logged Out", "success");
      localStorage.removeItem("userData"), navigate("/login");
    },
    onError: (error) => {
      const errorMessage = handleError(error);
      showToast(errorMessage, "error");
    },
  });

  const { mutate: ProfileFn, status: ProfileStatus } = useMutation({
    mutationFn: addProfile,
    onSuccess: (data) => {
      showToast("Profile picture updated", "success");
      setImg(null)
      setUserData( userData && {...userData, profileImage: data?.data.user.profileImage})
      localStorage.setItem("userData", JSON.stringify({
        ...userData,
        profileImage: data?.data.user.profileImage
      }))
    },
    onError: (_) => {
      showToast("Couldn't update profile", "error");
    },
  });

  const handleProfileUpload = async (
    e: React.MouseEvent<SVGElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!img) return showToast("Select a image", "error");
    ProfileFn(img);
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logoutFn();
  };

  return (
    <div
      // onClick={handleShow}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md z-50"
    >
      <div
        // onClick={handleClickAnywhere}
        className="relative bg-gradient-to-r from-[#818dcfc8] via-[#aee2f9] to-[#9faeff81] rounded-3xl w-full max-w-md p-8 shadow-lg"
      >
        {/* Close Button */}
        <button
          onClick={handleShow}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition"
        >
          <AiOutlineClose size={24} />
        </button>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <a
              href={
                currentUser ? userData?.profileImage : otherUser?.profileImage
              }
              target="_blank"
            >
               <img
                src={
                  currentUser
                    ? userData?.profileImage || "/unknown.jpg"
                    : otherUser?.profileImage || "/unknown.jpg"
                }
                alt="Profile"
                loading="lazy"
                rel="noopener noreferrer"
                className="w-[9rem] h-[9rem] rounded-full object-cover shadow-lg"
              />
            </a>
            {currentUser && (
              <>
                <label
                  htmlFor="file-upload"
                  className="absolute bottom-1 right-2  cursor-pointer"
                >
                  {ProfileStatus === 'pending' ? (
                    <div className="rounded-full p-1 bg-white/80">
                      <PulseLoader size={5} color="#577fee" />
                    </div>
                  ) : (
                      img ? (
                      <MdOutlineCloudUpload
                        size={25}
                        onClick={handleProfileUpload}
                        className="text-white hover:bg-green-600 transition-all bg-green-500 p-1 rounded-full cursor-pointer"
                      />
                    ) : (
                      <MdOutlineAddAPhoto
                        size={25}
                        className="text-black hover:bg-gray-200 transition bg-white p-1 rounded-full"
                      />
                    )
                  )}

                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
            )}
            {/* <MdOutlineAddAPhoto size={20} /> */}
          </div>
        </div>

        {/* User Info */}
        <div className="text-center">
          <h2
            className={
              currentUser
                ? "text-xl font-bold  text-gray-800"
                : "text-2xl capitalize font-bold  text-gray-800"
            }
          >
            {currentUser
              ? userData?.username
              : otherUser?.username || "Unknown"}
          </h2>
          {currentUser ? (
            <p className="text-gray-600 font-semibold ">
              {userData?.email || "Unknown"}
            </p>
          ) : (
            <p className="text-gray-600 font-semibold ">
              {"Chat_Id : " + chatId || "Unknown"}
            </p>
          )}
        </div>

        {/* Logout Button */}
        {currentUser ? (
          <div className="flex justify-center mt-4 ">
            {logoutStatus === "pending" ? (
              <PulseLoader size={15} className="mt-2" color="red" />
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-all flex items-center space-x-2"
              >
                <AiOutlineLogout size={20} />
                <span>Logout</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex justify-center mt-4 ">
            {status === "pending" ? (
              <PulseLoader size={15} className="mt-2" color="red" />
            ) : (
              <button
                onClick={deleteChat}
                className="bg-red-600  text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-all flex items-center space-x-2"
              >
                <IoTrashBin size={20} />
                <span>Delete Chat</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
