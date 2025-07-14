import { useState,useMemo } from 'react'
import { useSpendings } from '@/store/useSpendingStore'
import type { itemTypes } from '@/types/itemTypes';
import { useOverviewDateStore } from '@/store/useOverviewDate';
import OverviewDate from '@/hooks/OverviewDate';
import { FaAngleDown,FaAngleUp } from "react-icons/fa6";
// import NumberFlowUI from '../UI/NumberFlow';
import { FaPen } from "react-icons/fa";
import CustomModal from '../modal/CustomModal';
import OverViewModal from './modals/OverViewModal';
import useFetchAllSpending from '@/hooks/spend_items/useFetchAllSpeding';
import type { datePropertyTypes } from '@/types/itemTypes';
const OverView = () => {
    const { spendings,setSpendItems } = useSpendings();
    const [isModal,setModal] = useState<boolean>(false);
    const {handleFetchAllSpendings}=useFetchAllSpending();
    const {setDate} = useOverviewDateStore();
    const {dateRange, timeRange} = OverviewDate();
    const [isSummary, setIsSammary] =useState<boolean>(false)
    const [isDateToEdit, setIsDateToEdit] = useState<boolean>(false)
    

    const total = spendings?.reduce(
        (sum: number, item: itemTypes) => sum + Number(item.price),
        0
      ) || 0;

    //this function summarize spending total by category
    const grouped = useMemo(() => {
    return spendings?.reduce((acc: Record<string, number>, item: any) => {
        if (!acc[item.category]) {
        acc[item.category] = item.price;
        } else {
        acc[item.category] += item.price;
        }
        return acc;
    }, {});
    }, [spendings]);

    const data_result = spendings ? Object?.entries(grouped)?.map(([type, price]) => ({
        type,
        price
    })) : undefined;

   
    const filterDate = async (date: string | datePropertyTypes) => {
        const res = await handleFetchAllSpendings(date)
        setSpendItems(res)
        setIsDateToEdit(!isDateToEdit)
        setModal(!isModal)
        setDate(date)
        console.log(date)
    }

  return (
    <div className='pt-4 px-6'>
        <div>
            <strong className='custom-black text-2xl'>Overview</strong>
            <h2 className='text-slate-400 text-sm'>{dateRange}  
                <FaPen onClick={()=>setModal(!isModal)} className='inline-block mx-1 cursor-pointer' />
            </h2>
            <h2 className='text-slate-400 text-sm'>{timeRange}</h2>
            {isModal &&  
                <CustomModal onClick={()=> setModal(!isModal)}>
                    <OverViewModal
                        onChange={filterDate}
                    />
                </CustomModal>
            }        
        </div>
        <section className='flex justify-center py-4 lg:py-20 '>
            <div>
                <p className='text-slate-400 text-center'>Total spending</p>
                <strong className='text-5xl custom-black '>
                   ₱{String(total?.toLocaleString())}
                    {/* <NumberFlowUI 
                        value={total} 
                        currency='PHP' 
                        style='currency'
                    /> */}
                </strong>
            </div>
        </section>
        <section className={`${!isSummary ? 'hidden': '' } lg:block py-4`}>
            {
            !data_result 
                ?   <div className='w-full flex justify-center'>
                        <strong className='text-orange-700'>There's no Record Available.</strong>
                    </div>
                :   data_result
                    ?.sort((a: any, b: any) => b.price - a.price)
                    .map((item: any, index)=>{
                    return(
                        <ul key={index} className='flex justify-between py-4 border-t border-gray-300'>
                            <li>{item.type}</li>
                            <div className=' w-1/2 flex justify-between'>
                                <li>{(item.price / total * 100).toFixed(2)}%</li>
                                <li>₱{item.price.toLocaleString()}</li>
                            </div>
                        </ul>
                    )
                })
            }
        </section>
        
    
        <div onClick={()=> setIsSammary(!isSummary)} className='text-center pb-8 lg:hidden'>
            {!isSummary 
                ? <>Show more <FaAngleDown className='mx-auto'/></> 
                : <><FaAngleUp className='mx-auto'/> Show less </>
            }
            
        </div>
    
    </div>
  )
}

export default OverView