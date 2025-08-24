import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

//AUTH PAGES
import Login from '@/pages/auth/Login';

//MAIN PAGES
import HomeLayout from '@/layout/HomeLayout';
import Records from '@/pages/dashboard/Records';
import Analytics from './pages/dashboard/Analytics';
import Wallet from '@/pages/accounts/Wallet';
import More from '@/pages/more/More'

//404 PAGE
import Page404 from '@/pages/Page404';

import SocialAccounts from './pages/accounts/SocialAccounts';
import Deposit from './pages/accounts/accountPages/Deposit';

// import Settings from '@/pages/Settings/Settings';
import Bills from '@/pages/bills/Bills';
import ProtectedRoute from './layout/ProtectedRoute';

import AddItem from './pages/add_item/CategorySelection';
import AddItemForm from './pages/add_item/AddItemForm';
import ModalViewItem from './components/modal/ModalViewItem';
import ViewAccount from './pages/accounts/accountPages/ViewAccount';
function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  
  return (
    <>
      {/* Main routes */}
      <Routes location={state?.backgroundLocation || location}>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/records" replace />} />
          <Route path="/records" element={<Records />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="wallet" element={<Wallet />} />
           <Route path="more" element={<More />} />
          <Route path="accounts/socials" element={<SocialAccounts />} />
          <Route path="bills" element={<Bills />} />
        </Route>

        {/* Fallback if modal route is visited directly */}
        <Route path="add/category" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
        <Route path="add/form/:category" element={<ProtectedRoute><AddItemForm /></ProtectedRoute>} />

        {/* Catch-all 404 */}
        <Route path="*" element={<Page404 />} />
      </Routes>

      {/* Modal routes (overlays on top) */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/item/:id" element={<ProtectedRoute><ModalViewItem /></ProtectedRoute>}/>
          <Route path="/account/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>}/>
          <Route path="/account/:code" element={<ProtectedRoute><ViewAccount /></ProtectedRoute>}/>
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
