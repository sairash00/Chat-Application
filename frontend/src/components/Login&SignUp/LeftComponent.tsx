import { SignUp } from "../../Interfaces/interface"
import {Link} from 'react-router-dom'
const LeftComponent = (props:SignUp) => {
  return (
    <div className="flex flex-col justify-center shadow-sm items-center gap-1 w-full md:w-1/2 py-9 md:px-8 px-2 backdrop-blur-md bg-white/50 max-md:rounded-tl-[3rem] mt-2 md:mt-0 max-md:rounded-tr-[3rem] md:rounded-tr-[2.5rem] md:rounded-br-[2.5rem]  text-black">
        <h1 className="text-6xl font-bold mb-4 bebas tracking-wider ">GOSSIP</h1>
        <p className="text-lg text-center mb-2">A simple chat application <br /> Where You just chat. </p>
        <h2 className="text-2xl max-sm:text-[1.3rem] font-semibold">Simple Can Also Be Good. </h2>
        <Link to={props.signUp ? "/login" : "/signup"} className="mt-5 px-4 sm:px-5 outline-none py-1 sm:py-2 border-[#212121] border-2 text-[#212121] font-bold rounded-full hover:bg-[#6179F9] hover:border-transparent hover:text-white tracking-wider transition">
        {props.signUp ? "Login" : "Sign Up"}
        </Link>
        <p className="absolute bottom-1 text-center md:bottom-4 text-xs text-black md:font-semibold "> Copyright original Gossip 2024</p>
  </div>
  )
}

export default LeftComponent