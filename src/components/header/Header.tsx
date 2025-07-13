import React, { useEffect } from 'react'
import { useUserStore } from '@/store/useUserStore'
import { useNavigate } from 'react-router-dom'
import { signOut } from '@/utils/authService'
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
    <header className={`border-b border-gray-300 w-full bg-white h-16 fixed top-0 flex items-center justify-between px-4
    ${isMenuActive ? 'hidden lg:flex' : ''}
    `}>
      <div className='flex items-center'>
        {isMenuActive 
            ? <FaAlignLeft onClick={handleMenuToggle} className='text-slate-500 mr-4 cursor-pointer' size={20}/>
            : <FaAlignRight onClick={handleMenuToggle} className='text-slate-500 mr-4 cursor-pointer' size={20}/>
        }
        

        <img src={user.user_metadata.avatar_url} className='rounded-full w-10' alt="Profile" />
        <span className='text-sm px-2'>{user.user_metadata.full_name}</span>
      </div>
         
      <button onClick={signOut} className="cursor-pointer text-sm px-4 py-1 rounded ">
        Sign Out
      </button>
    </header>
  )
}

export default React.memo(Header)
