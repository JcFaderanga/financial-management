
import { BrowserRouter, Routes, Route,Navigate  } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/dashboard/Dashboard'
import Page404 from './pages/Page404'
import Login from './pages/auth/Login'
import HomeLayout from './layout/HomeLayout'
import Accounts from './pages/accounts/Accounts'
import Transaction from './pages/transaction/Transaction'
import Liabilities from './pages/Liabilities/Liabilities'
import Bills from './pages/bills/Bills'
function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/Login" element={<Login/>}/>

          <Route path="/" element={<HomeLayout/>}>
          {/* Home Page */}
            <Route path="/Dashboard" element={<Dashboard/>}/>
            <Route path="/Accounts" element={<Accounts/>}/>
            <Route path="/Bills" element={<Bills/>}/>
            <Route path="/Liabilities" element={<Liabilities/>}/>

          {/* Reports */}
            <Route path="/Transaction" element={<Transaction/>}/>
            <Route path="*" element={<Page404/>}/>
          </Route>
          
      </Routes>
    </BrowserRouter>
  )
}

export default App

