import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { itemTypes } from '@/types/itemTypes'; // your type for { category, price }

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Props interface
interface DoughnutChartProps {
  data: itemTypes[];
}

// Function to generate Pastel Colors
const generatePastelColors = (count: number): string[] => {
  return Array.from({ length: count }, (_, i) => {
    const hue = Math.floor((360 / count) * i);      // evenly distributed hues
    return `hsl(${hue}, 70%, 75%)`;                 // pastel-like colors
  });
};


const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
    
  // Group data by category
  const groupedMap = data?.reduce((acc: Record<string, number>, item: any) => {
      !acc[item.category] 
        ? acc[item.category] = item.price 
        : acc[item.category] += item.price;
      return acc;
    }, {});

  //seperate data values
  const labels = Object.keys(groupedMap);
  const values = Object.values(groupedMap);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: generatePastelColors(labels.length),
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
    <div className="">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;
