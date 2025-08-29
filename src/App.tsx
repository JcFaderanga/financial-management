import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

//AUTH PAGES
import Login from '@/pages/auth/Login';
import ProtectedRoute from './layout/ProtectedRoute';

//MAIN PAGES
import HomeLayout from '@/layout/HomeLayout';
import Records from '@/pages/dashboard/Records';
import Analytics from './pages/dashboard/Analytics';
import Wallet from '@/pages/accounts/Wallet';
import More from '@/pages/more/More'

//404 PAGE
import Page404 from '@/pages/Page404';

//ADD RECORDS
import CategorySelection from './pages/add_item/CategorySelection';
import AddItemForm from './pages/add_item/AddItemForm';
import AccountList from './pages/accounts/accountPages/AccountList';

//WALLET SUB PAGES
import ViewAccount from './pages/accounts/accountPages/ViewAccount';

//MODAL PAGES
import ModalViewItem from './components/modal/ModalViewItem';

//UNUSED ROUTES, RESERVE FOR FUTURE FEATURES
import SocialAccounts from './pages/accounts/SocialAccounts';
// import Settings from '@/pages/Settings/Settings';
import Bills from '@/pages/bills/Bills';


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
            <ProtectedRoute children={<HomeLayout />}/>
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
        <Route path="add/category" element={ <ProtectedRoute children={<CategorySelection/>}/> }/>
        <Route path="add/form/:category" element={ <ProtectedRoute children={<AddItemForm/>}/> }/>

        {/* Catch-all 404 */}
        <Route path="*" element={<Page404 />} />
      </Routes>

      {/* Modal routes (overlays on top) */}
      {state?.backgroundLocation && (
        <Routes>AccountList
          <Route path="/account list" element={<ProtectedRoute children={<AccountList/>}/> }/>
          <Route path="/record/:id" element={<ProtectedRoute children={<ModalViewItem/>}/> }/>
          <Route path="/account/:code" element={<ProtectedRoute children={<ViewAccount/>}/> }/>
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
