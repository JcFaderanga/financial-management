import  { useEffect, useState } from 'react';
import { useSpendings } from '@/store/useSpendingStore';
import { LongDateFormat } from '@/utils/DateFormat';
import { ToastDelete } from '../../tostify/Toast';
import type { itemTypes } from '@/types/itemTypes';
import supabase from '@/lib/supabase';
import { useOverviewDateStore } from '@/store/useOverviewDate';
import SpentTable from './SpentTable';
import { FaAngleUp,FaAngleDown } from "react-icons/fa6";
// Action buttons (Edit, Delete)


const SpentHistory = () => {
  const { spendings, setSpendItems } = useSpendings();
  const [toastList, setToastList] = useState<itemTypes[]>([]);
  const [spendingIsHidden, setSpendingIsHidden] = useState<boolean>(false);
  const {date} = useOverviewDateStore();
  // Auto-remove toast and delete item permanently
  useEffect(() => {
    if (toastList.length === 0) return;

    const deletePermanent = async (id: any) => {
      const { error } = await supabase.from('items').delete().eq('id', id);
      if (error) console.error('Delete error:', error);
    };

    const timer = setTimeout(() => {
      const [first, ...rest] = toastList;
      setToastList(rest);

      const updatedList = spendings?.filter((item: any) => item.id !== first.id);
      setSpendItems(updatedList);
      deletePermanent(first.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toastList, spendings, setSpendItems]);

// console.log('latestSpendings',latestSpendings)
  const handleDelete = (item: itemTypes) => {
    console.log('handle delete', item)
    setToastList(prev => [...prev, item]);
  };

  const handleEdit = (item: itemTypes) => {
    console.log('Edit ID:', item);
  };

  const handleUndo = (id: string | number | undefined) => {
    setToastList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className={`${spendingIsHidden && 'bg-slate-100'}`}>
      <header className={` py-4 flex justify-between items-center px-4`}>
            <div>
              <strong className='text-2xl custom-black'>Spendings</strong>
              <p className='text-sm text-gray-500'>
                {LongDateFormat(new Date(date))}
              </p>
            </div>
            <div>
              {
              spendingIsHidden
              ? <FaAngleUp size={24} className='md:hidden' onClick={()=> setSpendingIsHidden(!spendingIsHidden)}/>
              : <FaAngleDown size={24} className='md:hidden' onClick={()=> setSpendingIsHidden(!spendingIsHidden)}/>
            }
            </div>
      </header>
      <div className={`${spendingIsHidden && 'hidden'} w-full px-4 pb-10`}>
        {toastList.length > 0 && (
          <ToastDelete toastList={toastList} onClick={handleUndo} duration={5} />
        )}
        <div className='overflow-x-auto h-full'>
          {spendings?
            <SpentTable 
                data={spendings}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                toastList={toastList}
              /> :<div className='w-full flex justify-center'>
                <strong className='text-orange-700'>There's no Record Available.</strong>
              </div>
          }
        </div>
        {
          spendings?.length > 6 && 
            <footer className='flex rounded-b-2xl justify-between py-3 px-4 bg-slate-100'>
              <div>Showing1-6 out of 12 items Show all</div>
              <div className='flex gap-4'>
                  <div className='text-blue-500'>{`Preview`}</div>
                  <div className='text-blue-500'>{`Next`}</div>
              </div>
            </footer>
        }
        
      </div>
    </div>
  );
};

export default SpentHistory;
