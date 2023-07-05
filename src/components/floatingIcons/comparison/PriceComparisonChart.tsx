import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);
import { Line } from 'react-chartjs-2';
import { IComparisonItem } from './types';

export const PriceComparisonChart = ({ data }: { data: IComparisonItem[] }) => {
  const datas = {
    labels: ['Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: '3개월 가격추이',
        data: data.map((el) => (el === undefined ? 0 : el.price)),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <>
      {data ? (
        <Line data={datas} options={options} />
      ) : (
        <div className="w-full h-20 flex items-center justify-center border rounded-xl">
          no Data
        </div>
      )}
    </>
  );
};
