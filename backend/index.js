import dotenv from 'dotenv'
dotenv.config()

import http from 'http'
import { Server } from 'socket.io'
import app from "./app.js"
import connectDB from './src/database/index.js'
import { socketHandleer } from './socket.js'

// Connect to MongoDB
connectDB() 

const server = http.createServer(app)
const io = new Server(server,{
    cors: {
        origin: "https://gossip-nine.vercel.app",
        methods: ["GET", "POST"],
        credentials: true,
    },
})
socketHandleer(io)

// start the server
server.listen(process.env.PORT || 3000 , () => {
    console.log(`server listening on port ${process.env.PORT}`)
})