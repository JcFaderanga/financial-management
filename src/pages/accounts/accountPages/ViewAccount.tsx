import { useEffect, useState } from 'react'
import ModalWrapper from '@/wrapper/ModalWrapper'
import { useNavigate, useParams } from 'react-router-dom'
import { IoWallet } from "react-icons/io5";
import { useAccountStore } from '@/store/useAccountStore';
import { AccountType } from '@/types/AccountTypes';
import NumberFlow from '@/components/UI/NumberFlow';
import CustomInputV2 from '@/components/inputs/CustomInputV2';
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoCheckmark  } from "react-icons/io5";
import supabase from '@/lib/supabase';

const ViewAccount = () => {
    const navigate = useNavigate()
    const {code} = useParams();
    const {account} = useAccountStore();
    const [amount, setAmount] = useState<string | number>('');
    const [isAmountEdit, setIsAmountEdit] = useState<boolean>(false);

    const currentAccount: AccountType = account.filter((acc)=> acc.account_code === code)[0];

    useEffect(()=>setAmount(currentAccount.amount),[])

    async function updateAmount(){
        
        currentAccount.amount += Number(amount);

        await supabase
            .from('accounts')
            .update({ ...currentAccount, amount: amount })
            .eq('account_code', currentAccount.account_code)
            .eq('account_owner', currentAccount.account_owner )

        setIsAmountEdit(!isAmountEdit)
    }

  return (
    <ModalWrapper close={()=>navigate(-1)}>
        <div className='bg-white dark:bg-light-dark rounded-xl dark:text-white p-4'>

            <div className='flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                    <IoWallet size={30}/>
                    <strong className='text-xl'>{currentAccount?.account_code}</strong>
                </div>
                <IoIosAddCircleOutline size={30}/>
            </div>
            

            <div className='w-full p-5 text-center bg-medium-dark rounded-2xl my-4'>
                <strong >
                    <span className='text-2xl' onClick={()=>setIsAmountEdit(!isAmountEdit)}>
                        <NumberFlow value={Number(amount)} style='currency' currency='php'/>
                    </span>
                    
                    {
                    isAmountEdit &&
                        <div className='flex items-center gap-2'>
                            <CustomInputV2 
                                value={amount} 
                                onChange={(e)=>setAmount(Number(e))} 
                                type='number' 
                                disabled={false}
                                className='text-center'
                            />
                            <div className={` p-3 bg-gray-200 dark:bg-dark rounded-xl w-fit`} onClick={updateAmount}>
                                <IoCheckmark/>
                            </div>
                        </div>
                    }
                    
                    
                </strong> 
            </div>
            
        </div>
    </ModalWrapper>
  )
}

export default ViewAccount
