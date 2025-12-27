import { useEffect, useState } from "react";
import { useAllSpendingData } from "@/store/useSpendingStore";
import { itemTypes } from "@/types/itemTypes";
import { TotalPerDayAndMonth, CalculateTotal } from "@/utils/itemFormat";
import NumberFlowUI from "@/components/UI/NumberFlow";
// Define the shape of each month's data
interface MonthlyData {
  month: string; // Month name like "january"
  total: number; // Total amount spent that month
}

// Array of month names, used to label and map data
const months = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
];

const MonthlyChart = () => {
  const { allSpentData } = useAllSpendingData();
  const [monthlyTotal, setMonthlyTotal] = useState<MonthlyData[]>([]);

  // useEffect runs when `allSpentData` changes
  useEffect(() => {
    // If no data, initialize all 12 months with 0 total
    if (!allSpentData || allSpentData.length === 0) {
      setMonthlyTotal(
        months.map((month) => ({
          month,
          total: 0,
        }))
      );
      return; // Stop here if no data
    }

    // Create a map to temporarily store totals by month name
    const totalsMap: Record<string, number> = {};

    // Go through each spending item
    allSpentData.forEach((item: itemTypes) => {
      // Extract only the year and month (e.g., "2025-08")
      const dateStr = item.created_at.slice(0, 7);

      // Convert to Date and get the month index (0 = Jan, 1 = Feb, ...)
      const monthIndex = new Date(dateStr).getMonth();

      // Get the month name (e.g., "august")
      const key = months[monthIndex];

      // If this month hasn’t been initialized in the map, set it to 0
      if (!totalsMap[key]) totalsMap[key] = 0;

      // Use your utility class to calculate the total for this specific month
      const monthTotal = new TotalPerDayAndMonth(allSpentData, dateStr);

      // Store the calculated total in the map (overwrites if already exists)
      totalsMap[key] = monthTotal.getTotalPerMonth();
    });

    // Convert the map into a full array of 12 months
    const totals = months.map((month) => ({
      month,                         // e.g. "march"
      total: totalsMap[month] || 0,  // Use value from map or 0 if missing
    }));

    // Save the result to state for rendering
    setMonthlyTotal(totals);
  }, [allSpentData]);

  // Calculate the grand total of all spending
  const totalAll = CalculateTotal(allSpentData);

// Container grid for 12 columns (1 per month)
  return (
  <section className="lg:flex">
    <div className=" lg:w-2/6"></div>
    <div className="flex py-4 gap-4 rounded-xl lg:w-2/3 overflow-x-scroll lg:overflow-auto">
      {/* Reverse the months so the most recent is first */}
      {monthlyTotal.map((e) => {
        // Calculate percentage of this month's spending vs total
        const percent = ((e.total / totalAll) * 100).toFixed(2);
        
        if(e.total)
        return (
          // One bar per month
          <div key={e.month} className=" flex flex-col justify-end items-center">
            {/* Visual bar with dynamic height based on % */}
            <div className="h-60  flex flex-col justify-end">
              <div className="text-[10px] dark:text-white">
              <NumberFlowUI
                  value={e.total}
                  currency='PHP'
                  style='currency'
                />
            </div>
              <div
              className="bg-blue-300 w-10 rounded-lg mx-auto hover:bg-blue-400 cursor-pointer"
              style={{ height: `${Number(percent) * 4}%` }}
            />
            </div>
            
            {/* Label for month and percentage */}
            <div className="text-center text-sm mt-2 dark:text-white">
              {e.month.charAt(0).toUpperCase() + e.month.slice(1)}
            </div>
          </div>
        );
      })}
    </div>
  </section>);
};

export default MonthlyChart;
