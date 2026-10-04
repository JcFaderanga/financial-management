import useDocumentTitle from '@/hooks/document/useDocTitle'
import { signOut } from '@/utils/authService'
import { LuLogOut } from "react-icons/lu";

const Liabilities = () => {
  useDocumentTitle('Liabilities | Finance Management')
    
  return (
    <div className='p-4'>
        <div className='flex items-center justify-between h-14 px-4 my-2 bg-slate-100 dark:bg-light-dark rounded-xl'>
        <strong className='dark:text-white text-dark '>Sign Out</strong>
            <div onClick={() => signOut()} className='flex text-2xl dark:text-white cursor-pointer'>
                <LuLogOut/>
            </div>
        </div> 
    </div>
  )
}

export default Liabilities
