import { toast} from 'react-hot-toast';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Icons from react-icons

// Toast content for success and error
const CustomToast = ({ message, type }: { message: string; type: 'success' | 'error' }) => {
  const icon =
    type === 'success' ? (
      <FaCheckCircle className="h-6 w-6 text-[#608bff]" />
    ) : (
      <FaExclamationCircle className="h-6 w-6 text-red-500" />
    ); 


  return (
    <div
      className="flex items-center gap-3 bg-[#ffffff60] text-[#212121] font-semibold backdrop-blur-md p-4 rounded-full"
    >
      {icon}
      <span>{message}</span>
    </div>
  );
};

// Trigger custom toast function
const showToast = (message: string, type: 'success' | 'error') => {
  toast.custom(() => <CustomToast message={message} type={type} />);
};

export default showToast