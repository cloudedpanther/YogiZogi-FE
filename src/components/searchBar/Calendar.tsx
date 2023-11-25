import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import { useState } from 'react';
import './Calendar.css';

interface ICalendar {
  handleSearchState: Function;
  calendarState: boolean;
  setCalendarState: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Calendar = ({
  handleSearchState,
  calendarState,
  setCalendarState
}: ICalendar) => {
  const minDate = new Date(new Date().setDate(new Date().getDate() + 1));

  const [startDate, setStartDate] = useState<Date | null>(minDate);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const onCalendarChange = (dates: [Date | null, Date | null] | null) => {
    if (dates) {
      const [start, end] = dates;

      if (startDate !== start) setEndDate(null);

      handleSearchState('checkInDate', start);
      handleSearchState('checkOutDate', end);
      setStartDate(start);

      if (end) {
        setEndDate(end);
        setCalendarState(false);
      }
    }
  };

  return (
    <>
      <div
        className={`flex justify-center items-center absolute top-20 sm:top-9 left-0 sm:left-1/2 ${
          calendarState ? 'block' : 'hidden'
        }`}
      >
        <div className="flex gap-1 px-2 md:px-3 pt-3 rounded-lg bg-white shadow-lg z-10 opacity-1">
          <div>
            <DatePicker
              locale={ko}
              selected={startDate}
              onChange={onCalendarChange}
              minDate={minDate}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
              showDisabledMonthNavigation
              closeOnScroll={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};
