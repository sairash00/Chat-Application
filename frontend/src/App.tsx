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

  const { data, isLoading} = useQuery({
    queryKey: ["isLoggedIn"],
    queryFn: isLoggedIn,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  const checkLogin = () => {
    const localData = localStorage.getItem("userData");

    if (!localData && (location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/verification/otp")) {
      return;
    }
  
    if (!localData) {
      navigate("/login");
      return;
    }

    const parsedData: LocalStorageData = JSON.parse(localData);

    if (!parsedData.loggedIn) {
      navigate("/login");
      return;
    }

    parsedData.loggedIn = new Date().toLocaleTimeString();
    localStorage.setItem("userData", JSON.stringify(parsedData));

    if (!data?.data.success) {
      localStorage.removeItem("userData");
      navigate("/login");
      return;
    }

    if (location.pathname === "/login" || location.pathname === "/signup") {
      navigate("/chat");
    }
  };

  
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
