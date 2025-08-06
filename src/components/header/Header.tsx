import React, { useEffect } from 'react'
import { useUserStore } from '@/store/useUserStore'
import { useNavigate } from 'react-router-dom'
import { useSession } from '@/store/useSession'
import { FaAlignLeft,FaAlignRight } from "react-icons/fa6";
import { useMenuStore } from '@/store/useMenuToggle'
const Header = () => {
  const navigate = useNavigate();
  const {user} = useUserStore();  
  const {session} = useSession();
  const {setMenuIsActive,isMenuActive} = useMenuStore();


  useEffect(()=>{
    if(!session){
      navigate('/login')
    }
  }, [session])
  
  const handleMenuToggle=()=>{
    setMenuIsActive(!isMenuActive)
  }
//console.log(user)
  return (
    <header className={`border-b border-gray-300 w-full bg-white dark:border-medium-dark dark:bg-dark h-16 fixed top-0 flex items-center justify-between px-4
    ${isMenuActive ? 'hidden lg:flex' : ''}
    `}>
      <div className='flex items-center'>
        <div className='hidden lg:flex'>
          {isMenuActive 
            ? <FaAlignLeft onClick={handleMenuToggle} className='mr-4 cursor-pointer text-slate-500' size={20}/>
            : <FaAlignRight onClick={handleMenuToggle} className='mr-4 cursor-pointer text-slate-500' size={20}/>
          }
        </div>
        

        {user.id === '75eacadc-8e39-425a-adda-56712083d51a' 
            ? <span className='px-2 text-sm dark:text-white'>Demo Account</span>
            :  <>
                <img src={user.user_metadata.avatar_url} className='w-10 rounded-full' alt="Profile" />
                <span className='px-2 text-sm dark:text-white'>{user.user_metadata.full_name}</span>
              </>
        }
       
      </div>
         
        
    </header>
  )
}

export default React.memo(Header)
