import { useLocation, useNavigate } from 'react-router-dom';
import RatingStars from '../components/common/RatingStars';
import InputBox from '../components/login/InputBox';
import useReservation from '../hooks/useReservation';

const Payment = () => {
  const {
    roomInfoRef,
    accommodationInfoRef,
    reservationData,
    handleChangeInput,
    handleChangeChecked,
    handleReservationSubmit
  } = useReservation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!location.state) {
    navigate(-1);
    return <></>;
  }

  return (
    <div className="mx-auto min-h-[calc(100vh-112px)] max-md:min-h-[calc(100vh-144px)] min-w-[375px] max-w-5xl pt-3 pb-20">
      <div className="flex items-center gap-3 h-20 pl-6">
        <button className="w-6 h-6" onClick={handleGoBack}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.75 19.5L8.25 12L15.75 4.5"
              stroke="#868686"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="text-2xl max-md:text-xl font-semibold">예약 요청</div>
      </div>
      <div className="divider m-0"></div>

      <section className="flex gap-8 pt-10 px-5 max-md:flex-col-reverse">
        <article className="p-7 w-3/5 max-md:w-full h-fit bg-white rounded-lg drop-shadow-md">
          <div className="flex flex-col gap-4">
            <ReservationLabel
              title="체크인"
              value={accommodationInfoRef.current.checkInDate}
            />
            <ReservationLabel
              title="체크아웃"
              value={accommodationInfoRef.current.checkOutDate}
            />
            <ReservationLabel
              title="객실정보"
              value={roomInfoRef.current.roomName}
            />
            <ReservationLabel
              title="결제금액"
              value={`${Number(
                accommodationInfoRef.current.price
              ).toLocaleString('kr')} 원`}
            />
          </div>
          <div className="divider"></div>
          <div className="flex flex-col">
            <label className="cursor-pointer label gap-3 w-fit">
              <input
                type="checkbox"
                className="checkbox"
                onChange={handleChangeChecked}
              />
              <span className="label-text">회원정보와 동일</span>
            </label>
            <InputBox
              title="예약자명"
              name="name"
              type="text"
              placeholder="예약자명을 입력해주세요."
              value={reservationData.name}
              handleChange={handleChangeInput}
            />
          </div>
          <div className="text-end pt-5">
            <button
              className="btn bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white"
              onClick={handleReservationSubmit}
            >
              예약하기
            </button>
          </div>
        </article>

        <article className="flex-1 max-md:flex max-sm:flex-col max-md:gap-4 max-sm:gap-0 p-4 h-fit bg-white rounded-lg drop-shadow-md">
          <div className="sm:max-w-[346px] sm:max-h-[205px] overflow-hidden rounded-md">
            <img
              src={roomInfoRef.current.roomImg}
              className="w-full"
              alt={`${roomInfoRef.current.accommodationName} room image`}
            />
          </div>
          <div className="flex flex-col gap-1 pt-6">
            <h1 className="text-lg font-semibold overflow-hidden">
              {accommodationInfoRef.current.accommodationName}
            </h1>
            <div className="flex items-center gap-1">
              <span>
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 6.20703C8.50425 6.20703 7.29169 7.41959 7.29169 8.91536C7.29169 10.4111 8.50425 11.6237 10 11.6237C11.4958 11.6237 12.7084 10.4111 12.7084 8.91536C12.7084 7.41959 11.4958 6.20703 10 6.20703ZM8.54169 8.91536C8.54169 8.10995 9.19461 7.45703 10 7.45703C10.8054 7.45703 11.4584 8.10995 11.4584 8.91536C11.4584 9.72078 10.8054 10.3737 10 10.3737C9.19461 10.3737 8.54169 9.72078 8.54169 8.91536Z"
                    fill="#FD4C5C"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 2.45703C6.43318 2.45703 3.54169 5.34853 3.54169 8.91536C3.54169 10.0959 3.95224 11.2918 4.5233 12.3932C5.09716 13.4999 5.85506 14.5529 6.6009 15.4585C7.34826 16.366 8.09387 17.1381 8.65198 17.6829C8.93141 17.9557 9.16481 18.1724 9.32918 18.3217C9.4114 18.3964 9.47641 18.4542 9.52137 18.4938C9.54385 18.5136 9.56131 18.5289 9.57342 18.5394C9.57947 18.5447 9.58418 18.5487 9.5875 18.5516L9.59145 18.555L9.59263 18.556L9.59302 18.5563C9.59316 18.5565 9.59328 18.5566 10 18.082L9.59328 18.5566L10 18.9052L10.4068 18.5566L10 18.082C10.4068 18.5566 10.4069 18.5565 10.407 18.5563L10.4074 18.556L10.4086 18.555L10.4125 18.5516C10.4159 18.5487 10.4206 18.5447 10.4266 18.5394C10.4387 18.5289 10.4562 18.5136 10.4787 18.4938C10.5236 18.4542 10.5886 18.3964 10.6709 18.3217C10.8352 18.1724 11.0686 17.9557 11.3481 17.6829C11.9062 17.1381 12.6518 16.366 13.3991 15.4585C14.145 14.5529 14.9029 13.4999 15.4767 12.3932C16.0478 11.2918 16.4584 10.0959 16.4584 8.91536C16.4584 5.34853 13.5669 2.45703 10 2.45703ZM10.4749 16.7884C10.2935 16.9655 10.1329 17.1174 10 17.2407C9.86718 17.1174 9.70654 16.9655 9.52515 16.7884C8.9895 16.2656 8.27679 15.5272 7.56581 14.6639C6.85331 13.7987 6.15288 12.8204 5.63299 11.8178C5.1103 10.8097 4.79169 9.8182 4.79169 8.91536C4.79169 6.03888 7.12354 3.70703 10 3.70703C12.8765 3.70703 15.2084 6.03888 15.2084 8.91536C15.2084 9.8182 14.8897 10.8097 14.367 11.8178C13.8472 12.8204 13.1467 13.7987 12.4342 14.6639C11.7233 15.5272 11.0105 16.2656 10.4749 16.7884Z"
                    fill="#FD4C5C"
                  />
                </svg>
              </span>{' '}
              {roomInfoRef.current.address}
            </div>
            <RatingStars rate={Number(roomInfoRef.current.rate)} />
          </div>
        </article>
      </section>
    </div>
  );
};
export default Payment;

const ReservationLabel = ({
  title,
  value
}: {
  title: string;
  value: string | null;
}) => {
  return (
    <div className="flex items-center justify-between text-lg">
      <span className="text-xl font-semibold">{title}</span> {value}
    </div>
  );
};
