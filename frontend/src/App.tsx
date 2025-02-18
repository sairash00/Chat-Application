import { useNavigate, Route, Routes, useLocation} from "react-router-dom";
import Login from "./components/Login&SignUp/Login";
import SignUp from "./components/Login&SignUp/SignUp";
import OTPInput from "./components/Login&SignUp/Otp";
import Chat from "./components/Chat/Chat";
import axios from "axios";
import RightChatBox from "./components/Chat/RightChatBox";
import PageNotFound from "./components/NotFound";
import { useEffect } from "react";
import { LocalStorageData } from "./Interfaces/interface";
import { useQuery } from "@tanstack/react-query";
import { isLoggedIn } from "./Functions/QueryFns";
axios.defaults.withCredentials = true;

const App = () => {
  const navigate = useNavigate();
  const location = useLocation()

  const { data, refetch, isLoading} = useQuery({
    queryKey: ["isLoggedIn"],
    queryFn: isLoggedIn,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  const checkLogin = () => {
   
    if (!data?.data.success) {
      localStorage.removeItem("userData");
      navigate("/login");
      return;
    }

    const userData: LocalStorageData = {
      _id: data?.data.user.id,
      username: data?.data.user.username,
      email: data?.data.user.email,
      profileImage: data?.data.user.profileImage,
      lastSeen: new Date().toLocaleTimeString(),
      loggedIn: new Date().toLocaleTimeString()
    }

    localStorage.setItem("userData", JSON.stringify(userData))

    if (location.pathname === "/login" || location.pathname === "/signup") {
      navigate("/chat");
    }
  };

  useEffect(() => {
    console.log("refetching..")
    refetch()
  }, [])
  
  useEffect(() => {
    if (!isLoading) {
      checkLogin();
    }
  }, [data, isLoading]);

  

  return (
    <>
      {/*routes go here */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verification/otp" element={<OTPInput />} />
        <Route path="/chat" element={<Chat />}>
          <Route path="/chat/:id" element={<RightChatBox />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
