import { isValidObjectId } from "mongoose";
import Chat from "../database/models/chat.model.js";
import Message from "../database/models/message.model.js"
import User from "../database/models/user.model.js";

export const createChat = async (req,res) => {
    try {
        const {userId} = req.body; 
        const myId = req.user 

        if(!userId|| !isValidObjectId(userId) || !myId) return res.status(400).json({
            success: false,
            message: "User ID is required"
        })

        const [user1, user2] = await Promise.all([
            User.findById(userId),
            User.findById(myId)
        ]);

        if (!user1 || !user2) {
            return res.status(404).json({
                success: false,
                message: "One or both users not found"
            });
        }

        const chatExists = await Chat.findOne({
            users: {
                $all: [userId, myId]
            }
        });

        if(chatExists) return res.status(409).json({
            success: true,
            message: "Chat already exists with the user",
        })

        const newChat = await Chat.create({
            users: [userId, myId],
        })

        if(!newChat) return res.status(500).json({
            success: false,
            message: "Error creating chat"
        })

        user1.chats.push(newChat._id);
        user2.chats.push(newChat._id);

        await Promise.all([
            user1.save(),
            user2.save()
        ]);

        res.status(201).json({
            success: true,
            message: "Chat created Successfully",
            newChat
        })

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getChat = async (req, res) => {
    try {
        const chatId = req.params.id;
        const userId = req.user;


        if (!chatId || !userId) return res.status(400).json({
            success: false,
            message: "Chat ID is required"
        });

        const chat = await Chat.findById(chatId)
            .populate({
                path: 'users',
                match: { _id: { $ne: userId } },
                select: '-password'
            })
            .populate({
                path: 'messages',
                populate: { 
                    path: 'sender',
                    select: 'username profileImage ' 
                }
            })
            .populate({
                path: 'lastMessage', 
                populate: { 
                    path: 'sender',
                    select: 'username' 
                }
            });


        if (!chat || !chat.users.length) return res.status(404).json({
            success: false,
            message: "Chat not found"
        });

        return res.status(200).json({
            success: true,
            message: "Chat retrieved successfully",
            chat
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUserChat = async (req,res) => {
    try {
        const userId = req.user;
        
        const user = await User.findById(userId)
            .populate({
                path: 'chats',
                select: 'users',
                populate: [
                    {
                      path: 'users',
                      match: { _id: { $ne: userId } },
                      select: 'username profileImage'
                    },
                    {
                      path: 'lastMessage',
                      select: 'content',
                    }
                ]
            })


        if(!user) return res.status(404).json({
            success: false,
            message: "user not found"
        })

        const chats = user.chats.map((chat) => chat)

        if(chats.length === 0) return res.status(200).json({
            success: true,
            message: "No chats found"
        })

        res.status(200).json({
            success: true,
            message: "Chats retrieved successfully",
            chats
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteChat = async (req, res) => {
    try {
        const { chatId, userId } = req.body;
        const myId = req.user;

        if (!chatId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Chat ID and User ID are required"
            });
        }

        const [user1, user2] = await Promise.all([
            User.findById(userId),
            User.findById(myId)
        ]);

        if (!user1 || !user2) {
            return res.status(404).json({
                success: false,
                message: "One or both users not found"
            });
        }

        user1.chats.pull(chatId);
        user2.chats.pull(chatId);

        await Promise.all([
            user1.save(),
            user2.save()
        ]);

        const chat = await Chat.findByIdAndDelete(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        const deletedMessages = await Message.deleteMany({ chat: chatId });

        res.status(200).json({
            success: true,
            message: "Chat and messages deleted successfully",
            deletedMessagesCount: deletedMessages.deletedCount, 
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const {content, chatId} = req.body
        const senderId = req.user

        if(!content || !chatId || !senderId) return res.status(400).json({
            success: false,
            message: "Message, chat ID and sender ID are required"
        })

        const message = await Message.create({
            chat: chatId,
            sender: senderId,
            content
        })

        const chat = await Chat.findOne({
            _id: chatId,
            users: senderId 
        })

        if(!chat) return res.status(404).json({
            success: false,
            message: "Chat not found"
        })

        chat.messages.push(message._id)
        chat.lastMessage = message._id
        const newChat = await chat.save()

        res.status(201).json({
            success: true,
            message: "Message sent successfully", 
            message,
            newChat
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
} 

export const sendMessageSocket = async ({ content, chatId, senderId }) => { 
    try {
      if (!content || !chatId || !senderId) {
        return {
          success: false,
          message: "Message, chat ID, and sender ID are required",
        };
      }
  
      const message = await Message.create({
        chat: chatId,
        sender: senderId,
        content,
      });
  
      const chat = await Chat.findOne({ _id: chatId, users: senderId })
      .populate({
        path: 'users',
        match: { _id: senderId },
        select: 'profileImage', 
      });
  
      if (!chat) {
        return {
          success: false,
          message: "Chat not found or sender not a participant",
        };
      }
  
      chat.messages.push(message._id);
      chat.lastMessage = message._id;
      const newChat = await chat.save();
  
      return {
        success: true,
        message: "Message sent successfully",
        messageData: message,
        updatedChat: newChat,
      };
  
    } catch (error) {
      return {
        success: false,
        message: `Error sending message: ${error.message}`,
      };
    }
};
  