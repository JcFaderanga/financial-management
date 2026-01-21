import React, { useEffect } from 'react'
import { useAccountStore } from '@/store/useAccountStore';
import useFetchAllAccount from '@/hooks/accountHooks/useFetchAllAccount';

const PageWrapper = (
  {
    children, className
  }:{
    children: React.ReactNode, className?: string
  }) => {
  
    const { setAccount, account: accountStore } = useAccountStore();
    const { account, fetchAccountData } = useFetchAllAccount();
  
    useEffect(() => {
        const fetchAccounts = async () =>{
          if(accountStore.length <= 0){
              const res = await fetchAccountData();
              setAccount(res ?? []);
          }
        }
        fetchAccounts();
        
      }, [account,]);

  return (
    <main className={` ${className} w-full h-full mx-auto max-w-7xl`}>
        {children}
    </main>
  )
}

export default PageWrapper;
