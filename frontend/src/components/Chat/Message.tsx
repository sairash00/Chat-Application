import { useSocket } from "../../contexts/SocketContext";
import showToast from "../../Functions/CustomToast";
import { Messages } from "../../Interfaces/interface";
import { useEffect, useState, useCallback } from "react";
import { PulseLoader } from "react-spinners";

interface Props {
  message: Messages;
  userId: string | undefined;
  chatId: string;
}

interface MessageData {
  chatId: string;
  messageId: string;
}

const MessageBox = ({
  message,
  chatId,
  userId,
}: Props) => {

  const isCurrentUser = message.sender._id === userId;
  const socket = useSocket();
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const [deleted, setDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteShow = () => {
    setShowDelete(!showDelete)
  };

  // Message data to send to the backend
  const messageData: MessageData = {
    chatId,
    messageId: message._id,
  };

  // Handle delete click
  const handleDelete = () => {
    if (isDeleting) return; // Prevent multiple delete requests
    setIsDeleting(true);
    socket?.emit("delete_message", messageData);
  };

  // UseCallback to ensure consistent reference for the socket listener
  const handleMessageDeleted = useCallback(
    (data: { messageId: string }) => {
      if (data.messageId === message._id) {
        setDeleted(true); // Mark the message as deleted
        setIsDeleting(false); // Stop the loader
        showToast("Message Deleted", "success");
      }
    },
    [message._id]
  );

  useEffect(() => {
    socket?.on("messageDeleted", handleMessageDeleted);

    // Cleanup listener on unmount
    return () => {
      socket?.off("messageDeleted", handleMessageDeleted);
    };
  }, [socket, handleMessageDeleted]);

  // Render the message content or loader
  return (
    <div
      onClick={isCurrentUser ? handleDeleteShow : undefined}
      className={`flex ${
        isCurrentUser
          ? "justify-end mt-[0.3rem]"
          : "justify-start mt-[0.5rem] items-end gap-1 sm:gap-2"
      }`}
    >
      {!isCurrentUser && (
        <img
          src={message.sender.profileImage}
          className="w-4 h-4 rounded-full"
          alt="Sender's profile"
        />
      )}
      <div
        className={deleted ? "hidden" : `font-semibold max-w-[50%] leading-tight py-[0.3rem] text-[0.75rem] sm:text-sm 900:text-md px-2 rounded-xl ${
          isCurrentUser && showDelete
            ? "bg-red-600 text-white rounded-br-none"
            : isCurrentUser
            ? "bg-white text-black rounded-br-none"
            : "bg-blue-600 text-white rounded-bl-none"
        }`}
      >
        {isDeleting ? (
          <PulseLoader size={6} color="#ffffff" />
        ) : isCurrentUser && showDelete ? (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering handleDeleteShow
              handleDelete();
            }}
            className="text-white font-bold"
          >
            Delete
          </button>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
};

export default MessageBox;
