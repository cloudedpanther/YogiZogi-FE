import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { fetchData } from '../../../api';
import { IComparisonItem, IFetchDataForChart } from './types';
import { getDateFormat } from '../../../utils/handleDate';

export const PriceComparisonChart = ({ data }: { data: IComparisonItem }) => {
  const [chartData, setChartData] = useState<IFetchDataForChart[]>([]);
  const [chartState, setChartState] = useState(true);
  const checkInDate = data.checkInDate.split('-').pop();
  const checkOutDate = data.checkOutDate.split('-').pop();

  const getThreeDates = (date: string) => {
    const startDate = new Date(`2023-07-${date}`);
    let dates = [];

    for (let i = 0; i < 3; i++) {
      const currentDate = new Date(
        startDate.getTime() + i * 28 * 24 * 60 * 60 * 1000
      );
      dates.push(getDateFormat(currentDate));
    }
    return dates;
  };

  const checkInDays = getThreeDates(checkInDate!);
  const checkOutDays = getThreeDates(checkOutDate!);

  const fetchDataForItem = () => {
    let fetchUrl: string[] = [];

    checkInDays.forEach((el, idx) => {
      fetchUrl.push(
        data.roomId === '0'
          ? `/accommodation/compare/accommodation?accommodationid=${data.accommodationId}&checkindate=${el}&checkoutdate=${checkOutDays[idx]}&people=${data.people}`
          : `/accommodation/compare/room?roomid=${data.roomId}&checkindate=${el}&checkoutdate=${checkOutDays[idx]}&people=${data.people}`
      );
    });

    return fetchUrl.map((url) =>
      fetchData
        .get(url)
        .then((res: any) => {
          return {
            ...res.data.data
          };
        })
        .catch((e) => console.log(e.message))
    );
  };

  useEffect(() => {
    const fetchDataForAllItems = async () => {
      const promises = fetchDataForItem();
      await Promise.all(promises)
        .then((results) => {
          setChartState(true);
          setChartData(results);
        })
        .catch(() => setChartState(false));
    };

    fetchDataForAllItems();
  }, [data]);

  const datas = {
    labels: ['Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: '3개월 가격추이',
        data: chartData.map((el) => (el === undefined ? 0 : el.price)),
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
      {chartState ? (
        <Line data={datas} options={options} />
      ) : (
        <div className="w-full h-20 flex items-center justify-center border rounded-xl">
          no Data
        </div>
      )}
    </>
  );
};
