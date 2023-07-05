import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import { SearchProps } from './SearchBar';
import './Calendar.css';
import { useState } from 'react';

export const Calendar = ({
  handleSearchState
}: {
  handleSearchState: Function;
}) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);

  const onChange = (dates: [Date | null, Date | null] | null) => {
    if (dates) {
      const [start, end] = dates;
      handleSearchState('checkInDate', start);
      handleSearchState('checkOutDate', end);
      setStartDate(start);
      setEndDate(end);
    }
  };
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
    <>
      <input type="checkbox" id="calendar" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box shadow-lg">
          <div className="flex justify-center gap-3">
            <div className="flex flex-col gap-2">
              <span className="font-semibold">체크인</span>
              <DatePicker
                locale={ko}
                selected={startDate}
                onChange={onChange}
                minDate={new Date(2023, 6, 1)}
                maxDate={new Date(2023, 9, 1)}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                showDisabledMonthNavigation
                closeOnScroll={true}
              />
            </div>
          </div>
          <div className="modal-action">
            <label
              htmlFor="calendar"
              className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
            >
              확인
            </label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="calendar">
          Close
        </label>
      </div>
    </>
  );
};
