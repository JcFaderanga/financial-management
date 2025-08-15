import { useEffect, useState, useCallback } from 'react'
import ModalWrapper from '@/wrapper/ModalWrapper'
import { useNavigate, useParams,useLocation } from 'react-router-dom'
import { IoWallet } from "react-icons/io5";
import { useAccountStore } from '@/store/useAccountStore';
import { AccountType } from '@/types/AccountTypes';
import NumberFlow from '@/components/UI/NumberFlow';
import CustomInputV2 from '@/components/inputs/CustomInputV2';
import { IoCheckmark  } from "react-icons/io5";
import supabase from '@/lib/supabase';
import useFetchItemByAccount from '@/hooks/spend_items/useFetchItemByAccount';
import { itemTypes } from '@/types/itemTypes';
import SpentTable from '@/components/dashboard/spentHistory/SpentTable';
import { IoIosCloseCircle } from "react-icons/io";
import { NoRecord } from '@/components/NoRecord';
const ViewAccount = () => {
    const navigate = useNavigate()
    const [items, setItems] = useState<itemTypes[]>([]);
    const {code} = useParams();
    const {account} = useAccountStore();
    const [amount, setAmount] = useState<string | number>(0);
    const [isAmountEdit, setIsAmountEdit] = useState<boolean>(false);
    const location = useLocation();
    const {handleFetchItemByAccount, error} = useFetchItemByAccount();

    useEffect(()=>{
        async function fetchByAcc(){
            const result: itemTypes[] = await handleFetchItemByAccount(code)
            setItems(result)
        }
        fetchByAcc();
        
    },[])

    const currentAccount: AccountType = account?.filter((acc)=> acc.account_code === code)[0];

    useEffect(()=>setAmount(currentAccount?.amount),[isAmountEdit])

    async function updateAmount(){
        
        currentAccount.amount = Number(amount);

        await supabase
            .from('accounts')
            .update({ ...currentAccount, amount: amount || currentAccount?.amount})
            .eq('account_code', currentAccount.account_code)
            .eq('account_owner', currentAccount.account_owner )

        setIsAmountEdit(!isAmountEdit)
    }

  const handleEdit= useCallback((data: itemTypes)=>{

    navigate(`/item/${data.id}`, {
        state: { 
          backgroundLocation: location,
          data: data  
        }
      }, );

  },[])
  return (
    <ModalWrapper close={()=>navigate(-1)} classNameChild='h-full lg:py-10'>
        <div className='bg-white dark:bg-light-dark lg:rounded-xl dark:text-white p-4 h-full'>

            <div className='flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                    <IoWallet size={30}/>
                    <strong className='text-xl'>{currentAccount?.account_code}</strong>
                </div>
                <span className='text-gray-300' onClick={()=>navigate(-1)}>
                    <IoIosCloseCircle size={30}/>
                </span>
                
            </div>
            

            <div className='w-full p-5 text-center bg-medium-dark rounded-2xl my-4'>
                <strong >
                    <span className='text-2xl' onClick={()=>setIsAmountEdit(!isAmountEdit)}>
                        <NumberFlow value={Number(currentAccount?.amount) || 0} style='currency' currency='php'/>
                    </span>
                    
                    {
                    isAmountEdit &&
                        <div className='flex items-center gap-2'>
                            <CustomInputV2 
                                value={amount || ''} 
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
            
            <span className='text-red-900'>{error}</span>

            {
                items.length > 0
                ?   <SpentTable 
                        data={items}
                        handleEdit={handleEdit}
                    />
                :   <NoRecord/>
            }
            
        </div>
    </ModalWrapper>
  )
}

export default ViewAccount
