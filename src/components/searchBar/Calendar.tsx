import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import { SearchProps } from './SearchBar';
import './Calendar.css';
import { useRef } from 'react';

interface ICalendar {
  search: SearchProps;
  handleSearchState: Function;
  calendarState: boolean;
  setCalendarState: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Calendar = ({
  search,
  handleSearchState,
  calendarState,
  setCalendarState
}: ICalendar) => {
  const calendarRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={calendarRef}
      className={`flex justify-center items-center absolute top-20 sm:top-0 left-0 sm:left-1/2 ${
        calendarState ? 'block' : 'hidden'
      }`}
    >
      <div className="flex gap-1 px-2 md:px-3 pt-3 rounded-lg bg-white shadow-lg z-10 opacity-1">
        <div>
          <DatePicker
            locale={ko}
            inline
            minDate={new Date(2023, 6, 1)}
            maxDate={new Date(2023, 8, 30)}
            selected={search.checkInDate}
            closeOnScroll={true}
            onChange={(date: Date) => {
              if (search.checkOutDate)
                handleSearchState('checkOutDate', new Date());
              handleSearchState('checkInDate', date);
            }}
          />
        </div>
        <div>
          <DatePicker
            locale={ko}
            inline
            minDate={new Date(search.checkInDate.getTime() + 86400000)}
            maxDate={new Date(2023, 8, 30)}
            selected={search.checkOutDate}
            closeOnScroll={true}
            onChange={(date: Date) => {
              if (
                !search.checkInDate ||
                search.checkInDate.getTime() >= date.getTime()
              )
                return;
              handleSearchState('checkOutDate', date);
              setCalendarState(!calendarState);
            }}
          />
        </div>
      </div>
    </div>
  );
};
