import User from "../database/models/user.model.js"
import { verifyToken } from "../utils/jwt.js"

export const authenticate = async (req, res, next) => {
    try {

        const token = req.cookies?.accessToken
        const verifiedToken = verifyToken(token)
        
        if(!verifiedToken.success){
            return res.status(401).json({
                success: false,
                message: "Token is not valid"
            })
        }

        const user = await User.findById({_id: verifiedToken.id}).select("-password");

        if(!user) return res.status(404).json({
            success: false,
            message: "User not found"
        })

        req.user = user._id
        next()
    
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}