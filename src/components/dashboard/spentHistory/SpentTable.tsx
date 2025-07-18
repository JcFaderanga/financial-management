import { CustomTable, CustomRow, CustomData, CustomHeader } from '../../tables'; 
import { LiaTrashSolid, LiaPenSolid } from "react-icons/lia";
import { LongDateFormat } from '@/utils/DateFormat';
import { itemTypes } from '@/types/itemTypes';
import { MdOutlineFolderOpen } from "react-icons/md";
type SpentTableProps = {
  data: itemTypes[];
  toastList: any;
  handleEdit: (spent: itemTypes)=> void;
  handleDelete: (spent: itemTypes)=> void;
  handleGroup: (spent: itemTypes)=> void;
}

const ActionMenu = ({
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
  <ul className='flex gap-2'>
    <li onClick={onEdit} className='p-2 bg-blue-50 rounded-xl cursor-pointer'>
      <LiaPenSolid className='text-blue-500' />
    </li>
    <li onClick={onDelete} className='p-2 bg-red-50 rounded-xl cursor-pointer'>
      <LiaTrashSolid className='text-red-500' />
    </li>
    {isGrouped &&
        <li onClick={onGroup} className='p-2 bg-orange-50 rounded-xl cursor-pointer'>
          <MdOutlineFolderOpen className='text-orange-500' />
        </li>
    }
   
  </ul>
);

const SpentTable = ({data, handleEdit, handleDelete,handleGroup,toastList}:SpentTableProps) => {
  return (
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
            {data?.map((spent: itemTypes) => {
              const isHidden = toastList?.some((item: any) => item.id === spent.id);
              if (isHidden) return null;

              return (
                <CustomRow key={spent.id} className='text-sm'>
                  <CustomData>{spent.id}</CustomData>
                  <CustomData>{spent.category}</CustomData>
                  <CustomData>{spent.title}</CustomData>
                  <CustomData>₱{spent?.price?.toLocaleString()}</CustomData>
                  <CustomData>{LongDateFormat(new Date(spent.created_at))}</CustomData>
                  <CustomData>
                    <ActionMenu
                      onEdit={() => handleEdit(spent)}
                      onDelete={() => handleDelete(spent)}
                      onGroup={() => handleGroup(spent)}
                      isGrouped={spent?.grouped_in}
                    />
                  </CustomData>
                </CustomRow>
              );
            })}
          </tbody>
        </CustomTable>
  )
}

export default SpentTable