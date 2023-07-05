import 'react-datepicker/dist/react-datepicker.css';
import { useCallback, useState, useEffect, useMemo } from 'react';
import ReservationDatePicker from '../components/reservationConfirm/ReservationDatePicker';
import {
  DEFAULT_END_DATE,
  DEFAULT_START_DATE,
  RESERVATION_LIST_PAGE_SIZE,
  Term,
  termFilters
} from '../components/reservationConfirm/constants';
import { TermFilterTypes } from '../components/reservationConfirm/types';
import ReservationInfoCard from '../components/reservationConfirm/ReservationInfoCard';
import { IReservationInfo, getReservationList } from '../api/reservationList';
import { getYearAgo } from '../components/reservationConfirm/utils';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ReservationConfirm = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate();

  if (!authUser.isLoggedIn || !authUser.user.id) {
    navigate('/');
  }

  const [startDate, setStartDate] = useState<Date>(DEFAULT_START_DATE);
  const [endDate, setEndDate] = useState<Date>(DEFAULT_END_DATE);

  const [termFilterValue, setTermFilterValue] = useState<TermFilterTypes>(
    Term.SPECIFIED
  );

  const [totalReservationList, setTotalReservationList] = useState<
    IReservationInfo[]
  >([]);

  const [reservationList, setReservationList] = useState<IReservationInfo[]>(
    []
  );

  const [page, setPage] = useState<number>(1);

  const totalPages = useMemo(() => {
    return Math.ceil(reservationList.length / RESERVATION_LIST_PAGE_SIZE);
  }, [reservationList]);

  const pageStartIndex = useMemo(() => {
    return (page - 1) * RESERVATION_LIST_PAGE_SIZE;
  }, [page]);

  const pageEndIndex = useMemo(() => {
    return pageStartIndex + RESERVATION_LIST_PAGE_SIZE;
  }, [page]);

  const getListOfRenderingPage = useCallback(() => {
    return reservationList.slice(pageStartIndex, pageEndIndex);
  }, [reservationList, page]);

  const handlePageButtonClick = useCallback((pageIndex: number) => {
    setPage(pageIndex);
    scrollTo(0, 0);
  }, []);

  const handleFilterButtonClick = useCallback(
    (value: TermFilterTypes, startDate: Date) => {
      setTermFilterValue(value);
      setStartDate(startDate);
      setEndDate(new Date());
    },
    []
  );

  const filterByDateTerm = useCallback(() => {
    const filtered = Array.from(totalReservationList).filter((info) => {
      const biggerThanMin =
        startDate.getTime() <= new Date(info.checkInDate).getTime() &&
        new Date(info.checkInDate).getTime() <= endDate.getTime();
      const smallerThanMax =
        startDate.getTime() <= new Date(info.checkOutDate).getTime() &&
        new Date(info.checkOutDate).getTime() <= endDate.getTime();

      return biggerThanMin || smallerThanMax;
    });

    setReservationList(filtered);
    setPage(1);
  }, [startDate, endDate]);

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
      if (!authUser.user.id) return;

      const content = await getReservationList(authUser.user.id);

      if (!content.length) return;

      setTotalReservationList(() => {
        const lastEndDate = new Date(content[0].checkInDate);
        setEndDate(lastEndDate);
        setStartDate(getYearAgo(new Date(lastEndDate)));
        return content;
      });
    };
    init();
  }, []);

  useEffect(() => {
    filterByDateTerm();
  }, [totalReservationList]);

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
            <button
              className="btn btn-active bg-red-500 hover:bg-red-600 text-white ml-4"
              onClick={filterByDateTerm}
            >
              적용
            </button>
          </div>
        </section>
        <div className="w-full h-px bg-gray-200 my-6"></div>
        <section className="w-full flex flex-col gap-4">
          {!reservationList.length ? (
            <div className="text-center py-20">
              <p>검색 결과 없음</p>
            </div>
          ) : (
            getListOfRenderingPage().map((reservationInfo) => {
              return (
                <ReservationInfoCard
                  key={`reservation-${reservationInfo.id}`}
                  data={reservationInfo}
                />
              );
            })
          )}
        </section>
        <div className="join flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageIndex) => {
              return (
                <input
                  key={`pageButton-${pageIndex}`}
                  className="join-item btn btn-square rounded-md btn-sm mr-1 checked:bg-red-500 checked:text-white border-none important"
                  type="radio"
                  name="pages"
                  aria-label={`${pageIndex}`}
                  checked={pageIndex === page}
                  onChange={() => handlePageButtonClick(pageIndex)}
                />
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};
export default ReservationConfirm;
