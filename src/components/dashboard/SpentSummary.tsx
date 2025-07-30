import { useState,useEffect } from "react";
import { useSpendings } from '@/store/useSpendingStore';
import { itemTypes } from "@/types/itemTypes";
import { useOverviewTotal } from "@/store/useOverviewTotal";
type GroupedItem = {
    type: string;
    price: number;
    exclude: boolean;
};
const SpentSummary = () => {
    const { spendings } = useSpendings();
    const {setTotal} = useOverviewTotal();
    const [grouped, setNewGroup] = useState<GroupedItem[] | null>(null);
  const totalSpending = spendings?.reduce((sum: number, item: itemTypes) => sum + Number(item.price), 0) || 0;
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
  useEffect(()=>{
      setTotal(grouped?.reduce((sum, item) => {
            if (item.exclude) return sum;
            return sum + item.price;
        }, 0) || 0
      )
  },[grouped])

  const updateGroup = (updatedItem: GroupedItem) => {
    const updatedGrouped = grouped?.map((item) =>
      item.type === updatedItem.type ? { ...item, exclude: !item.exclude } : item
    );
    setNewGroup(updatedGrouped || []);
  };
  return (
    <section className="">
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
                } flex justify-between py-2 px-2 border-b border-gray-100 nth-last-[1]:border-none cursor-pointer hover:bg-slate-50`}
              >
                <div className="flex items-center">
                  <input type="radio" checked={!item.exclude} readOnly />
                  <li className="px-1">{item.type}</li>
                </div>
                <div className="">
                  <li className="font-semibold text-end">₱{item.price.toLocaleString()}</li>
                  <li className="text-sm text-end text-gray-400">{((item.price / totalSpending) * 100).toFixed(2)}%</li>
                </div>
              </ul>
            ))
        )}
      </section>
  )
}

export default SpentSummary