import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { itemTypes } from '@/types/itemTypes';
import useAssignedCategoryColors from '@/hooks/useAssignedCategoryColors';
import { CategoryAndPrice } from '@/utils/itemFormat';
ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: itemTypes[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {

  const grouped = new CategoryAndPrice(data);
  const labels = Object.keys(grouped.grouped());
  const values = Object.values(grouped.grouped())
  const categoryColors = useAssignedCategoryColors(labels);
  const backgroundColor = categoryColors.map(c => c.color);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            return `₱${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;
