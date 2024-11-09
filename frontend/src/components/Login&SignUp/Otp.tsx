import React, { useRef, useState } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import { RegistrationOtpData } from '../../Interfaces/interface';
import { useMutation } from '@tanstack/react-query';
import showToast from '../../Functions/CustomToast';
import {handleRegistrationOtpError } from '../../Functions/FetchErrorHandler';
import { Register } from '../../Functions/QueryFns';
import { PulseLoader } from 'react-spinners';
import { verifyRegistrationOtpData } from '../../Functions/DataCheck';

const OTPInput: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [userData, setUserData] = useState<RegistrationOtpData>({
    email: location.state?.email,
    password: location.state?.password,
    username: location.state?.username,
    encryptedOtp: location.state?.encryptedOtp,
    otp: null
  })

  const {mutate, status} = useMutation({
    mutationFn: Register,
    onSuccess: (data) => {
      localStorage.setItem("userData", JSON.stringify({...data.data.user, loggedIn: new Date(Date.now()).toLocaleTimeString()}))
      showToast("User registered successfully!" , "success")
      navigate("/chat")
    },
    onError: (error) => {
      const errorMessage = handleRegistrationOtpError(error)
      showToast(errorMessage, "error")
    }
  })

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;

    // Only allow numeric input and single digit
    if (/^\d$/.test(value)) {
      const newOtpValue = inputRefs.current.map(input => input?.value || '').join('');
      setUserData({...userData, otp: parseInt(newOtpValue) }); 

      // Move to the next input box
      if (index < 4) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      e.target.value = ''; // Clear invalid input
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus(); // Move to the previous box
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const verifiedRegisterData:RegistrationOtpData | string = verifyRegistrationOtpData(userData)
    if (typeof verifiedRegisterData === "string") {
      showToast(verifiedRegisterData, "error")
      return
    }
    mutate(verifiedRegisterData)
  }

  return (
    <div className="flex items-center flex-col px-2 gap-2 justify-center h-screen bg-gradient-to-r from-[#6178f9c8] via-[#6178f981] to-[#AEE3F9]">
      <div className='font-semibold text-xl text-[#212121] text-center mb-5 '>
        <span className='bebas tracking-wider text-2xl sm:text-3xl mr-2'>GOSSIP</span> but not about your OTP.
      </div>
      <div className="bg-white/50 px-3 sm:px-8 py-4 rounded-lg shadow-lg backdrop-blur-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP</h2>
        <div className="flex space-x-3 justify-center ">
          {[...Array(5)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className=" w-10 sm:w-12 h-12 bg-transparent text-center text-xl border-b-2 border-blue-400 focus:outline-none focus:border-blue-600"
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>
        <p className="text-center text-[0.7rem] sm:text-sm mt-8 text-gray-600">Please enter the 5-digit OTP sent to your E-Mail.</p>
        <button
            className="w-full mt-4 bg-[#6179F9] text-[#fff] font-bold py-2 px-4 rounded-full hover:bg-[#596bd1cb] focus:outline-none focus:shadow-outline transition"
            type="button"
            disabled = {status === 'pending'? true : false}
            onClick={handleSubmit}
        >
            {status === 'pending' ? <PulseLoader size={10} color="#D7E7FD" /> : "Verify"}
        </button>
      </div>
      

    </div>
  );
};

export default OTPInput;
