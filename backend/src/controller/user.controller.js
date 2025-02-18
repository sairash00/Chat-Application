import User from '../database/models/user.model.js'
import {verifyOtp, generateToken} from "../utils/jwt.js"
import {comparePassword, hashPassword} from "../utils/bcrypt.js"
import { isValidObjectId } from 'mongoose'
import { removeFromCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js'

//completed and tested 
export const register = async(req,res) => {
    try {
        const {username, email, password, otp, encryptedOtp} = req.body

        if(!username ||!email ||!password || !otp || !encryptedOtp ) return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })

        const decryptedOtp = verifyOtp(encryptedOtp)
        if(!decryptedOtp || decryptedOtp !== otp ) return res.status(401).json({
            success: false,
            message: "Invalid OTP"
        })
     
        const hashedPassword = await hashPassword(password)

        if(!hashedPassword) return res.status(403).json({
            success: false,
            message: "Error occured"
        })

        const user = await User.create({ 
            username: username,
            email: email,
            password: hashedPassword,
            lastSeen: Date.now()
        })

        if(!user) return res.status(409).json({
            success: false,
            message: 'Error creating user'
        })

        const token = generateToken(email.toLowerCase(), user._id)
        const options = {
            httpOnly: true,
            expires:  new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours in milliseconds
            secure: true,
            sameSite: "None"
        }

        res.status(200)
        .cookie("accessToken", token, options)
        .json({
            success: true,
            message: 'User registered successfully',
            user : {
                _id: user._id,
                email: user.email,
                username: user.username,
                lastSeen: user.lastSeen,
                profileImage: user.profileImage
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//completed and tested 
export const login = async(req,res) => {
    try {
        const {email, password} = req.body
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({email: email.toLowerCase()})

        if(!user) return res.status(404).json({
            success: false,
            message: "User not found"
        })

        const isMatch = await comparePassword(password, user.password)

        if(!isMatch) return res.status(400).json({
            success: false,
            message: "Invalid credentials"
        })

        user.lastSeen = Date.now();
        const updatedUser =  await user.save()

        const token = generateToken(email.toLowerCase(), user._id)

        const options = {
            httpOnly: true,
            expires:  new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours in milliseconds
            secure: true,
            sameSite: "None"
        }

        res.status(200)
        .cookie("accessToken", token, options)
        .json({
            success: true,
            message: "Logged in successfylly",
            user:{
                _id: user._id,
                username: user.username,
                email: user.email,
                lastSeen: updatedUser.lastSeen,
                profileImage: user.profileImage
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//completed and tested 
export const getUser = async( req, res) => {
    try {
        const id = req.params.id

        if(!id || !isValidObjectId(id)) return res.status(400).json({
            success: false,
            message: "Invalid ID"
        })

        const user = await User.findById(id).select("-password")

        if(!user) return res.status(404).json({
            success: false,
            message: "User not found"
        })

        res.status(200).json({
            success: true,
            user
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//completed and tested 
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password")
        if(!users) return res.status(403).json({
            success: false,
            message: "No user found"
        })

        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const searchUsers = async (req, res) => {
    try {
        const search = req.query?.search
        const me = req.user

        if(!search || search.length === 0 ) return res.status(400).json({
            success: false,
            message: "Search query is required"
        })

        const users = await User.find({
             username: new RegExp(search, 'i'),
             _id: { $ne: me } 
            })
       .select('username profileImage email ')

       return res.status(200).json({
        success: true,
        message: "User successfully retreived",
        users
       })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//completed and tested 
export const addProfile = async (req, res) => {
    try {
        console.log(req.file)
        const image = req.file
    
        if(!image) return res.status(404).json({
            success: false,
            message: "No image provided"
        })
    
        const secureUrl = await uploadOnCloudinary(image.buffer);
    
        if(!secureUrl) return res.status(404).json({
            success: false,
            message: "Error uploading image"
        })
    
        const user = await User.findByIdAndUpdate(
            { _id: req.user },  
            { profileImage: secureUrl },  
            { new: true } 
          ).select('-password');
    
        if(!user){
            const deletedImage = await removeFromCloudinary(secureUrl);

            if(!deletedImage)  return res.status(500).json({
                success: false,
                message: "Error deleting Image"
            })

            return res.status(400).json({
                success: false,
                message: "User not found",
                deletedImage
            })
        }
        
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
      
}

//completed and tested 
export const deleteProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.profileImage && user.profileImage.includes('cloudinary.com')) {
            const deletedImage = await removeFromCloudinary(user.profileImage);

            if (!deletedImage) {
                return res.status(404).json({
                    success: false,
                    message: "Error deleting image"
                });
            }

            await User.findByIdAndUpdate(
                req.user._id,
                { profileImage: null },
                { new: true }
            );

            res.status(200).json({
                success: true,
                message: "Profile image deleted successfully",
            });
        } else {
            res.status(400).json({
                success: false,
                message: "No profile image to delete"
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
}


//completed and tested 
export const logout = async (req, res) => { 
    try {
        const user  = await User.findByIdAndUpdate({_id: req.user}, {lastSeen: Date.now()})
        if(!user) return res.status(404).json({
            success: false,
            message: 'User not found'
        })

        res.clearCookie("accessToken")
        .status(200)
        .json({
            success: true,
            message: "Logged out Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//completed and tested 
export const updateUsername = async (req, res) => {
    try {
        const username = req.body.username
        if(!username){
            return res.status(400).json({
                success: false,
                message: "Username is required"
            })
        }

        const user = await User.findByIdAndUpdate(
            { _id: req.user },  
            { username },  
            { new: true } 
          ).select('-password');

        if(!user) return res.status(404).json({
            success: false,
            message: "User not Found"
        })

        res.status(200).json({
            success: true,
            message: "Username updated successfully",
            user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const isLoggedIn = async(req,res) => { 
    return res.status(200).json({
        success: true,
        message:"User is logged in",
        user: req.userData
    })
}

//FORGET PASSWORD AND OTER CONTROLLERS ARE NOT ADD YET 