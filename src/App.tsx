import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/pages/dashboard/Dashboard';
import Page404 from '@/pages/Page404';
import Login from '@/pages/auth/Login';
import HomeLayout from '@/layout/HomeLayout';
import BankAccounts from '@/pages/accounts/BankAccounts';
import SocialAccounts from '@/pages/accounts/SocialAccounts';
import Transaction from '@/pages/transaction/Transaction';
import Liabilities from '@/pages/Liabilities/Liabilities';
import Bills from '@/pages/bills/Bills';
import ProtectedRoute from '@/layout/ProtectedRoute'; // adjust path if needed

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route: Login */}
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
          {/* Default child redirect */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* App Pages */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="accounts/banks" element={<BankAccounts />} />
          <Route path="accounts/socials" element={<SocialAccounts />} />
          <Route path="bills" element={<Bills />} />
          <Route path="liabilities" element={<Liabilities />} />
          <Route path="transaction" element={<Transaction />} />

          {/* Catch-all 404 for protected pages */}
          <Route path="*" element={<Page404 />} />
        </Route>

        {/* Optional: Catch-all 404 for public pages like /random404url */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
