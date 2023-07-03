import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/esm/locale';
import { getDateFormat } from '../../utils/handleDate';
import { useCallback, useState, useRef } from 'react';

interface IDatePickInput {
  date: Date;
  minDate?: Date;
  maxDate?: Date;
  onDateChange: (date: Date) => void;
}

const DatePickInput = ({
  date,
  minDate,
  maxDate,
  onDateChange
}: IDatePickInput) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleCalendarOutsideClick = useCallback((e: MouseEvent) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(e.target as Node)
    ) {
      setIsCalendarOpen(false);

      document.removeEventListener('mousedown', handleCalendarOutsideClick);
    }
  }, []);

  const handleInputClick = useCallback(() => {
    if (isCalendarOpen) return;

    setIsCalendarOpen(true);

    document.addEventListener('mousedown', handleCalendarOutsideClick);
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    onDateChange(date);
    setIsCalendarOpen(false);
  }, []);

  return (
    <div className="w-32 lg:w-36 relative">
      <button
        className="btn btn-ghost bg-white border border-gray-300 text-xs flex justify-end items-center px-2 hover:border-gray-400 w-full"
        onClick={handleInputClick}
      >
        <p>{getDateFormat(date)}</p>
        <img src="./assets/icons/calendar.svg" alt="calendar icon" className="text-lg block"/>
      </button>
      <div
        ref={calendarRef}
        className={`absolute left-0 top-14 z-[5]${
          isCalendarOpen ? '' : ' hidden'
        }`}
      >
        <DatePicker
          locale={ko}
          inline
          minDate={minDate}
          maxDate={maxDate || new Date()}
          selected={date}
          closeOnScroll={true}
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
};

export default DatePickInput;
