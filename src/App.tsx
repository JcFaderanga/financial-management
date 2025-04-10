import { BrowserRouter, Routes, Route,Navigate  } from 'react-router-dom';
import Dashboard from '@/pages/dashboard/Dashboard';
import Page404 from '@/pages/Page404';
import Login from '@/pages/auth/Login';
import HomeLayout from '@/layout/HomeLayout';
import BankAccounts from '@/pages/accounts/BankAccounts';
import SocialAccounts from './pages/accounts/SocialAccounts';
import Transaction from '@/pages/transaction/Transaction';
import Liabilities from '@/pages/Liabilities/Liabilities';
import Bills from '@/pages/bills/Bills';
import ProtectedRoute from './layout/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page route */}
        <Route path="/login" element={<Login />} />
       
        {/* Home Layout with nested routes */}
        <Route 
          path="/" 
          element={<ProtectedRoute><HomeLayout /></ProtectedRoute>}
        >
          {/* Protected routes */} 
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts/banks" element={<BankAccounts />} />
          <Route path="/accounts/socials" element={<SocialAccounts />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/liabilities" element={<Liabilities />} />
          <Route path="/transaction" element={<Transaction />} />

          {/* Catch-all for 404 page */}
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
