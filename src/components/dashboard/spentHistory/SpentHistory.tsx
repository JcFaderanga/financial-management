import  { useCallback, useEffect, useState } from 'react';
import { useSpendings } from '@/store/useSpendingStore';
import type { itemTypes } from '@/types/itemTypes';
import SpentTable from './SpentTable';
// import { FaAngleUp,FaAngleDown } from "react-icons/fa6";
import OverviewDate from '@/hooks/OverviewDate';
import { NoRecord } from '@/components/NoRecord';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetchAllSpending from '@/hooks/spend_items/useFetchAllSpending';
import { useOverviewDateStore } from '@/store/useOverviewDate';

const SpentHistory = () => {
  const { spendings, setSpendItems } = useSpendings();
  const { handleFetchAllSpendings, loading } = useFetchAllSpending();
  const {date} = useOverviewDateStore();
  const [spendingIsHidden] = useState<boolean>(false);
  const {dateRange, timeRange} = OverviewDate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    async function fetch() {
        const result = await handleFetchAllSpendings(date);
        setSpendItems?.(result);
    };  
    if(!spendings) fetch();

  },[])


  const handleEdit= useCallback((data: itemTypes)=>{

    navigate(`/record/${data.id}`, {
        state: { 
          backgroundLocation: location,
          data: data  
        }
      }, );

  },[])

  return (
    <div className={`${spendingIsHidden && 'bg-slate-100'}`}>
      <header className={` flex justify-between items-center`}>
          <div className={`hidden py-4 mx-auto ${dateRange.includes('-') && 'md:block'}`}>
              <p className='text-sm text-gray-400'>{dateRange}</p>
              <p className='text-sm text-gray-400'>{timeRange}</p>
          </div>

      </header>
      <div className={`${spendingIsHidden && 'hidden'} w-full pb-10`}>
        <div className='h-full overflow-x-auto pt-4'>
          
            <SpentTable 
                loading={loading}
                data={spendings || []}
                handleEdit={handleEdit}
            />
            {
                loading ? '' : (spendings?.length > 0) ? '' : <NoRecord/>    
            }
        </div>
        {/* {
          spendings?.length > 6 && 
            <footer className='flex justify-between py-3 rounded-b-2xl bg-slate-100'>
              <div>Showing1-6 out of 12 items Show all</div>
              <div className='flex gap-4'>
                  <div className='text-blue-500'>{`Preview`}</div>
                  <div className='text-blue-500'>{`Next`}</div>
              </div>
            </footer>
        } */}
      </div>
    </div>
  ); 
};

export default SpentHistory;
