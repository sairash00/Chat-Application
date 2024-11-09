import LeftComponent from "./LeftComponent"
import RightSignUpComponent from "./RightSignUpComponent"

const SignUp = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row h-fit md:h-screen bg-gradient-to-r from-[#6178f9c8] via-[#6178f981] to-[#AEE3F9]">
      {/* Left Section */}

      <LeftComponent signUp={true} /> 

      {/* Right Section (Login Form) */}
      
      <RightSignUpComponent />

    </div>
  )
}

export default SignUp