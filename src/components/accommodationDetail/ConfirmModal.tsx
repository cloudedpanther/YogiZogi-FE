import { IReservationConfirm } from 'api/accommodationDetail';
import { addCommasToPrice } from '../../helpers';
import { useNavigate } from 'react-router-dom';

interface IConfirmModal {
  data: IReservationConfirm;
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * @param data IReservationConfirm;
 * @param modalState boolean;
 * @param setModalState React.Dispatch<React.SetStateAction<boolean>>;
 */

export const ConfirmModal = ({
  data,
  modalState,
  setModalState
}: IConfirmModal) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(
      `/payment?accommodation=${data.accommodationName}&checkindate=${data.checkInDate}&checkoutdate=${data.checkOutDate}&people=${data.people}&price=${data.price}`,
      {
        state: {
          accommodationId: data.accommodationId,
          roomId: data.roomId,
          roomName: data.roomName,
          roomImg: data.imgUrl,
          address: data.address,
          rate: data.rate
        }
      }
    );
  };

  return (
    <>
      <input
        type="checkbox"
        id="confirmModal"
        className="modal-toggle"
        checked={modalState}
        readOnly
      />
      <div className="modal bg-black bg-opacity-5">
        <div className="flex flex-col gap-5 modal-box w-full max-w-2xl shadow-none">
          <div className="flex gap-5">
            <figure className="w-full">
              <img
                src={data.imgUrl}
                alt={`${data.accommodationName} image`}
                className="w-full"
              />
            </figure>
          </div>
          <div>
            <div className="flex gap-2 justify-around flex-wrap sm:text-lg">
              <div>
                <p>
                  <span className="font-semibold">{data.roomName}</span>
                </p>
                <p>
                  <span className="font-semibold">인원</span>: {data.people}명
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">체크인: </span>
                  {data.checkOutDate}
                </p>
                <p>
                  <span className="font-semibold">체크아웃</span>:{' '}
                  {data.checkOutDate}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="btn modal-action mt-0 w-fit text-white btn-sm text-xs md:btn-md md:text-base bg-red-500 hover:bg-red-600"
              onClick={handleClick}
            >
              {addCommasToPrice(Number(data.price))}원 예약하기
            </button>
          </div>
        </div>
        <label
          className="modal-backdrop"
          htmlFor="confirmModal"
          onClick={(e) => {
            e.preventDefault();
            setModalState(false);
          }}
        >
          Close
        </label>
      </div>
    </>
  );
};
