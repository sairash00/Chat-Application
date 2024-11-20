import LeftComponent from "./LeftComponent";
import RightComponent from "./RightLoginComponent";

const Login = () => {

  return (
    <div className="flex flex-col-reverse md:flex-row h-screen md:h-screen bg-gradient-to-r from-[#6178f9c8] via-[#6178f981] to-[#AEE3F9]">
      {/* Left Section */}

      <LeftComponent signUp={false} /> 

      {/* Right Section (Login Form) */}
      
      <RightComponent />

    </div>
  );
};

export default Login;
