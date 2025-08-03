import React, { useEffect,useState } from 'react'
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

const [dark, setDark] = useState(() => {
    return localStorage.theme === 'dark';
  });

  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
      document.body.style.backgroundColor = '#121212';
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      document.body.style.backgroundColor = 'transparent';
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

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
    <header className={`border-b border-gray-300 w-full bg-white dark:bg-dark h-16 fixed top-0 flex items-center justify-between px-4
    ${isMenuActive ? 'hidden lg:flex' : ''}
    `}>
      <div className='flex items-center'>
        {isMenuActive 
            ? <FaAlignLeft onClick={handleMenuToggle} className='text-slate-500 mr-4 cursor-pointer' size={20}/>
            : <FaAlignRight onClick={handleMenuToggle} className='text-slate-500 mr-4 cursor-pointer' size={20}/>
        }

        {user.id === '75eacadc-8e39-425a-adda-56712083d51a' 
            ? <span className='text-sm px-2 dark:text-white'>Demo Account</span>
            :  <>
                <img src={user.user_metadata.avatar_url} className='rounded-full w-10' alt="Profile" />
                <span className='text-sm px-2 dark:text-white'>{user.user_metadata.full_name}</span>
              </>
        }
       
      </div>
         
        <div  onClick={() => setDark(!dark)} className='cursor-pointer bg-blue-100 dark:bg-light-dark rounded-2xl flex px-1 py-1'>
          <span className='opacity-0 dark:opacity-100 bg-blue-50 rounded-full p-0.5'>🌙</span> 
          <span className='dark:opacity-0 bg-blue-50 rounded-full p-0.5'>☀️</span>

      </div>
    </header>
  )
}

export default React.memo(Header)
