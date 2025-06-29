import { useState } from 'react'
import { useSpendings } from '@/store/useSpendingStore'
import { itemTypes } from '@/types/itemTypes';
import NumberFlow from '@number-flow/react'
import { useOverviewDateStore } from '@/store/useOverviewDate';
import { LongDateFormat } from '@/utils/DateFormat';
import { FaAngleDown,FaAngleUp } from "react-icons/fa6";
const OverView = () => {
    const { spendings } = useSpendings();
    const {date} = useOverviewDateStore();
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
        <strong className='custom-black text-2xl'>Overview</strong>
        <section className='flex justify-center py-4 lg:py-20 '>
            <div>
                <p className='text-slate-400 text-center'>Total spending</p>
                <strong className='text-5xl custom-black '>
                    ₱<NumberFlow value={total} /> 
                </strong>
            </div>
        </section>
        <section className={`${!isSummary ? 'hidden': '' } lg:block py-4`}>
            <h2 className='text-slate-400'>{LongDateFormat(new Date(date))} Usage</h2>
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