import { CustomTable, CustomRow, CustomData } from '../../tables'; 
import { LiaTrashSolid, LiaPenSolid } from "react-icons/lia";
import { useActionItem } from '@/store/useActionItem';
import { LongDateFormat } from '@/utils/DateFormat';
import { itemTypes } from '@/types/itemTypes';
import { MdOutlineFolderOpen } from "react-icons/md";
import { useSpendingExcluded } from '@/store/useSpendingStore';
import { useCategoryColors } from '@/store/useCatogoryColors';
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
  <ul className='flex gap-2 justify-center'>
    
    <li onClick={onEdit} className='w-full py-2 bg-blue-50 rounded-xl cursor-pointer flex items-center justify-center px-4'>
        <LiaPenSolid className='text-blue-500' /> <span className='pl-2 text-blue-500'>Edit</span>
    </li>
    
    <li onClick={onDelete} className='w-full py-2 bg-red-50 rounded-xl cursor-pointer flex items-center justify-center px-4'>
      <LiaTrashSolid className='text-red-500' /> <span className='pl-2 text-red-500'>Delete</span>
    </li>
    {isGrouped &&
        <li onClick={onGroup} className='w-full py-2 bg-orange-50 rounded-xl cursor-pointer flex items-center justify-center px-4'>
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
  const selectRow =(item: any)=>{
      setSelected(selected === item ? null : item)
  }
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
                    ${selected?.id === spent.id && 'bg-blue-50'} 
                    cursor-pointer hover:bg-slate-50 dark:hover:bg-light-dark dark:border-light-dark
                    ${excluded?.includes(spent?.category) && 'hidden'}
                  `} 
                  onClick={() => selectRow(spent)}
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
                  <CustomData className='text-right pr-2 dark:text-white'>
                    <div>
                      <strong className='text-xs'>{LongDateFormat(new Date(spent.created_at))}</strong>
                      <p className='text-sm md:text-base text-red-400 font-semibold'>-₱{spent?.price?.toLocaleString()}</p>
                    </div>
                  </CustomData>
                </CustomRow>
              );
            })}
          </tbody>
        </CustomTable>
        {
      
      selected && 
      <div className="w-full fixed flex justify-center bottom-0 border-t border-gray-300  py-4 left-0 bg-white box-shadow ">
          <div className='p-2 w-2/3 max-w-xl '>
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

export default SpentTable