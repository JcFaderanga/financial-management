import ModalWrapper from '@/wrapper/ModalWrapper'
import { useLocation, useNavigate } from 'react-router-dom'
import { IoIosCloseCircle } from "react-icons/io";
import { AccountType } from '@/types/AccountTypes'
import NumberFlow from '@/components/UI/NumberFlow';
import { usePaymentMethod } from '@/store/useAccountStore';
import { BankAccount } from '@/utils/BankAccountFormula';
const AccountList = () => {

    const {setPaymentMethod}  = usePaymentMethod();
    const navigate = useNavigate()
    const location = useLocation();

    const current = new BankAccount(location.state?.account);
    
  return (
    <ModalWrapper close={()=>navigate(-1)} classNameChild='h-full lg:py-10 sli'>
        <div className='bg-white px-4 dark:bg-light-dark lg:rounded-xl dark:text-white  h-full overflow-y-scroll'>

            <div className='flex justify-between sticky top-0 py-3 bg-white dark:bg-light-dark z-20'>
                <strong>Payment method </strong>
                <span className='text-gray-300' onClick={()=>navigate(-1)}>
                    <IoIosCloseCircle size={30}/>
                </span>
            </div>

            {
                location.state.account?.map((acc: AccountType)=>{

                    const percent = current.getPercent(acc?.amount);
                    console.log(percent)
                    return(
                        <div 
                        onClick={()=>{
                            setPaymentMethod(acc?.account_code);
                            navigate(-1);
                        }} 
                        className='flex justify-between p-4 relative bg-slate-100 dark:bg-medium-dark my-2 rounded-xl cursor-pointer '>
                            <strong className='md:hidden'>
                                {acc.account_code}
                            </strong>
                            <strong className='hidden md:inline'>{acc.account_name}</strong>
                            
                            <strong className='text-green-500 text-right'>
                                <p className='text-xs'>Available balance</p>
                                <NumberFlow value={acc.amount} style='currency' currency='php'/>
                            </strong>

                            <div 
                            className='absolute top-0 left-0 bg-green-600 opacity-10 h-full rounded-xl'
                            style={{width: `${percent}%` }}
                            />
                        </div>
                    )
                })
            }
        </div>
    </ModalWrapper>
  )
}

export default AccountList;
