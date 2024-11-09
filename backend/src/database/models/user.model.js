import mongoose from 'mongoose'

const userSchema  = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        toLowerCase: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        toLowerCase: true
    },
    profileImage: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
    },
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }],
    lastSeen: {
        type: Date,
        default: null
    }
},{timestamps: true})

const User = mongoose.model("User", userSchema)
export default User