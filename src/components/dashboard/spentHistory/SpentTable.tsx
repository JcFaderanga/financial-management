import React from 'react';
import { CustomTable, CustomRow, CustomData } from '../../tables'; 
import { LiaTrashSolid, LiaPenSolid } from "react-icons/lia";
import { LongDateFormat } from '@/utils/DateFormat';
import { itemTypes } from '@/types/itemTypes';
import { MdOutlineFolderOpen } from "react-icons/md";
import { useSpendingExcluded } from '@/store/useSpendingStore';
import { useCategoryColors } from '@/store/useCatogoryColors';
import { useCallback } from 'react';
import { useModal } from '@/store/useModal';
import SpentEdit from './SpentEdit';
type SpentTableProps = {
  data: itemTypes[];
  toastList: any;
  handleEdit: (spent: itemTypes)=> void;
  handleDelete: (spent: itemTypes)=> void;
  handleGroup: (spent: itemTypes)=> void;
}

export const ActionMenu = ({
  onEdit,
  onDelete,
  onGroup,
  isGrouped,
}: {
  onEdit: () => void;
  onDelete: () => void;
  onGroup: () => void;
  isGrouped: any
}) => (
  <ul className='flex justify-center gap-2'>
    
    <li onClick={onEdit} className='flex items-center justify-center w-full px-4 py-2 cursor-pointer bg-blue-50 rounded-xl'>
        <LiaPenSolid className='text-blue-500' /> <span className='pl-2 text-blue-500'>Edit</span>
    </li>
    
    <li onClick={onDelete} className='flex items-center justify-center w-full px-4 py-2 cursor-pointer bg-red-50 rounded-xl'>
      <LiaTrashSolid className='text-red-500' /> <span className='pl-2 text-red-500'>Delete</span>
    </li>
    {isGrouped &&
        <li onClick={onGroup} className='flex items-center justify-center w-full px-4 py-2 cursor-pointer bg-orange-50 rounded-xl'>
          <MdOutlineFolderOpen className='text-orange-500' /> <span className='pl-2 text-orange-500'>Grouped</span>
        </li>
    }
   
  </ul>
);

//{data, handleEdit, handleDelete,handleGroup,toastList}
const SpentTable = ({data, toastList}:SpentTableProps) => {
  const {excluded} = useSpendingExcluded();
  const {colors: categoryColors} = useCategoryColors();
  const {setModal,setChild, isModal} = useModal();

 
  const selectedItem = useCallback((item: itemTypes) => {
      setModal(!isModal);
      setChild(<SpentEdit itemProps={item} />)
    },
    [isModal],
  )
   
  return (
    <>
    <CustomTable className=''>
          <tbody>
           {data?.map((spent: itemTypes) => {
              const isHidden = toastList?.some((item: any) => item.id === spent.id);
              if (isHidden) return null;

              const catBg = categoryColors.find(c => c.category === spent.category)?.color;

              return (
                <CustomRow 
                  key={spent.id} 
                  className={`
                    cursor-pointer hover:bg-slate-50 dark:hover:bg-light-dark dark:border-light-dark
                    border-b border-gray-100
                    ${excluded?.includes(spent?.category) && 'hidden'}
                  `} 
                  onClick={()=>selectedItem(spent )}
                >
                  <CustomData className='pl-2 dark:text-white'>
                    <div>
                      <div className='flex items-center'>
                        <span className={`h-2 w-2 rounded-full mr-1`} style={{ backgroundColor: catBg }} />
                        <strong className='text-xs opacity-30' >{spent.category}</strong>
                      </div>
                      <p className='text-sm md:text-base'>{spent.title}</p>
                    </div>
                  </CustomData>
                  <CustomData className='pr-2 text-right dark:text-white'>
                    <div>
                      <strong className='text-xs'>{LongDateFormat(new Date(spent.created_at))}</strong>
                      <p className='text-sm font-semibold text-red-400 md:text-base'>-₱{spent?.price?.toLocaleString()}</p>
                    </div>
                  </CustomData>
                </CustomRow>
              );
            })}
          </tbody>
        </CustomTable>
        </>
  )
}

export default React.memo(SpentTable)