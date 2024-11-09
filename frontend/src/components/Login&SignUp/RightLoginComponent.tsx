import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";
import { LoginData } from "../../Interfaces/interface";
import { verifyLoginData } from "../../Functions/DataCheck"; 
import { useMutation } from "@tanstack/react-query";
import { loginQuery } from "../../Functions/QueryFns";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners"; 
import showToast from "../../Functions/CustomToast";
import { handleError } from "../../Functions/FetchErrorHandler";

const RightComponent = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [LoginData, setLoginData] = useState<LoginData>({
      email: "",
      password: ""
    })

    const handleShowPassword = () => {
      setShowPassword(!showPassword)
    }

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      const {value, name} = e.target as HTMLInputElement

      setLoginData({
        ...LoginData,
        [name]: value
      })
    }

    const {mutate, status} = useMutation({
      mutationFn: loginQuery,
      onSuccess: (data) => {
        showToast("Logged in successfully", "success")
        setLoginData({
          email: "",
          password: ""
        })
        localStorage.setItem("userData", JSON.stringify({...data.data.user, loggedIn: new Date(Date.now()).toLocaleTimeString()}))
        navigate("/chat")

      },
      onError: (error) => {
        const errorMessage = handleError(error)
        showToast(errorMessage, "error")
        setLoginData({
          ...LoginData,
          password: ""
        })
      }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const verifiedLoginData:LoginData | string = verifyLoginData(LoginData)
        if (typeof verifiedLoginData === "string") {
          showToast(verifiedLoginData, "error")
          return
        }
        mutate(verifiedLoginData)
      }

  return (
    <div className="flex flex-col shadow-inner  justify-center items-center w-full md:w-1/2 p-8 backdrop-blur-md rounded-none md:rounded-bl-none md:rounded-tr-3xl">
        <h2 className="text-3xl font-semibold mb-6 text-[#212121]  ">Login</h2>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-[#212121] text-sm font-bold tracking-wide" htmlFor="email">
              E-mail
            </label>
            <input
              className="w-full py-2 px-1 text-[#212121] border-b-2 border-blue-400 focus:outline-none focus:border-[#577fee] bg-transparent font-semibold tracking-wider"
              onChange={handleChange}
              value={LoginData.email}
              id="email"
              name="email"
              type="email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-[#212121] text-sm font-bold tracking-wide" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full py-2 px-1 text-[#212121]  border-b-2 border-blue-400 focus:outline-none focus:border-[#577fee] bg-transparent font-semibold tracking-wider"
                id="password"
                name="password"
                onChange={handleChange}
                value={LoginData.password}
                type={showPassword ? "text":"password"}
              />
              <span onClick={handleShowPassword} className="absolute inset-y-0 right-0 mr-3 flex items-center text-xl text-[#212121] ">
                {showPassword? <FaRegEyeSlash/> : <FaRegEye/>}
              </span>
            </div>
          </div>
          <button
            className="w-full bg-[#6179F9] text-[#fff] font-bold py-2 px-4 rounded-full hover:bg-[#596bd1cb] focus:outline-none focus:shadow-outline transition"
            type="submit"
            disabled = {status === 'pending' ? true : false}
          >
            { status === 'pending' ? <PulseLoader size={10} color="#D7E7FD" /> : "Login"}
          </button>
        </form>
      </div>
  )
}

export default RightComponent