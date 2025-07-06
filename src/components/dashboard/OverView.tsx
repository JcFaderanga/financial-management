import { useState } from 'react'
import { useSpendings } from '@/store/useSpendingStore'
import type { itemTypes } from '@/types/itemTypes';
import { useOverviewDateStore } from '@/store/useOverviewDate';
import { LongDateFormat } from '@/utils/DateFormat';
import { FaAngleDown,FaAngleUp } from "react-icons/fa6";
import NumberFlowUI from '../UI/NumberFlow';
import { FaPen } from "react-icons/fa";
const OverView = () => {
    const { spendings } = useSpendings();
    const {date,setDate} = useOverviewDateStore();
    const [isSummary, setIsSammary] =useState<boolean>(false)
    const [isDateToEdit, setIsDateToEdit] = useState<boolean>(false)
    const latest = spendings?.filter((item: itemTypes)=>{
        const prev = new Date(item?.created_at);
        const now = new Date(date);

         return(
            prev.getFullYear() === now.getFullYear() &&
            prev.getDate() === now.getDate() &&
            prev.getMonth() === now.getMonth()
         )
    })  
    const grouped = latest?.reduce((acc: Record<string, number>, item: any) => {
        if (!acc[item.category]) {
            acc[item.category] = item.price;
        } else {
            acc[item.category] += item.price;
        }
        return acc;
    }, {});

    const  data_result = spendings ? Object?.entries(grouped)?.map(([type, price]) => ({
        type,
        price
    })) : undefined;

    const total = data_result ? latest?.reduce(
        (sum: number, item: itemTypes) => sum + Number(item.price),
        0
      ) : 0;

    const filterDate = (date: string) => {
        setDate(date)
        setIsDateToEdit(!isDateToEdit)
    }
  return (
    <div className='pt-4 px-6'>
        <div>
            <strong className='custom-black text-2xl'>Overview</strong>
            {!isDateToEdit 
                ?   <h2 className='text-slate-400'>{LongDateFormat(new Date(date))} Usage 
                        <FaPen onClick={()=>setIsDateToEdit(!isDateToEdit)} className='inline-block mx-1 cursor-pointer' />
                    </h2>
                :   <input onChange={(date)=>filterDate(date.target.value) } type='date' className='block py-1 bg-slate-50 rounded cursor-pointer'/>
            }        
        </div>
        <section className='flex justify-center py-4 lg:py-20 '>
            <div>
                <p className='text-slate-400 text-center'>Total spending</p>
                <strong className='text-5xl custom-black '>
                    <NumberFlowUI 
                        value={total} 
                        currency='PHP' 
                        style='currency'
                    />
                </strong>
            </div>
        </section>
        <section className={`${!isSummary ? 'hidden': '' } lg:block py-4`}>
            {
            !data_result 
                ?   <div className='w-full flex justify-center'>
                        <strong className='text-orange-700'>There's no Record Available.</strong>
                    </div>
                :   data_result?.map((item: any)=>{
                    return(
                        <ul key={item.id} className='flex justify-between py-4 border-t border-gray-300'>
                            <li>{item.type}</li>
                            <div className=' w-1/2 flex justify-between'>
                                <li>{(item.price / total * 100).toFixed(2)}%</li>
                                <li>₱{item.price}</li>
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