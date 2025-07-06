import { useState } from 'react'
import { useSpendings } from '@/store/useSpendingStore'
import type { itemTypes } from '@/types/itemTypes';
import { useOverviewDateStore } from '@/store/useOverviewDate';
import { LongDateFormat } from '@/utils/DateFormat';
import { FaAngleDown,FaAngleUp } from "react-icons/fa6";
import NumberFlowUI from '../UI/NumberFlow';
const OverView = () => {
    const { spendings } = useSpendings();
    const {date,setDate} = useOverviewDateStore();
    const [isSummary, setIsSammary] =useState<boolean>(false)
    //const [currentItems, SetcurrentItems] = useState<itemTypes[]>([]);
    if (!spendings) return 'Loading...';

    //get all latest items
    const latest = spendings.filter((item: itemTypes)=>{
        const prev = new Date(item?.created_at);
        const now = new Date(date);

         return(
            prev.getFullYear() === now.getFullYear() &&
            prev.getDate() === now.getDate() &&
            prev.getMonth() === now.getMonth()
         )
    })  
    const grouped = latest.reduce((acc: Record<string, number>, item: any) => {
        if (!acc[item.category]) {
            acc[item.category] = item.price;
        } else {
            acc[item.category] += item.price;
        }
        return acc;
    }, {});

    const data_result = Object.entries(grouped).map(([type, price]) => ({
        type,
        price
    }));

    const total = latest?.reduce(
        (sum: number, item: itemTypes) => sum + Number(item.price),
        0
      );

  return (
    <div className='pt-4 px-6'>
        <div className='flex justify-between'>
            <div>
                <strong className='custom-black text-2xl'>Overview</strong>
                <h2 className='text-slate-400'>{LongDateFormat(new Date(date))} Usage</h2>
            </div>
            <input onChange={(date)=>setDate(date.target.value) } type='date' className=' py-1 px-4 bg-slate-50 rounded cursor-pointer'/>
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
                data_result?.map((item: any)=>{

                    return(
                        <ul className='flex justify-between py-4 border-t border-gray-300'>
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