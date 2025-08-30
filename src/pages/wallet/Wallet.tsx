import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import { PiHandDeposit } from 'react-icons/pi';
// import { RiBankLine } from 'react-icons/ri';
// import useDocumentTitle from '@/hooks/document/useDocTitle';
import NumberFlow from '@/components/UI/NumberFlow';
import { useAccountStore, useAmountHidden } from '@/store/useAccountStore';
import { BankAccount } from '@/utils/BankAccountFormula';
import { AccountType } from '@/types/AccountTypes';
import useFetchAllAccount from '@/hooks/accountHooks/useFetchAllAccount';
import { FaEyeSlash, FaEye} from "react-icons/fa6";
import WalletSkeleton from './WalletSkeleton';
import { MdOutlineAddCard } from "react-icons/md";
// ========================
// Subcomponents
// ========================
const AvailableBalance = () => {
  const { account } = useAccountStore();
  const current = new BankAccount(account);
  const balance = current.getAvailableBalance();
  const {isAmountHidden, setIsAmountHidden} = useAmountHidden();

  useEffect(()=>{
    if(isAmountHidden)
      localStorage.setItem('isAmountHidden', 'true');
    else 
      localStorage.setItem('isAmountHidden', 'false');
    
  },[isAmountHidden])

  return (
    <div className="w-full">
      <div className='flex gap-2 items-center'>
        <h1 className="text-sm dark:text-white">Available Balance</h1>

        {
          !isAmountHidden 
          ? <FaEye onClick={()=> setIsAmountHidden(!isAmountHidden)} className='cursor-pointer dark:text-white'/>
          : <FaEyeSlash onClick={()=> setIsAmountHidden(!isAmountHidden)} className='cursor-pointer dark:text-white'/>
        }
   
      </div>
      <strong className="dark:text-white text-3xl py-1">

        {
          isAmountHidden 
          ? '*****'
          : <NumberFlow
              value={Number(balance) || 0}
              style="currency"
              currency="php"
            />
        }
        
      </strong>
    </div>
  );
};

const ActionButton = () => {
  const location = useLocation();

  return (
    <div className="w-full dark:text-white flex gap-4">
      <Link to="/wallet/add_new_account" state={{ backgroundLocation: location }}>
        <div className="flex flex-col items-center">
          <div className="text-xl p-4 bg-gray-300 dark:bg-light-dark rounded-full w-fit">
            <MdOutlineAddCard />
          </div>
          {/* <span className="text-xs"></span> */}
        </div>
      </Link>

    </div>
  );
};

interface AccountProgressProps {
  title: string;
  amount: string | number;
  value: string;
}

const AccountProgress = ({ title, amount, value }: AccountProgressProps) => {

  const location = useLocation();
  const {isAmountHidden} = useAmountHidden();
  return(
    
    <div className="border rounded-2xl px-4 py-3 border-gray-200 bg-slate-50 dark:bg-medium-dark dark:border-none my-2 w-full lg:max-w-[305px]">
      <Link to={`/account/${title}`} state={{backgroundLocation: location}}>
      <div className="flex justify-between font-bold">
        <label htmlFor="progress">{title}</label>
        <output>
          {
            isAmountHidden
              ? "*****"
              :<NumberFlow value={amount} style="currency" currency="php" />
          }
          
        </output>
      </div>
      <progress id="progress" max="100" value={value} />
      </Link>
    </div>
  
  )
};

// ========================
// Main Component
// ========================

const Accounts = () => {
  const { setAccount, account: accountStore } = useAccountStore();
  const { account, fetchAccountData, loading } = useFetchAllAccount();

  useEffect(() => {
      const fetchAccounts = async () =>{
        if(accountStore.length <= 0){
            const res = await fetchAccountData();
            setAccount(res ?? []);
        }
      }
      fetchAccounts();
      
    }, [account]);

  const { account: storedAccount } = useAccountStore();
  
  const current = new BankAccount(storedAccount);
  
  if(loading) return <WalletSkeleton/>;
  
  return (
      <main className=" p-4 pb-20 flex flex-col gap-2">
        {/* Balance & Actions */}
        <section className="border-b flex justify-between border-gray-300 dark:border-light-dark pb-4">
          <AvailableBalance />
          <div><ActionButton /></div>
        </section>

        {/* Accounts List */}
        <output className="pb-4 dark:text-white lg:flex flex-wrap gap-2">
          {storedAccount?.map((acc: AccountType, index) => {
            const percent = current.getPercent(acc?.amount);
            return (
              <AccountProgress
                key={index}
                title={acc?.account_code}
                amount={acc?.amount}
                value={percent}
              />
            );
          })}
        </output>
      </main>
  );
};

export default Accounts;
