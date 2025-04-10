import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAndStoreSession, subscribeToAuthChanges } from '@/utils/authService';
import { useUserStore } from '@/store/useUserStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
 const setUser = useUserStore((state)=> state.setUser);

  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let unsub: () => void;

    const init = async () => {
      const currentSession = await getAndStoreSession();
      if (!currentSession) {
        navigate('/login');
      }
     
      setUser(currentSession?.user);
      unsub = subscribeToAuthChanges();
      setChecking(false);
    };

    init();

    return () => {
      if (unsub) unsub();
    };

  }, [navigate]);

  if (checking) return null; // Or add a spinner/loading UI

  return <>{children}</>;
};

export default ProtectedRoute;
