import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAndStoreSession, subscribeToAuthChanges } from '@/utils/authService';
import { useUserStore } from '@/store/useUserStore';
import { useSession } from '@/store/useSession';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { setUser } = useUserStore();
  const { session, setSession } = useSession();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  // 🌙 Theme setup
  useEffect(() => {
    const html = document.documentElement;
    const dark = localStorage.theme === 'dark';
    if (dark) {
      html.classList.add('dark');
      document.body.style.backgroundColor = '#161B21';
    } else {
      html.classList.remove('dark');
      document.body.style.backgroundColor = 'transparent';
    }
  }, []);

  // 🔐 Initial session + subscribe
  useEffect(() => {
    let unsubscribe: () => void;

    const init = async () => {
      const currentSession = await getAndStoreSession();

      if (!currentSession) {
        navigate('/login', { replace: true });
      } else {
        setUser(currentSession.user);
        setSession(currentSession); // ⬅️ update global store
      }

      // 👂 Listen for login/logout
      unsubscribe = subscribeToAuthChanges((newSession) => {
        if (!newSession) {
          setUser(null);
          setSession(null);
          navigate('/login', { replace: true });
        } else {
          setUser(newSession.user);
          setSession(newSession);
        }
      });

      setChecking(false);
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigate, setUser, setSession]);

  if (checking) return null;

  if (!session) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
