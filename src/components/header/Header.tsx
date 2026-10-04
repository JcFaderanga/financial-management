import React,{useState, useEffect} from 'react'
import { useUserStore } from '@/store/useUserStore'
import { FaAlignLeft,FaAlignRight } from "react-icons/fa6";
import { useMenuStore } from '@/store/useMenuToggle'
const Header = () => {
  const {user} = useUserStore();  
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
  const handleMenuToggle=()=>{
    setMenuIsActive(!isMenuActive)
  }

  return (
    <header className={`border-b border-gray-300 w-full bg-white dark:border-medium-dark dark:bg-dark h-16 flex items-center justify-between px-4
    ${isMenuActive ? 'hidden lg:flex' : ''}
    `}>
      <div className='flex items-center'>
        <div className='hidden lg:flex'>
          {isMenuActive 
            ? <FaAlignLeft onClick={handleMenuToggle} className='mr-4 cursor-pointer text-slate-500' size={20}/>
            : <FaAlignRight onClick={handleMenuToggle} className='mr-4 cursor-pointer text-slate-500' size={20}/>
          }
        </div>
        

        {user?.id === '75eacadc-8e39-425a-adda-56712083d51a' 
            ? <span className='px-2 text-sm dark:text-white'>Demo Account</span>
            :  <>
                <img src={user?.user_metadata?.avatar_url} className='w-10 rounded-full' alt="Profile" />
                <span className='px-2 text-sm dark:text-white'>{user?.user_metadata?.full_name}</span>
              </>
        }
      </div>
      <div onClick={() => setDark(!dark)}  className='flex px-2 py-2 bg-blue-100 cursor-pointer dark:bg-gray-700 rounded-2xl w-10'>
          <div className='absolute dark:opacity-0 bg-blue-950 rounded-full text-sm size-6 text-center pt-0.5'>🌙</div>
          <div className='opacity-0 dark:opacity-100 bg-blue-50 rounded-full text-sm size-6 text-center pt-0.5'>☀️</div>
      </div>
    </header>
  )
}

export default React.memo(Header)
