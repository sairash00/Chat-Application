import { sendMessageSocket } from "./src/controller/chat.controller.js";

export const socketHandleer = (io) => {
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
      
        socket.on("join_room", (id) => {
          socket.join(id);
          console.log(`User ${socket.id} joined room: ${id}`);
        });
      
        socket.on("send_message", async (data) => {
          const {chatId, senderId, content} = data
          try {
            const response = await sendMessageSocket({chatId, senderId, content});
      
            if (response.success) {
                io.to(chatId).emit("receive_message", {
                content: response.messageData.content,
                _id:response.updatedChat._id,
                sender: {
                    _id: senderId,
                    profileImage: response.updatedChat.users[0].profileImage
                }
              });

            } else {
              console.error(response.message);
            }
          } catch (error) {
            console.error("Error in send_message handler:", error.message);
          }
        });
      
        socket.on("disconnect", () => {
          console.log("User disconnected:", socket.id);
        });
      });
      
}