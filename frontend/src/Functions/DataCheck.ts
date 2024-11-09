import { LoginData, RegisterData, RegistrationOtpData } from "../Interfaces/interface";

export const verifyLoginData = (data:LoginData):LoginData | string => {
    if(!data.email) return "E-mail is required ";
    if(!data.password) return "Password is required";
    if(data.password.length < 8) return "Password must at least be 8 Characters"
    
    return data
}
export const verifyRegisterData = (data:RegisterData):RegisterData | string => {
    if(!data.email) return "E-mail is required";
    if(!data.username) return "Username is required";
    if(data.username.length < 8) return "Username must be at least 8 characters"
    if(!data.password) return "Password is required";
    if(data.password.length < 10) return "Password must at least be 10 Characters"
    
    return data
}
export const verifyRegistrationOtpData = (data:RegistrationOtpData):RegistrationOtpData | string => {
    if(!data.email) return "Invalid Credentials, Try again";
    if(!data.username) return "Invalid Credentials, Try again";
    if(data.username.length < 8) return "Invalid Credentials, Try again"
    if(!data.password) return "Invalid Credentials, Try again";
    if(data.password.length < 10) return "Invalid Credentials, Try again"
    if(!data.otp) return "Otp is required"
    if(data.otp.toString().length !== 5) return "Invalid Otp, Try again"
    if(!data.encryptedOtp) return "Fatal error, Try again later"
    return data
}
