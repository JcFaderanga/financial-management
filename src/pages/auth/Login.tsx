import { signInWithGoogle, signInDemo } from '@/utils/authService';
import useDocumentTitle from '@/hooks/document/useDocTitle';
import { FcGoogle } from "react-icons/fc";
export default function App() {
  
  useDocumentTitle('Sign In')
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        {/* <h1 className="text-2xl font-bold mb-4">Sign In</h1> */}

        <div 
          className='flex items-center border border-gray-400 rounded-xl py-3 px-5 cursor-pointer my-4 hover:bg-slate-100' 
          onClick={signInWithGoogle}>
          <span><FcGoogle size={30}/></span>
          <span className='px-2 text-lg  custom-black'>Sign in with Google</span>
        </div>
        <div 
          className='flex items-center rounded-xl py-3 px-7 bg-blue-500 cursor-pointer hover:bg-blue-600' 
          onClick={signInDemo}>
          <span className='px-2 text-lg text-white'>Access Demo Mode</span>
        </div>
      </div>
    );
 
}
