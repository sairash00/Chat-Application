import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Import routes
import userRoute from './src/routes/user.routes.js';
import chatRoute from './src/routes/chat.routes.js';
import otpRoute from './src/routes/otp.routes.js';

// Initialize Express app
const app = express();

// CORS setup
app.use(cors({
    origin: "https://gossip-nine.vercel.app",
    credentials: true,
}));

// Middleware setup
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes setup
app.use("/api/v1/users", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/otp", otpRoute);

export default app;
