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
import CustomInputs from '@/components/inputs/CustomInputs';
import { RiSearch2Fill } from "react-icons/ri";
import { LuPencil } from 'react-icons/lu';
import Deposit from './Deposit';
import { Search } from '@/hooks/accountHooks/accountControls';
const ViewAccount = () => {
    const navigate = useNavigate()
    const [record, setRecord] = useState<itemTypes[]>([]);
    const {code} = useParams();
    const {account} = useAccountStore();
    const [amount, setAmount] = useState<string | number>(0);
    const [isAmountEdit, setIsAmountEdit] = useState<boolean>(false);
    const location = useLocation();
    const [isInnerModal, setIsInnerModal] = useState<boolean>(false);
    const [modalType,setModalType] = useState<string>('')
    const [search, setSearch] = useState<string>('');
    const {handleFetchItemByAccount, loading} = useFetchItemByAccount();

    useEffect(()=>{
        async function fetchByAcc(){
            const result: itemTypes[] = await handleFetchItemByAccount(code)
            setRecord(result)
        }
        fetchByAcc();
        
    },[])

   useEffect(() => {

  const debounce = setTimeout(() => {
    async function fetchSearch() {
      
        const result: any = await Search(code, search);
        setRecord(result);
    
    }
    fetchSearch();
  }, 500);

  return () => clearTimeout(debounce);
}, [search, code]);


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

  const showModal = (modalType: "deposit" | "transaction" | "date") =>{

    setModalType(modalType);
    setIsInnerModal(!isInnerModal);
  }



  return (
    <ModalWrapper close={()=>navigate(-1)} classNameChild='h-full lg:py-10 fade-in'>
        <div className='bg-white dark:bg-dark lg:rounded-xl dark:text-white py-4 h-full'>
            <div className='px-4'>

                {/* Header */}
                <div className='flex justify-between items-center'>
                    <div className='flex gap-2 items-center'>
                        <IoWallet size={30}/>
                        <strong className='text-xl'>{currentAccount?.account_code}</strong>
                    </div>
                    <span className='text-gray-300' onClick={()=>navigate(-1)}>
                        <IoIosCloseCircle size={30}/>
                    </span>
                </div>
            </div>

            {/* Content container */}
            <div className='h-[97%] px-4 overflow-y-scroll '>
            {/* <span className='text-red-900'>{error}</span> */}

                {/* Total Expenses Container */}
                <div className='w-full p-5 text-center bg-slate-100 dark:bg-light-dark rounded-2xl my-4'>
                    <strong >
                        <span className='text-2xl flex items-center justify-center gap-2 cursor-pointer' onClick={()=>setIsAmountEdit(!isAmountEdit)}>
                            <NumberFlow value={Number(currentAccount?.amount) || 0} style='currency' currency='php'/>
                            <LuPencil size={18}/>
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
                
                {/* Filters */}
                <div className='sticky top-0 py-2 z-30 bg-white dark:bg-dark'>

                    {/* Search bar */}
                    <div className='flex items-center px-4 py-1 bg-slate-100 dark:bg-light-dark rounded-4xl'>
                        <RiSearch2Fill size={30} className='text-slate-400'/>
                        <CustomInputs 
                            value={search} 
                            placeholder='Search'
                            onChange={(e)=>setSearch(e)} 
                            type='text' 
                            disabled={false}
                            focus={false}
                            className='!my-0 !px-1'
                        />
                    </div>
                    
                    {/* Filter buttons */}
                    <div className='grid grid-cols-3 gap-2 my-3'>
                        <div>
                            <button onClick={(()=>showModal('date'))} className='text-xs cursor-pointer py-3 w-full bg-slate-200 dark:bg-light-dark font-bold rounded-2xl'>Date</button>
                        </div>
                        <div>
                            <button onClick={(()=>showModal('transaction'))} className='text-xs cursor-pointer py-3 w-full bg-slate-200 dark:bg-light-dark font-bold rounded-2xl'>Transaction</button>
                        </div>
                        <div>
                            <button onClick={(()=>showModal('deposit'))} className='text-xs cursor-pointer py-3 w-full  bg-yellow-300 text-light-dark font-bold rounded-2xl'>Deposit</button>
                        </div>
                    </div>
                </div>

                {/* Expenses history list */}
                    <SpentTable 
                    data={record || []}
                    loading={loading}
                    handleEdit={handleEdit}
                />
                {
                    loading ? '' : (record?.length > 0) ? '' : <NoRecord/>    
                }
            </div>
        </div>

        {/* Inner modal */}
        {
            isInnerModal &&
            <ModalWrapper close={()=> setIsInnerModal(!isInnerModal)} className='!items-end lg:!items-center' classNameChild='slide-up'>
                <div className='lg:px-4 dark:text-white'>
                    {
                        modalType === "date" &&
                        <div className='bg-white dark:bg-dark h-32 lg:rounded-2xl rounded-t-2xl text-center font-bold py-4'>
                            This feature is not yet available.
                        </div>
                    }         
                    {
                        modalType === "transaction" &&
                        <div className='bg-white dark:bg-dark h-32 rounded-t-2xl text-center font-bold py-4'>
                            This feature is not yet available.
                        </div>
                    }    
                    {
                         modalType === "deposit" &&
                        <Deposit currentAccount={currentAccount} exit={()=>setIsInnerModal(!isInnerModal)}/>    
                    } 
                </div>
            </ModalWrapper>  
        }
          

    </ModalWrapper>
  )
}

export default ViewAccount
