import  { useEffect, useState } from 'react';
import { useSpendings } from '@/store/useSpendingStore';
import { ToastDelete } from '../../tostify/Toast';
import type { itemTypes } from '@/types/itemTypes';
import supabase from '@/lib/supabase';
import SpentTable from './SpentTable';
// import { FaAngleUp,FaAngleDown } from "react-icons/fa6";
import OverviewDate from '@/hooks/OverviewDate';
import SpentEdit from './SpentEdit';
import GroupSpending from './GroupSpending';
// Action buttons (Edit, Delete)
import { useActionItem } from '@/store/useActionItem';
import { NoRecord } from '@/components/NoRecord';
import { useModal } from '@/store/useModal';

const SpentHistory = () => {
  const { spendings, setSpendItems } = useSpendings();
  const [toastList, setToastList] = useState<itemTypes[]>([]);
  const [isItemEdit, setIsItemEdit] = useState<boolean>(false);
  const [spendingIsHidden] = useState<boolean>(false);
  const {dateRange, timeRange} = OverviewDate();
  const {setSelected} = useActionItem()
  const {isModal, setChild,setModal} = useModal();

  useEffect(()=>{
    if(!isItemEdit)
    setSelected(null)
  },[isItemEdit])

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
    setSelected(null);
    setToastList(prev => [...prev, item]);
    
  };

  const handleUndo = (id: string | number | undefined) => {
    setToastList(prev => prev.filter(item => item.id !== id));
  };

  const handleEdit= (data: itemTypes)=>{
    setIsItemEdit(!isItemEdit)
    setModal(!isModal);
    setChild(<SpentEdit itemProps={data}/>)
  }

  const handleGroup =(data: itemTypes)=>{
    setModal(!isModal);
    setChild(<GroupSpending groupId={data?.grouped_in}/>)
  }
  
  return (
    <div className={`${spendingIsHidden && 'bg-slate-100'}`}>
      <header className={` py-4 flex justify-between items-center`}>
          <strong className='text-dark dark:text-white'>Spendings</strong>
          <div>
              <p className='text-sm text-gray-400'>{dateRange}</p>
              <p className='text-sm text-gray-400'>{timeRange}</p>
          </div>
      </header>
      <div className={`${spendingIsHidden && 'hidden'} w-full pb-10`}>
        {toastList.length > 0 && (
          <ToastDelete toastList={toastList} onClick={handleUndo} duration={5} />
        )}
        <div className='h-full overflow-x-auto'>
          { spendings && spendings?.length > 0 ?
            <SpentTable 
                data={spendings}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleGroup={handleGroup}
                toastList={toastList}
              /> : <div className='flex justify-center w-full'>
                <NoRecord/>
              </div>
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
