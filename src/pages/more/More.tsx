import useDocumentTitle from '@/hooks/document/useDocTitle'
import { useState, useEffect } from 'react';
import { LuLogOut } from "react-icons/lu";

const Liabilities = () => {
  useDocumentTitle('Liabilities | Finance Management')

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
    
  return (
    <div className='p-4'>
        <div className='flex items-center justify-between h-14 px-4 my-2 dark:bg-light-dark rounded-xl'>
        <strong className='dark:text-white text-dark '>Dark Mode</strong>
            <div onClick={() => setDark(!dark)} className='flex px-1 py-1 bg-blue-100 cursor-pointer dark:bg-dark rounded-2xl'>
                <span className='dark:opacity-0 bg-blue-50 rounded-full text-sm p-[1px] px-0.5'>☀️</span>
                <span className='opacity-0 dark:opacity-100 bg-blue-50 rounded-full text-sm p-[1px] px-0.5'>🌙</span> 
            </div>
        </div>  

        <div className='flex items-center justify-between h-14 px-4 my-2 dark:bg-light-dark rounded-xl'>
        <strong className='dark:text-white text-dark '>Sign Out</strong>
            <div onClick={() => setDark(!dark)} className='flex text-2xl dark:text-white cursor-pointer'>
                <LuLogOut/>
            </div>
        </div> 
    </div>
  )
}

export default Liabilities
