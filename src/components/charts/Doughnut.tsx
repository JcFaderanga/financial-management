import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { itemTypes } from '@/types/itemTypes';
import useAssignedCategoryColors from '@/hooks/useAssignedCategoryColors';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: itemTypes[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
  const groupedMap = data?.reduce((acc: Record<string, number>, item: any) => {
    acc[item.category] = (acc[item.category] || 0) + item.price;
    return acc;
  }, {});

  const labels = Object.keys(groupedMap);
  const values = Object.values(groupedMap);
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
