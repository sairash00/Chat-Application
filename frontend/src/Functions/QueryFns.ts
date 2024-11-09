import axios from "axios";
import { ChatsData, ChatsMessageData, DeleteChatIds, IsLoggedInData, LoginData, MessageData, RegisterData, RegisterUserData, RegistrationOtpData, SearchedData, UserData } from "../Interfaces/interface";

export const loginQuery = (data:LoginData) => {
    return axios.post<UserData>(import.meta.env.VITE_LOGIN, data)
}
export const Register = (data:RegistrationOtpData) => {
    return axios.post<UserData>(import.meta.env.VITE_REGISTER, data)
}
export const sendOtp = (data:RegisterData) => {
    return axios.post<RegisterUserData>(import.meta.env.VITE_SEND_OTP, data) 
}
export const getUserChats = () => {
    return axios.get<ChatsData>(import.meta.env.VITE_GET_USER_CHATS)
}
export const getChatMessage = (chatId:string|undefined) => {
    return axios.get<ChatsMessageData>(`${import.meta.env.VITE_GET_CHAT_MESSAGES}/${chatId}`)
}
export const deleteChatFn = (ids:DeleteChatIds) => {
    return axios.post(import.meta.env.VITE_DELETE_CHAT, ids)
}
export const createChat = (id:string) => {
    return axios.post(import.meta.env.VITE_CREATE_CHAT, {userId: id} )
}
export const SendMessage = (data:MessageData) => {
    return axios.post(import.meta.env.VITE_SEND_MESSAGE, data)
}
export const logout = () => {
    return axios.post(import.meta.env.VITE_LOGOUT)
}
export const search = (searchText: string |undefined) => {
    return axios.get<SearchedData>(`${import.meta.env.VITE_SEARCH_USER}?search=${searchText}`)
}
export const addProfile = (img:File) => {
    const formData = new FormData();
    formData.append("image", img); 
    return axios.post<UserData>(import.meta.env.VITE_ADD_PROFILE, formData )
}
export const isLoggedIn = () => {
    return axios.get<IsLoggedInData>(import.meta.env.VITE_IS_LOGGED_IN)
}