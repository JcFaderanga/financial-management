import React from 'react';
import { CustomTable, CustomRow, CustomData } from '../../tables'; 
import { LiaTrashSolid, LiaPenSolid } from "react-icons/lia";
import { useActionItem } from '@/store/useActionItem';
import { LongDateFormat } from '@/utils/DateFormat';
import { itemTypes } from '@/types/itemTypes';
import { MdOutlineFolderOpen } from "react-icons/md";
import { useSpendingExcluded } from '@/store/useSpendingStore';
import { useCategoryColors } from '@/store/useCatogoryColors';
import { useCallback } from 'react';
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
const SpentTable = ({data, handleEdit, handleDelete,handleGroup, toastList}:SpentTableProps) => {
  const {setSelected,selected} = useActionItem()
  const {excluded} = useSpendingExcluded();
  const {colors: categoryColors} = useCategoryColors();

  const selectRow = useCallback((item: any)=>{
    setSelected(selected === item ? null : item)
  },[selected])
 
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
                    ${selected?.id === spent.id && 'bg-blue-50 dark:bg-light-dark'} 
                    cursor-pointer hover:bg-slate-50 dark:hover:bg-light-dark dark:border-light-dark
                    border-b border-gray-100
                    ${excluded?.includes(spent?.category) && 'hidden'}
                  `} 
                  onClick={()=>selectRow(spent)}
                >
                  <CustomData className='pl-2 dark:text-white'>
                    <div>
                      <div className='flex items-center'>
                        <span className={`h-2 w-2 rounded-full mr-1`} style={{ backgroundColor: catBg }} />
                        <strong className='text-xs' >{spent.category}</strong>
                      </div>
                      <p className='text-sm md:text-base'>{spent.title}</p>
                    </div>
                  </CustomData>
                  <CustomData className='pr-2 text-right dark:text-white'>
                    <div>
                      {spent.id}
                      <strong className='text-xs'>{LongDateFormat(new Date(spent.created_at))}</strong>
                      <p className='text-sm font-semibold text-red-400 md:text-base'>-₱{spent?.price?.toLocaleString()}</p>
                    </div>
                  </CustomData>
                </CustomRow>
              );
            })}
          </tbody>
        </CustomTable>
        {
      
      selected && 
      <div className="fixed bottom-0 left-0 flex justify-center w-full py-4 bg-white border-t border-gray-300 box-shadow ">
          <div className='w-2/3 max-w-xl p-2 '>
              <ActionMenu
                  onEdit={() => handleEdit(selected)}
                  onDelete={() => handleDelete(selected)}
                  onGroup={() => handleGroup(selected)}
                  isGrouped={selected?.grouped_in}
              />
          </div>
      </div>
    }
        </>
  )
}

export default React.memo(SpentTable)