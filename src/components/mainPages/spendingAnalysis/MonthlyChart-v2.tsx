import { useEffect, useState } from "react";
import NumberFlowUI from "@/components/UI/NumberFlow";
import useFetchAllTransactions from "@/hooks/Analytics/SpendingBarChart";
import { useAllSpendingData } from "@/store/useSpendingStore";
import { itemTypes } from "@/types/itemTypes";
import { TotalPerDayAndMonth } from "@/utils/itemFormat";

// Define the shape of each month's data
interface MonthlyData {
  month: string;
  total: number;
}

// Month labels
const months = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
];

const MonthlyChart = () => {
  const { allSpentData } = useAllSpendingData();
  const [monthlyTotal, setMonthlyTotal] = useState<MonthlyData[]>([]);
  const [PrevYearMonthlyTotal, setPrevYearMonthlyTotal] = useState<MonthlyData[]>([]);
  const { data, fetchYearlyRecordedSpendings } = useFetchAllTransactions();

  // Fetch yearly grouped data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchYearlyRecordedSpendings();
      } catch (error) {
        console.error("Error fetching yearly recorded spendings:", error);
      }
    };

    fetchData();
  }, []);

useEffect(() => {
    if (!data || !(data instanceof Map)) {
        setMonthlyTotal(
            months.map((month) => ({
                month,
                total: 0,
            }))
        );
        return;
    }

    const totalsMap: Record<string, number> = {};

    data.forEach((value, key) => {
        // key is already "2026-04"
        const monthIndex = Number(key.split("-")[1]) - 1;
        const monthKey = months[monthIndex];

        totalsMap[monthKey] = value;
    });

    const totals = months.map((month) => ({
        month,
        total: totalsMap[month] || 0,
    }));

    setMonthlyTotal(totals);
}, [data]);

  useEffect(() => {
     if (!allSpentData || allSpentData.length === 0) {
        setMonthlyTotal(
          months.map((month) => ({
            month,
            total: 0,
          }))
        );
        return;
      }

      const totalsMap: Record<string, number> = {};

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
      const totals = months.map((month) => ({
         month,                         // e.g. "march"
        total: totalsMap[month] || 0,  // Use value from map or 0 if missing
      }));

      setPrevYearMonthlyTotal(totals);
    }, [data]);
  }, [allSpentData]);

  // ✅ Total based on transformed data (correct source)PrevYearMonthlyTotal
  const currentYearTotal = monthlyTotal.reduce((sum, m) => sum + m.total, 0);
  const prevYearTotal = PrevYearMonthlyTotal.reduce((sum, m) => sum + m.total, 0);
  return (
    <section className="lg:flex">
      {/* <div className="lg:w-2/6"></div> */}

      <div className="flex py-4 gap-4 rounded-xl lg:w-2/3 overflow-x-scroll lg:overflow-auto">
        {months.map((month, index) => {
          const current = monthlyTotal[index]?.total || 0;
          const previous = PrevYearMonthlyTotal[index]?.total || 0;

          const currentPercent = currentYearTotal
            ? (current / currentYearTotal) * 100
            : 0;

          const previousPercent = prevYearTotal
            ? (previous / prevYearTotal) * 100
            : 0;

          return (
            <div key={month} className="flex flex-col items-center">

              <div className="h-60 flex items-end">

                {/* CURRENT YEAR */}
                <div className="h-60 flex flex-col items-center justify-end">
                  <div className="text-[10px] dark:text-white">
                    <NumberFlowUI value={current} currency="PHP" style="currency" />
                  </div>

                  <div
                    className="bg-blue-400 w-10 rounded-lg"
                    style={{ height: `${currentPercent * 2}%` }}
                  />
                </div>

                {/* PREVIOUS YEAR */}
                <div className="h-60 flex flex-col items-center justify-end">
                  <div className="text-[10px] dark:text-white hidden">
                    <NumberFlowUI value={previous} currency="PHP" style="currency" />
                  </div>

                  <div
                    className="bg-blue-300 opacity-30 w-7 rounded-lg"
                    style={{ height: `${previousPercent * 2}%` }}
                  />
                </div>

              </div>

              <div className="text-center text-sm mt-2 dark:text-white">
                {month.charAt(0).toUpperCase() + month.slice(1)}
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
};

export default MonthlyChart;