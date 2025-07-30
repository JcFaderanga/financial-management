import { useState } from 'react';
import { useSpendings } from '@/store/useSpendingStore';
// import type { itemTypes } from '@/types/itemTypes';
import { useOverviewDateStore } from '@/store/useOverviewDate';
import OverviewDate from '@/hooks/OverviewDate';
// import { FaAngleDown, FaAngleUp, FaPen } from 'react-icons/fa6';
import CustomModal from '../modal/CustomModal';
import OverViewModal from './modals/OverViewModal';
import useFetchAllSpending from '@/hooks/spend_items/useFetchAllSpeding';
import type { datePropertyTypes } from '@/types/itemTypes';
import { useOverviewTotal } from '@/store/useOverviewTotal';
const OverView = () => {
  const { setSpendItems } = useSpendings();
  const [isModal, setModal] = useState<boolean>(false);
  const { handleFetchAllSpendings } = useFetchAllSpending();
  const { setDate } = useOverviewDateStore();
  const {timeRange } = OverviewDate();
  const [isDateToEdit, setIsDateToEdit] = useState<boolean>(false);
  const {total} = useOverviewTotal();


  const filterDate = async (date: string | datePropertyTypes) => {
    const res = await handleFetchAllSpendings(date);
    setSpendItems?.(res);
    setIsDateToEdit(!isDateToEdit);
    setModal(!isModal);
    setDate(date);
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <strong className="custom-black md:text-xl">Overview</strong>
        <p className="text-slate-400">Total spending</p>
        {/* <h2 className="text-slate-400 text-sm">
          {dateRange}
          <FaPen onClick={() => setModal(!isModal)} className="inline-block mx-1 cursor-pointer" />
        </h2> */}
        <h2 className="text-slate-400 text-sm">{timeRange}</h2>

        <CustomModal hidden={isModal} onClick={() => setModal(!isModal)}>
          <OverViewModal onChange={filterDate} />
        </CustomModal>
      </div>

      <section className="flex">
        <div>
          
          <strong className="text-2xl md:text-3xl custom-black">₱{total.toLocaleString()}</strong>
        </div>
      </section>

    </div>
  );
};

export default OverView;
