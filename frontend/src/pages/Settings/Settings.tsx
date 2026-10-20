import useDocumentTitle from '@/hooks/document/useDocTitle'
import { useState, useEffect } from 'react';
import { signOut } from '@/utils/authService'
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
    <div className='p-4 '>
    <div className='flex justify-between items-center'>
      <strong className='dark:text-white text-dark'> Dark Mode</strong>
      <div  onClick={() => setDark(!dark)} className='flex px-1 py-1 bg-blue-100 cursor-pointer dark:bg-light-dark rounded-2xl'>
          <span className='opacity-0 dark:opacity-100 bg-blue-50 rounded-full p-0.5'>🌙</span> 
          <span className='dark:opacity-0 bg-blue-50 rounded-full p-0.5'>☀️</span>
      </div>
      
    </div>  
    <button onClick={signOut} className="px-4 py-1 text-sm mt-4 bg-blue-100 rounded cursor-pointer text-dark">
        Sign Out
      </button>  
    </div>
  )
}

export default Liabilities
