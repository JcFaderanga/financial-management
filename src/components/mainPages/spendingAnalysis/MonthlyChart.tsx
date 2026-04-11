import { useEffect, useState } from "react";
import NumberFlowUI from "@/components/UI/NumberFlow";
import useFetchAllTransactions from "@/hooks/Analytics/SpendingBarChart";

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
  const [monthlyTotal, setMonthlyTotal] = useState<MonthlyData[]>([]);
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

  // Transform Map → UI format
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
      // key format: "2026-04"
      const monthIndex = new Date(key).getMonth();
      const monthKey = months[monthIndex];

      // Use outFlow as total
      totalsMap[monthKey] = value.outFlow;
    });

    const totals = months.map((month) => ({
      month,
      total: totalsMap[month] || 0,
    }));

    setMonthlyTotal(totals);
  }, [data]);

  // ✅ Total based on transformed data (correct source)
  const totalAll = monthlyTotal.reduce((sum, m) => sum + m.total, 0);

  return (
    <section className="lg:flex">
      {/* <div className="lg:w-2/6"></div> */}

      <div className="flex py-4 gap-4 rounded-xl lg:w-2/3 overflow-x-scroll lg:overflow-auto">
        {monthlyTotal.map((e) => {
          const percent = totalAll
            ? ((e.total / totalAll) * 100).toFixed(2)
            : 0;
          
          // const mock_percent_bar1 = Math.random() * 100; // Mock percentage for testing
          // const mock_percent_bar2 = Math.random() * 100; 
          if (e.total)
            return (
              <div key={e.month} className="h-60 flex flex-col justify-end items-center">
                
                <div className="h-60 flex flex-col justify-end ">
                  <div className="text-[10px] dark:text-white">
                  
                    <NumberFlowUI
                      value={e.total}
                      currency="PHP"
                      style="currency"
                    />
                  </div>

                
                  <div
                    className="bg-blue-300 w-10 rounded-lg mx-auto hover:bg-blue-400 cursor-pointer"
                    style={{ height: `${Number(percent) * 3}%` }}
                  />

                </div>

                <div className="text-center text-sm mt-2 dark:text-white">
                  {e.month.charAt(0).toUpperCase() + e.month.slice(1)}
                </div>
                
              </div>
            );
        })}
      </div>
    </section>
  );
};

export default MonthlyChart;