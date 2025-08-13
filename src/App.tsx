import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Overview from '@/pages/dashboard/Overview';
import Page404 from '@/pages/Page404';
import Login from '@/pages/auth/Login';
import HomeLayout from '@/layout/HomeLayout';
import BankAccounts from '@/pages/accounts/BankAccounts';
import SocialAccounts from './pages/accounts/SocialAccounts';
import Transaction from '@/pages/transaction/Transaction';
import Liabilities from '@/pages/Settings/Settings';
import Bills from '@/pages/bills/Bills';
import ProtectedRoute from './layout/ProtectedRoute';
import SpendingAnalysis from './pages/dashboard/SpendingAnalysis';
import AddItem from './pages/add_item/CategorySelection';
import AddItemForm from './pages/add_item/AddItemForm';
import ModalViewItem from './components/modal/ModalViewItem';

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
          <Route index element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="dashboard/overview" element={<Overview />} />
          <Route path="dashboard/spending_analysis" element={<SpendingAnalysis />} />
          <Route path="accounts/banks" element={<BankAccounts />} />
          <Route path="accounts/socials" element={<SocialAccounts />} />
          <Route path="bills" element={<Bills />} />
          <Route path="liabilities" element={<Liabilities />} />
          <Route path="transaction" element={<Transaction />} />
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
          <Route
            path="/item/:id"
            element={<ProtectedRoute><ModalViewItem /></ProtectedRoute>}
          />
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
