import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAllSpendingData } from '@/store/useSpendingStore';
import { TotalPerDayAndMonth } from '@/utils/itemFormat';
import { itemTypes } from '@/types/itemTypes';
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface MonthlyData {
  month: string;
  total: number;
}

const months = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

const BarChart = () => {
  const { allSpentData } = useAllSpendingData();
  const [monthlyTotal, setMonthlyTotal] = useState<MonthlyData[]>([]);

  useEffect(() => {
    if (!allSpentData || allSpentData.length === 0) return;

    const uniqueMonths = Array.from(
      new Set(allSpentData.map((item: itemTypes) => item.created_at.slice(0, 7)))
    );

    const totals = uniqueMonths.map((dateStr) => {
        const date = new Date(String(dateStr));
        const monthIndex = new Date(date).getMonth();
        const monthText = months[monthIndex];
        const monthTotal = new TotalPerDayAndMonth(allSpentData, date);

        return {
            month: monthText,
            total: monthTotal.getTotalPerMonth(),
        };
    });

    setMonthlyTotal(totals);
  }, [allSpentData]);

  console.log(monthlyTotal)
  const data = {
    labels: [...monthlyTotal].reverse().map((item) => item.month),
    datasets: [
      {
        label: '', // no label for clean look
        data: [...monthlyTotal].reverse().map((item) => item.total),
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderRadius: 20,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: true,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          display: true,
          beginAtZero: true,
        },
      },
    },
  } as const;

  return <Bar data={data} options={options} />;
};

export default BarChart;
