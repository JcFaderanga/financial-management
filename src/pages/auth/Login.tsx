import { signInWithGoogle, signInDemo } from '@/utils/authService';
import useDocumentTitle from '@/hooks/document/useDocTitle';
import { FcGoogle } from "react-icons/fc";

export default function App() {
  
  useDocumentTitle('Sign In')
    return (
      <div className="p-2 h-screen bg-white">
        {/* <header className='flex justify-between'>
          <strong className='text-lg'>I Track Money</strong>
            <div className='flex gap-10 '>
              <span className='cursor-pointer'>Login</span>
              <strong className='cursor-pointer'>Try demo account</strong> 
            </div>
        </header> */}

        <section className='flex flex-col pt-40 items-center text-center h-full py-10 gradient rounded-lg'>
          <p className='text-2xl font-semibold'>Your Daily Spending, Made Simple.</p><br/>
          <p className='text-xl mx-auto text-gray-600 max-w-3xl'> Gain insights into your expenses, cut unnecessary costs, and stay on top of your budget with I Track Money.</p>
          
          <div className='md:flex gap-4 py-10'>
              <div 
                className='flex items-center  bg-white rounded-xl py-3 px-5 cursor-pointer my-4 hover:bg-slate-100' 
                onClick={signInWithGoogle}>
                <span><FcGoogle size={30}/></span>
                <span className='px-2 text-lg  custom-black'>Sign in with Google</span>
              </div>
              <div 
                className='border border-blue-400 rounded-xl py-3 px-5 cursor-pointer my-4 bg-blue-500 hover:bg-blue-600' 
                onClick={signInDemo}>
                <span className='text-center text-lg text-white'>Try Demo Account</span>
              </div>
               
          </div>
          
        </section>
        {/* <h1 className="text-2xl font-bold mb-4">Sign In</h1> */}

        
      </div>
    );
 
}
