import { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import { GetGeoInfo } from '../../utils/getGeoInfo';
import { getDateFormat, getMonthDayFormat } from '../../utils/handleDate';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';
import { AlertModal } from '../../components/common/AlertModal';

export interface SearchProps {
  searchValue: string;
  checkInDate: Date;
  checkOutDate: Date;
  people: number;
  userGeoInfo: number[];
}

export const SearchBar = () => {
  const [search, setSearch] = useState<SearchProps>({
    searchValue: '',
    checkInDate:
      new Date() > new Date(2023, 5, 30) && new Date() <= new Date(2023, 8, 30)
        ? new Date()
        : new Date(2023, 6, 1),
    checkOutDate:
      new Date() > new Date(2023, 5, 30) && new Date() <= new Date(2023, 8, 30)
        ? new Date()
        : new Date(2023, 6, 1),
    people: 0,
    userGeoInfo: [37.57, 126.9]
  });

  const [dateContent, setDateContent] = useState('');
  const [calendarState, setCalendarState] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [alertModalState, setAlertModalState] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (
      search.checkOutDate.toString().slice(0, 15) !==
      new Date().toString().slice(0, 15)
    ) {
      setDateContent(() => {
        const selectedCheckInDate = getMonthDayFormat(search.checkInDate);
        const selectedCheckOutDate = getMonthDayFormat(search.checkOutDate);
        return `${selectedCheckInDate} ~ ${selectedCheckOutDate}`;
      });
    }
  }, [search.checkInDate, search.checkOutDate]);

  const handleSearchState = (property: PropertyKey, value: any) => {
    setSearch((prev) => {
      return { ...prev, [property]: value };
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setCalendarState(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    const getDateGap =
      (search.checkOutDate.getTime() - search.checkInDate.getTime()) /
      (1000 * 3600 * 24);

    if (
      search.people === 0 ||
      search.searchValue.length === 0 ||
      search.checkOutDate === search.checkInDate
    ) {
      setModalContent('목적지, 기간, 인원 모두를 입력해주세요!');
      return setAlertModalState(true);
    } else if (getDateGap > 7) {
      setModalContent('기간은 최대 7일을 초과할 수 없습니다.');
      return setAlertModalState(true);
    } else {
      const [lat, lon] = search.userGeoInfo;
      const params = new URLSearchParams();

      params.append('checkindate', getDateFormat(search.checkInDate));
      params.append('checkoutdate', getDateFormat(search.checkOutDate));
      params.append('people', search.people.toString());

      if (search.searchValue === '현재 위치에서 찾기') {
        params.append('lat', lat.toString());
        params.append('lon', lon.toString());
      } else {
        params.append('keyword', search.searchValue);
      }

      const isInSearchResult = location.hash.includes('searchResult');

      const queryString = params.toString();
      navigate(`/searchResult?${queryString}`);

      if (isInSearchResult) location.reload();
    }
  };

  return (
    <section className="relative flex flex-col sm:flex-row gap-5 md:gap-10 border min-w-fit w-auto max-w-4xl p-3 shadow-md mx-auto rounded-lg bg-white">
      <div className="w-full md:w-1/2 flex flex-col gap-1">
        <p className="flex items-center gap-1 font-semibold text-lg">
          <img src="./assets/icons/location.svg" alt="destination icon" />
          목적지
        </p>
        <div className="flex items-center justify-between gap-1 shrink bg-slate-200 rounded-md p-1">
          <input
            type="text"
            placeholder="검색어 입력하세요"
            className="w-full lg:w-full h-auto p-0 input focus:outline-none bg-inherit"
            value={search.searchValue}
            onChange={(e) => {
              const newKeyword = e.target.value;
              handleSearchState('searchValue', newKeyword);
            }}
            onFocus={(e) => {
              if (e.target.value === '현재 위치에서 찾기') {
                handleSearchState('searchValue', '');
              }
            }}
          />
          <img
            src="./assets/icons/location.svg"
            alt="location icon"
            className="cursor-pointer w-6 h-6 brightness-0"
            onClick={() => {
              GetGeoInfo(setSearch);
              handleSearchState('searchValue', '현재 위치에서 찾기');
            }}
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 flex  justify-between">
        <div className="flex flex-col gap-2 w-1/2 sm:w-1/2">
          <div className="flex items-center font-semibold text-lg gap-1">
            <img src="./assets/icons/calendar.svg" alt="calendar icon" />
            <span>기간</span>
          </div>
          <p
            className="cursor-pointer"
            onClick={() => setCalendarState(!calendarState)}
          >
            {dateContent !== '' && !calendarState
              ? dateContent
              : '날짜 선택하기'}
          </p>
          <div
            ref={calendarRef}
            className={`flex px-2 md:px-3 pt-3 rounded-lg bg-white absolute gap-3 top-32 sm:top-9 sm:right-0 shadow-lg z-10 ${
              calendarState ? 'block' : 'hidden'
            }`}
          >
            <div>
              <span className="text-xs font-semibold md:text-base">체크인</span>
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
              <span className="text-xs font-semibold md:text-base">
                체크아웃
              </span>
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
                  setCalendarState(!calendarState);
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:w-1/4">
          <div className="flex items-center font-semibold gap-1 text-lg">
            <img src="./assets/icons/person.svg" alt="person icon" /> 인원
          </div>
          <p className="flex gap-3 items-center">
            <button
              className="btn btn-square btn-xs bg-red-500 hover:bg-red-600 disabled:bg-red-700 text-white"
              onClick={() => {
                if (search.people === 0) return;
                const peopleNum = search.people - 1;
                handleSearchState('people', peopleNum);
              }}
              disabled={search.people === 0}
            >
              -
            </button>
            {search.people}
            <button
              className="btn btn-square btn-xs bg-red-500 hover:bg-red-600 disabled:bg-red-700 text-white"
              onClick={() => {
                const peopleNum = search.people + 1;
                handleSearchState('people', peopleNum);
              }}
              disabled={search.people > 100}
            >
              +
            </button>
          </p>
        </div>
        <div className="flex justify-end items-center w-auto sm:w-1/4">
          <button
            className="btn font-semibold lg:w-full bg-red-500 hover:bg-red-600"
            onClick={handleSearch}
          >
            <img src="./assets/icons/search.svg" alt="search icon" />
            <span className="hidden lg:block text-lg text-white font-normal">검색</span>
          </button>
        </div>
      </div>
      <AlertModal
        content={modalContent}
        modalState={alertModalState}
        handleModal={setAlertModalState}
      />
    </section>
  );
};
