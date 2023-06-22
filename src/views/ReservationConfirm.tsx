import 'react-datepicker/dist/react-datepicker.css';
import { useCallback, useState, useEffect } from 'react';
import ReservationDatePicker from '../components/reservationConfirm/ReservationDatePicker';
import {
  DEFAULT_END_DATE,
  DEFAULT_START_DATE,
  Term,
  termFilters
} from '../components/reservationConfirm/constants';
import { TermFilterTypes } from '../components/reservationConfirm/types';
import ReservationInfoCard from '../components/reservationConfirm/ReservationInfoCard';
import { IReservationInfo, getReservationList } from '../api/reservationList';

const ReservationConfirm = () => {
  const [startDate, setStartDate] = useState<Date>(DEFAULT_START_DATE);
  const [endDate, setEndDate] = useState<Date>(DEFAULT_END_DATE);

  const [termFilterValue, setTermFilterValue] = useState<TermFilterTypes>(
    Term.YEAR
  );

  const [reservationList, setReservationList] = useState<IReservationInfo[]>(
    []
  );

  const handleFilterButtonClick = useCallback(
    (value: TermFilterTypes, startDate: Date) => {
      setTermFilterValue(value);
      setStartDate(startDate);
      setEndDate(new Date());
    },
    []
  );

  const handleStartDateChange = useCallback(
    (date: Date) => {
      setStartDate(date);
      setTermFilterValue(Term.SPECIFIED);
    },
    [startDate]
  );

  const handleEndDateChange = useCallback(
    (date: Date) => {
      setEndDate(date);
      setTermFilterValue(Term.SPECIFIED);
    },
    [endDate]
  );

  useEffect(() => {
    const init = async () => {
      const content = await getReservationList();
      setReservationList(content);
    };
    init();
  }, []);

  return (
    <div className="w-full" style={{ minWidth: '375px' }}>
      <div className="w-full h-36 bg-[url('/assets/images/banner.png')] bg-cover bg-center relative z-[1]">
        <div className="absolute top-0 left-0 w-full h-36 bg-emerald-500 opacity-40 z-[2]"></div>
        <p className="absolute top-1/2 -translate-y-2/4 left-1/2 -translate-x-2/4 text-white text-3xl font-bold z-[3]">
          예약 확인
        </p>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 bg-white">
        <section className="md:flex gap-6">
          <div className="flex md:gap-4 items-center justify-between md:justify-start md:w-3/5 lg:w-auto">
            {termFilters.map((term) => {
              return (
                <button
                  key={term.text}
                  className={`btn px-0 w-[23%] md:w-[22%] lg:w-32 btn-ghost bg-white drop-shadow text-xs lg:text-sm${
                    term.value === termFilterValue
                      ? ' text-emerald-500 border-emerald-500'
                      : ''
                  }`}
                  onClick={() =>
                    handleFilterButtonClick(term.value, term.startDate)
                  }
                >
                  {term.text}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1 mt-4 md:mt-0">
            <ReservationDatePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
            />
            <button className="btn btn-active btn-neutral ml-4">적용</button>
          </div>
        </section>
        <div className="w-full h-px bg-gray-200 my-6"></div>
        <section className="w-full flex flex-col gap-4">
          {reservationList.map((reservationInfo) => {
            return (
              <ReservationInfoCard
                key={`reservation-${reservationInfo.id}`}
                data={reservationInfo}
              />
            );
          })}
        </section>
      </div>
    </div>
  );
};
export default ReservationConfirm;
