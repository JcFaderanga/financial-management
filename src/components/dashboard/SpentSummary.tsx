import { useState, useEffect, useMemo } from "react";
import { useSpendings, useSpendingExcluded } from '@/store/useSpendingStore';
import { itemTypes } from "@/types/itemTypes";
import { useOverviewTotal } from "@/store/useOverviewTotal";
import { NoRecord } from "../NoRecord";

type GroupedItem = {
  type: string;
  price: number;
  exclude: boolean;
};

const SpentSummary = () => {
  const { spendings } = useSpendings();
  const { setItemExclude } = useSpendingExcluded();
  const { setTotal } = useOverviewTotal();
  const [grouped, setNewGroup] = useState<GroupedItem[] | null>(null);
  const [allSelected, setAllSelected] = useState<boolean>(true);

  // Memoized total spending for percentage calculation
  const totalSpending = useMemo(() => {
    return spendings?.reduce((sum: number, item: itemTypes) => sum + Number(item.price), 0) || 0;
  }, [spendings]);

  // Group spendings by category
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

  // Update excluded categories for filtering
  useEffect(() => {
    const excludedTypes = grouped
      ?.filter(g => g.exclude)
      .map(g => g.type);

    setItemExclude(excludedTypes);
  }, [grouped]);

  // Calculate total excluding excluded items
  useEffect(() => {
    const totalIncluded = grouped?.reduce((sum, item) => {
      return item.exclude ? sum : sum + item.price;
    }, 0) || 0;

    setTotal(totalIncluded);
  }, [grouped]);

  // Toggle exclusion for individual item
  const updateGroup = (updatedItem: GroupedItem) => {
    const updatedGrouped = grouped?.map(item =>
      item.type === updatedItem.type
        ? { ...item, exclude: !item.exclude }
        : item
    );
    setNewGroup(updatedGrouped || []);
  };

  // Toggle select/deselect all
  const setAll = () => {
  const nextAllSelected = !allSelected;

  const updatedGrouped = grouped?.map(item => ({
    ...item,
    exclude: nextAllSelected ? false : true, // clearly set instead of toggling
  }));

  setAllSelected(nextAllSelected);
  setNewGroup(updatedGrouped || []);
};

  return (
    <section>
      <div className="px-2 pt-2 text-sm text-gray-500 cursor-pointer" onClick={setAll}>
        <input
          type="checkbox"
          checked={allSelected}
          readOnly
          onClick={()=> setAll()}
        />
        <i className="px-1">Select all</i>
      </div>

      {!grouped || grouped.length === 0 ? (
        <div className="w-full flex justify-center">
          <NoRecord />
        </div>
      ) : (
        grouped
          ?.sort((a, b) => b.price - a.price)
          .map(item => (
            <div
              key={item.type}
              onClick={() => updateGroup(item)}
              className={`${
                  item.exclude && 'bg-slate-50'
                } flex justify-between py-2 px-2 border-b border-gray-100 nth-last-[1]:border-none cursor-pointer hover:bg-slate-50`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={!item.exclude}
                  readOnly
                  
                />
                <div className="px-1 text-sm">{item.type}</div>
              </div>
              <div className="text-end">
                <div className="font-semibold text-sm">₱{item.price.toLocaleString()}</div>
                <div className="text-sm text-gray-400">
                  {((item.price / totalSpending) * 100).toFixed(2)}%
                </div>
              </div>
            </div>
          ))
      )}
    </section>
  );
};

export default SpentSummary;
