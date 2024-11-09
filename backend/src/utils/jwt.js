import jwt from 'jsonwebtoken'


export const generateToken = (email, id) => {
    const token = jwt.sign({email,id}, process.env.JWT_SECRET)
    return token;
}

export const verifyToken = (token) => {
    try {
        if(!token) return {
            success: false,
            message: "No token available"
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    
        if(!decodedToken || !decodedToken.email || !decodedToken.id) return {
            success: false,
            message: "Invalid token"
        }
    
        return {
            success: true,
            id: decodedToken.id,
            email: decodedToken.email
        }
    } catch (error) {
        return {
            success: false,
            message: "Token authorization error"
        }
    }
}

export const encryptOTP = (otp) => {
    const encryptedOtp = jwt.sign(otp, process.env.JWT_SECRET)
    return encryptedOtp;
}

export const verifyOtp = (otp) => {
    const decryptedOtp = jwt.verify(otp, process.env.JWT_SECRET)
    return parseInt(decryptedOtp);
}