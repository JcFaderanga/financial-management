import { LiaTrashSolid, LiaPenSolid } from "react-icons/lia"; 
 import { MdOutlineFolderOpen } from "react-icons/md";
 
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