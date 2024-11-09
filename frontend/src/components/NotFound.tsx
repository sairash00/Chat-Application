import { Link } from 'react-router-dom'; 
import { FaArrowLeft } from 'react-icons/fa';

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#6178f9c8] via-[#6178f981] to-[#AEE3F9] text-white">
      <div className="text-center">
        <h1 className="text-8xl md:text-9xl font-bold mb-4 font-[Bebas Neue]">404</h1>
        <p className="text-2xl mb-6">Oops! Page Not Found</p>
        <Link to="/chat" className="inline-flex items-center px-4 py-2 text-lg rounded-full bg-[#21212121] hover:bg-[#577fee] transition-all">
          <FaArrowLeft className="mr-2" />
          Go Back to Chat
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
