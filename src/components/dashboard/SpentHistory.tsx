import  { useEffect, useState } from 'react';
import { CustomTable, CustomRow, CustomData, CustomHeader } from '../tables';
import { useSpendings } from '@/store/useSpendingStore';
import { LongDateFormat } from '@/utils/DateFormat';
import { LiaTrashSolid, LiaPenSolid } from "react-icons/lia";
import { ToastDelete } from '../tostify/Toast';
import { itemTypes } from '@/types/itemTypes';
import supabase from '@/lib/supabase';
import { useOverviewDateStore } from '@/store/useOverviewDate';
// Action buttons (Edit, Delete)
const ActionMenu = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <ul className='flex gap-2'>
    <li onClick={onEdit} className='p-2 bg-blue-50 rounded-xl cursor-pointer'>
      <LiaPenSolid className='text-blue-500' />
    </li>
    <li onClick={onDelete} className='p-2 bg-red-50 rounded-xl cursor-pointer'>
      <LiaTrashSolid className='text-red-500' />
    </li>
  </ul>
);

const SpentHistory = () => {
  const { spendings, setSpendItems } = useSpendings();
  const [toastList, setToastList] = useState<itemTypes[]>([]);
  const {date, setDate} = useOverviewDateStore();
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

      const updatedList = spendings.filter((item: any) => item.id !== first.id);
      setSpendItems(updatedList);
      deletePermanent(first.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toastList, spendings, setSpendItems]);

  if (!spendings) return null;

  const latestSpendings = spendings.filter((item: itemTypes)=>{
      const prev = new Date(item?.created_at);
      const now = new Date(date);

        return(
          prev.getFullYear() === now.getFullYear() &&
          prev.getDate() === now.getDate() &&
          prev.getMonth() === now.getMonth()
        )
  })  

  const handleDelete = (item: itemTypes) => {
    setToastList(prev => [...prev, item]);
  };

  const handleEdit = (item: itemTypes) => {
    console.log('Edit ID:', item);
  };

  const handleUndo = (id: string | number | undefined) => {
    setToastList(prev => prev.filter(item => item.id !== id));
  };

  console.log(new Date(date))
  return (
    <div className='w-full px-4 '>
      <header className='my-4'>
          <div className='flex justify-between items-center'>
            <strong className='text-2xl custom-black'>Spendings</strong>
            <input onChange={(date)=>setDate(date.target.value) } type='date' className=' py-1 px-4 bg-slate-100 rounded'/>
          </div>
          <div className='flex justify-between items-center'>
            
            <p className='text-sm text-gray-500'>
               {LongDateFormat(new Date(date))}
            </p>
          </div>
      </header>

      {toastList.length > 0 && (
        <ToastDelete toastList={toastList} onClick={handleUndo} duration={5} />
      )}
      <div className='overflow-x-auto'>
        <CustomTable>
          <thead className='bg-slate-100'>
            <CustomRow className='text-sm'>
              <CustomHeader className='py-3 rounded-tl-2xl'>ID</CustomHeader>
              <CustomHeader>Category</CustomHeader>
              <CustomHeader>Title</CustomHeader>
              <CustomHeader>Price</CustomHeader>
              <CustomHeader>Date</CustomHeader>
              <CustomHeader className='rounded-tr-2xl'>Actions</CustomHeader>
            </CustomRow>
          </thead>
          <tbody>
            {latestSpendings?.map((spent: itemTypes) => {
              const isHidden = toastList.some(item => item.id === spent.id);
              if (isHidden) return null;

              return (
                <CustomRow key={spent.id} className='text-sm'>
                  <CustomData>{spent.id}</CustomData>
                  <CustomData>{spent.category}</CustomData>
                  <CustomData>{spent.title}</CustomData>
                  <CustomData>₱{spent.price}</CustomData>
                  <CustomData>{LongDateFormat(new Date(spent.created_at!))}</CustomData>
                  <CustomData>
                    <ActionMenu
                      onEdit={() => handleEdit(spent)}
                      onDelete={() => handleDelete(spent)}
                    />
                  </CustomData>
                </CustomRow>
              );
            })}
          </tbody>
        </CustomTable>
      </div>
      {
        latestSpendings?.length > 6 && 
          <footer className='flex rounded-b-2xl justify-between py-3 px-4 bg-slate-100'>
            <div>Showing1-6 out of 12 items Show all</div>
            <div className='flex gap-4'>
                <div className='text-blue-500'>{`Preview`}</div>
                <div className='text-blue-500'>{`Next`}</div>
            </div>
          </footer>
      }
      
    </div>
  );
};

export default SpentHistory;
