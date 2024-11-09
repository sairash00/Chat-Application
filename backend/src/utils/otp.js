import dotenv from 'dotenv';
dotenv.config()

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  

// Function to send OTP email
export const sendOtpEmail = async (to, otp) => {
  try {
    const mailOptions = {
        from: process.env.EMAIL, // Sender email address
        to, // Recipient email address
        subject: 'Your OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h2 style="color: #4CAF50;">Your OTP Code</h2>
            <p style="font-size: 16px;">Your OTP code is <strong style="font-size: 24px;">${otp}</strong>.</p>
            <p style="font-size: 14px; color: #666;">Please enter this code in the application to verify your identity.</p>
            <p style="font-size: 12px; color: #999;">This code is valid for a limited time only.</p>
          </div>
        `,
      };
  

    const info = await transporter.sendMail(mailOptions);
    return {
        success: true,
        info
    }
  } catch (error) {
    return {
        success: false,
        error
    }
}
};
