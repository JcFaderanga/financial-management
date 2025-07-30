import { useState, useEffect } from 'react';
import { useSpendings } from '@/store/useSpendingStore';
import type { itemTypes } from '@/types/itemTypes';
import { useOverviewDateStore } from '@/store/useOverviewDate';
import OverviewDate from '@/hooks/OverviewDate';
import { FaAngleDown, FaAngleUp, FaPen } from 'react-icons/fa6';
import CustomModal from '../modal/CustomModal';
import OverViewModal from './modals/OverViewModal';
import useFetchAllSpending from '@/hooks/spend_items/useFetchAllSpeding';
import type { datePropertyTypes } from '@/types/itemTypes';

type GroupedItem = {
  type: string;
  price: number;
  exclude: boolean;
};
const OverView = () => {
  const { spendings, setSpendItems } = useSpendings();
  const [isModal, setModal] = useState<boolean>(false);
  const { handleFetchAllSpendings } = useFetchAllSpending();
  const { setDate } = useOverviewDateStore();
  const { dateRange, timeRange } = OverviewDate();
  const [isSummary, setIsSummary] = useState<boolean>(false);
  const [isDateToEdit, setIsDateToEdit] = useState<boolean>(false);
  const [grouped, setNewGroup] = useState<GroupedItem[] | null>(null);


  // Group and summarize data when spendings change
  useEffect(() => {
    const groupedMap = spendings?.reduce((acc: Record<string, number>, item: any) => {
      if (!acc[item.category]) {
        acc[item.category] = item.price;
      } else {
        acc[item.category] += item.price;
      }
      return acc;
    }, {});

    const result: GroupedItem[] = Object.entries(groupedMap || {}).map(([type, price]) => ({
      type,
      price: Number(price),
      exclude: false,
    }));

    setNewGroup(result);
  }, [spendings]);

  // Total overview excluding items marked as exclude
  const totalOverview = grouped?.reduce((sum, item) => {
    if (item.exclude) return sum;
    return sum + item.price;
  }, 0) || 0;

  const totalSpending = spendings?.reduce((sum: number, item: itemTypes) => sum + Number(item.price), 0) || 0;

  const filterDate = async (date: string | datePropertyTypes) => {
    const res = await handleFetchAllSpendings(date);
    setSpendItems?.(res);
    setIsDateToEdit(!isDateToEdit);
    setModal(!isModal);
    setDate(date);
  };

  const updateGroup = (updatedItem: GroupedItem) => {
    const updatedGrouped = grouped?.map((item) =>
      item.type === updatedItem.type ? { ...item, exclude: !item.exclude } : item
    );
    setNewGroup(updatedGrouped || []);
  };

  return (
    <div className="pt-4 px-6">
      <div>
        <strong className="custom-black text-2xl">Overview</strong>
        <h2 className="text-slate-400 text-sm">
          {dateRange}
          <FaPen onClick={() => setModal(!isModal)} className="inline-block mx-1 cursor-pointer" />
        </h2>
        <h2 className="text-slate-400 text-sm">{timeRange}</h2>

        <CustomModal hidden={isModal} onClick={() => setModal(!isModal)}>
          <OverViewModal onChange={filterDate} />
        </CustomModal>
      </div>

      <section className="flex justify-center py-4 lg:py-20">
        <div>
          <p className="text-slate-400 text-center">Total spending</p>
          <strong className="text-5xl custom-black">₱{String(totalOverview?.toLocaleString())}</strong>
        </div>
      </section>
      {
      <section className={`${!isSummary ? 'hidden' : ''} lg:block py-4`}>
        {!grouped || grouped.length === 0 ? (
          <div className="w-full flex justify-center">
            <strong className="text-orange-700">There's no Record Available.</strong>
          </div>
        ) : (
          grouped
            ?.sort((a, b) => b.price - a.price)
            .map((item) => (
              <ul
                key={item.type}
                onClick={() => updateGroup(item)}
                className={`${
                  item.exclude && 'bg-slate-50'
                } flex justify-between py-4 px-2 border-t border-gray-300 cursor-pointer hover:bg-slate-50`}
              >
                <div className="flex">
                  <input type="checkbox" checked={!item.exclude} readOnly />
                  <li className="px-1">{item.type}</li>
                </div>
                <div className="w-1/2 flex justify-between">
                  <li>{((item.price / totalSpending) * 100).toFixed(2)}%</li>
                  <li>₱{item.price.toLocaleString()}</li>
                </div>
              </ul>
            ))
        )}
      </section>
      }
     

      <div onClick={() => setIsSummary(!isSummary)} className="text-center pb-8 lg:hidden">
        {!isSummary ? (
          <>
            Show more <FaAngleDown className="mx-auto" />
          </>
        ) : (
          <>
            <FaAngleUp className="mx-auto" /> Show less
          </>
        )}
      </div>
    </div>
  );
};

export default OverView;
