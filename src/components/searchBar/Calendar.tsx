import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import { SearchProps } from './SearchBar';
import './Calendar.css';


interface ICalendar {
  search: SearchProps,
  handleSearchState: Function,
}

export const Calendar = ({search, handleSearchState} : ICalendar) => {
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
            <div className="flex flex-col gap-2">
              <span className="font-semibold">체크아웃</span>
              <DatePicker
                locale={ko}
                inline
                minDate={new Date(search.checkInDate.getTime() + 86400000)}
                maxDate={new Date(2023, 9, 1)}
                selected={search.checkOutDate}
                closeOnScroll={true}
                onChange={(date: Date) => {
                  if (
                    !search.checkInDate ||
                    search.checkInDate.getTime() >= date.getTime()
                  )
                    return;
                  handleSearchState('checkOutDate', date);
                }}
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
