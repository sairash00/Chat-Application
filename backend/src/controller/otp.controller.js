import User from "../database/models/user.model.js";
import { encryptOTP } from "../utils/jwt.js";
import { sendOtpEmail } from "../utils/otp.js";

export const sendOtp = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password)
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });

    if (user)
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });

    const otp = Math.floor(10000 + Math.random() * 90000);
    const encryptedOtp = encryptOTP(otp);

    const result = await sendOtpEmail(email, otp);

    if (!result.success)
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
        error: result.error,
      });

    

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      user: {
        email,
        password,
        username,
        encryptedOtp,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending OTP",
      error: error.message,
    });
  }
};
