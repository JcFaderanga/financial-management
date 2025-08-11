import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
function App() {
  return (
    <BrowserRouter>
      <Routes>
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
        
        {/* Modals */}
        <Route path="add/category" element={<ProtectedRoute children={<AddItem />}/> }/>
        <Route path="add/form/:category" element={<ProtectedRoute children={<AddItemForm />}/> }/>

        {/* Catch-all 404 */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
