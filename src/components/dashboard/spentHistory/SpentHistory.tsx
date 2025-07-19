import  { useEffect, useState } from 'react';
import { useSpendings } from '@/store/useSpendingStore';
import { ToastDelete } from '../../tostify/Toast';
import type { itemTypes } from '@/types/itemTypes';
import supabase from '@/lib/supabase';
import SpentTable from './SpentTable';
import { FaAngleUp,FaAngleDown } from "react-icons/fa6";
import OverviewDate from '@/hooks/OverviewDate';
import CustomModal from '@/components/modal/CustomModal';
import SpentEdit from './SpentEdit';
import GroupSpending from './GroupSpending';
// Action buttons (Edit, Delete)

type ActionProps={
  status: boolean,
  item: itemTypes
}
const SpentHistory = () => {
  const { spendings, setSpendItems } = useSpendings();
  const [toastList, setToastList] = useState<itemTypes[]>([]);
  const [isItemEdit, setIsItemEdit] = useState<ActionProps>({status: false, item: {} });
  const [isViewGrouped, setIsViewGrouped] = useState<ActionProps>({status: false, item: {} });
  const [spendingIsHidden, setSpendingIsHidden] = useState<boolean>(false);
  const {dateRange, timeRange} = OverviewDate();


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
    setToastList(prev => [...prev, item]);
  };

  // const handleEdit = (item: itemTypes) => {
  //   console.log('Edit ID:', item);
  //   setIsItemEdit(!isItemEdit)
  // };

  const handleUndo = (id: string | number | undefined) => {
    setToastList(prev => prev.filter(item => item.id !== id));
  };


  return (
    <div className={`${spendingIsHidden && 'bg-slate-100'}`}>
      <header className={` py-4 flex justify-between items-center px-4`}>
            <div>
              <strong className='text-2xl custom-black'>Spendings</strong>
              <p className='text-sm text-gray-400'>{dateRange}</p>
              <p className='text-sm text-gray-400'>{timeRange}</p>
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
                handleEdit={(prev => setIsItemEdit({status: true, item: prev}))}
                handleDelete={handleDelete}
                handleGroup={(prev => setIsViewGrouped({status: true, item: prev}))}
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

      {/* Modals */}
     
        <CustomModal 
        hidden={isItemEdit?.status}
        onClick={()=>setIsItemEdit({...isItemEdit, status: !isItemEdit.status})}>
          <SpentEdit itemProps={isItemEdit?.item} setIsItemEdit={()=>setIsItemEdit({...isItemEdit, status: !isItemEdit.status})}/>
        </CustomModal>
        <CustomModal 
        hidden={isViewGrouped?.status}
        onClick={()=>setIsViewGrouped({...isViewGrouped, status: !isViewGrouped.status})}>
          <GroupSpending groupId={isViewGrouped?.item?.grouped_in}/>
        </CustomModal>
        
    </div>
  ); 
};

export default SpentHistory;
