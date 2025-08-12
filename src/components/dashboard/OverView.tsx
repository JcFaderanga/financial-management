// import { useState } from 'react';
// import { useSpendings } from '@/store/useSpendingStore';
// import type { itemTypes } from '@/types/itemTypes';
// import { useOverviewDateStore } from '@/store/useOverviewDate';
import OverviewDate from '@/hooks/OverviewDate';
// import { FaAngleDown, FaAngleUp, FaPen } from 'react-icons/fa6';
// import CustomModal from '../modal/CustomModal';
// import OverViewModal from './modals/OverViewModal';
// import useFetchAllSpending from '@/hooks/spend_items/useFetchAllSpeding';
// import type { datePropertyTypes } from '@/types/itemTypes';
import { useOverviewTotal } from '@/store/useOverviewTotal';
import NumberFlowUI from '../UI/NumberFlow';
const OverView = () => {
  // const { setSpendItems } = useSpendings();
  // const [isModal, setModal] = useState<boolean>(false);
  // const { handleFetchAllSpendings } = useFetchAllSpending();
  // const { setDate } = useOverviewDateStore();
  const {timeRange } = OverviewDate();
  // const [isDateToEdit, setIsDateToEdit] = useState<boolean>(false);
  const {total} = useOverviewTotal();


  // const filterDate = async (date: string | datePropertyTypes) => {
  //   const res = await handleFetchAllSpendings(date);
  //   setSpendItems?.(res);
  //   setIsDateToEdit(!isDateToEdit);
  //   setModal(!isModal);
  //   setDate(date);
  // };

  return (
    <div className="text-center items-center justify-between ">
      <div>
        <p className="text-slate-400 md:text-xl">Expenses</p>
        {/* <h2 className="text-sm text-slate-400">
          {dateRange}
          <FaPen onClick={() => setModal(!isModal)} className="inline-block mx-1 cursor-pointer" />
        </h2> */}
        <h2 className="text-sm text-slate-400 ">{timeRange}</h2>

        {/* <CustomModal hidden={isModal} onClick={() => setModal(!isModal)}>
          <OverViewModal onChange={filterDate} />
        </CustomModal> */}
      </div>

      <section className="text-center"> 
        <strong className="text-2xl md:text-3xl dark:text-white !text-red-400">
            <NumberFlowUI
              value={total}
              currency='PHP'
              style='currency'
            />
        </strong>
      </section>

    </div>
  );
};

export default OverView;
