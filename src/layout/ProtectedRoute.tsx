import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAndStoreSession, subscribeToAuthChanges } from '@/utils/authService';
import { useUserStore } from '@/store/useUserStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { setUser } = useUserStore();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  
  const dark = localStorage.theme === 'dark';
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
      
  useEffect(() => {
    let unsub: () => void;

    const init = async () => {
      const currentSession = await getAndStoreSession();

      if (!currentSession) {
        if (window.location.pathname !== '/login') {
          navigate('/login');
        }
      } else {
        setUser(currentSession.user);
      }

      unsub = subscribeToAuthChanges();
      setChecking(false);
    };

    init();

    return () => {
      if (unsub) unsub();
    };
  }, [navigate, setUser]);

  if (checking) return null; // Add a spinner here if preferred

  return <>{children}</>;
};

export default ProtectedRoute;
