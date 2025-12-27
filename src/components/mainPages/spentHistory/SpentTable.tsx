import React, { useMemo } from 'react';
import { CustomTable, CustomRow, CustomData } from '../../tables'; 
import { itemTypes } from '@/types/itemTypes';
import { useSpendingExcluded } from '@/store/useSpendingStore';
import { useCategoryColors } from '@/store/useCatogoryColors';
import { CategoryIcon } from '@/utils/DropDownList';
import {format} from 'date-fns'
import SpentTableSkeleton from './SpentTableSkeleton';

type SpentTableProps = {
  data: itemTypes[];
  loading?: boolean;
  handleEdit: (spent: itemTypes)=> void;
};

const SpentTable = ({ data ,handleEdit, loading}: SpentTableProps) => {
  const { excluded } = useSpendingExcluded();
  const { colors: categoryColors } = useCategoryColors();

  // Group items by date
  const groupedData = useMemo(() => {
  return data?.reduce((groups: Record<string, itemTypes[]>, item) => {
    // Format the date with date-fns
    const formattedDate = format(new Date(item?.created_at), 'MMMM d, yyyy');

    if (!groups[formattedDate]) {
      groups[formattedDate] = [];
    }
    groups[formattedDate].push(item);

    return groups;
  }, {});
}, [data]);

  if(loading){
    return <SpentTableSkeleton/>
  }
  
  return (
    <>
      {Object.entries(groupedData).map(([date, items]) => (
        <div key={date} className="mb-4">
          {/* Date heading */}
          <h2 className="text-sm font-bold rounded-xl py-2 px-4 bg-slate-200 dark:bg-medium-dark lg:dark:bg-dark  dark:text-white mb-2">
            {date}
          </h2>
          
          <CustomTable>
            <tbody>
              {[...items].reverse().map((spent: itemTypes) => {
                const catBg = categoryColors.find(c => c.category === spent.category)?.color;
                return (
                    
                    <CustomRow key={spent.id} onClick={()=>handleEdit(spent)}
                      className={`
                        cursor-pointer hover:bg-slate-50 dark:hover:bg-light-dark dark:border-light-dark
                        border-b border-gray-100 flex justify-between w-full
                        ${excluded?.includes(spent?.category) && 'hidden'}
                      `}>
                      <CustomData className="dark:text-white flex items-center py-4">
                        <span
                          className="text-2xl font-bold text-white px-1 rounded-full mr-2"
                          style={{ color: catBg }}
                        >
                          {CategoryIcon[spent?.category!]}
                        </span>
                        <div className="flex flex-col">
                          
                          <p className="text-sm font-semibold md:text-base">{spent.title}</p>
                          <p className="text-xs leading-2.5 text-gray-400 font-semibold md:text-base">{spent.sub_category}</p>
                        </div>
                      </CustomData>

                      <CustomData className="text-right dark:text-white">
                        <p className="text-sm font-semibold text-red-400 md:text-base">
                          -₱{spent?.price?.toLocaleString()}
                        </p>
                      </CustomData>
                    </CustomRow>
                 
                );
              })}
            </tbody>
          </CustomTable>
        </div>
      ))}
    </>
  );
};

export default React.memo(SpentTable);
