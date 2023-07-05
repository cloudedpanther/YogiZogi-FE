import { IReservationConfirm, IRoomResponse } from 'api/accommodationDetail';
import { addCommasToPrice } from '../../helpers';
import { ConfirmModal } from './ConfirmModal';
import { useEffect, useState } from 'react';
import { IModalProps } from './CarouselModal';
import { useRecoilState } from 'recoil';
import { selectedRoom } from '../../store/atom/comparisonAtom';
import { AlertModal } from '../../components/common/AlertModal';
import { IComparisonBoxProps } from 'components/floatingIcons/comparison/types';
import { getQueryStrData } from '../../utils/handleQueryString';

interface IRoomInfo {
  roomInfo: IRoomResponse[];
  setModalProps: React.Dispatch<React.SetStateAction<IModalProps>>;
  setRoomData: React.Dispatch<React.SetStateAction<IReservationConfirm>>;
  roomData: IReservationConfirm;
}
/**
 * @param roomInfo: IRoomResponse[];
 * @param setModalProps: React.Dispatch<React.SetStateAction<IModalProps>>;
 * @param setRoomData: React.Dispatch<React.SetStateAction<IReservationConfirm>>;
 * @param roomData: IReservationConfirm;
 */

export const RoomInfo = ({
  roomInfo,
  setModalProps,
  setRoomData,
  roomData
}: IRoomInfo) => {
  const [modalContent, setModalContent] = useState('');
  const [confirmModalState, setConfirmModalState] = useState(false); // 예약 실행 여부를 확인하는 모달
  const [alertModalState, setAlertModalState] = useState(false);
  const [selectedRooms, setSelectedRooms] =
    useRecoilState<IComparisonBoxProps[]>(selectedRoom);

  const { accommodationId, checkInDate, checkOutDate, people } =
    getQueryStrData();

  // 비교함에 상품을 추가하는 함수
  const addRoomComparisonCart = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: IRoomResponse
  ) => {
    e.preventDefault();

    if (selectedRooms.some((el) => el.roomId === item.id)) {
      setModalContent('이미 담긴 상품입니다.');
      setAlertModalState(true);
    } else {
      const comparisonData = {
        accommodationName: roomData.accommodationName,
        accommodationId: accommodationId,
        roomId: item.id,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        price: item.price,
        imgUrl: item.pictureUrlList[0].url,
        people: people
      };

      setSelectedRooms((prev) => [...prev, comparisonData]);
    }
  };

  // 4개 이상의 상품이 담기면 alert 모달의 띄움
  useEffect(() => {
    if (selectedRooms.length > 3) {
      setSelectedRooms(selectedRooms.slice(0, 3));
      setModalContent('최대 3개의 상품만 담을 수 있습니다.');
      setAlertModalState(true);
    }
  }, [selectedRooms]);

  return (
    <>
      {roomInfo.length > 1 ? (
        roomInfo.map((el, idx) => {
          return (
            <div key={idx}>
              {el.pictureUrlList.length > 0 && (
                <div className="flex flex-col items-center sm:flex-row gap-3">
                  <label
                    key={idx}
                    htmlFor="reservationModal"
                    className="flex sm:w-1/3 max-w-sm"
                    onClick={() =>
                      setModalProps({
                        imgList: el.pictureUrlList,
                        alt: 'accommodation detail image',
                        selectedImg: idx
                      })
                    }
                  >
                    <figure className="mx-auto cursor-pointer w-full">
                      <img
                        src={el.pictureUrlList[0].url}
                        alt={`${roomData.accommodationName}-${el.roomName} image`}
                        className="w-full h-full"
                      />
                    </figure>
                  </label>
                  <div className="flex flex-col flex-wrap ml-2 w-fit sm:w-1/3">
                    <h3 className="w-[90%] max-w-72 text-base md:text-xl font-semibold mt-0 md:mb-1 truncate">
                      {el.roomName}
                    </h3>
                    <div className="flex sm:flex-col gap-2">
                      <p>
                        <span className="font-semibold">체크인: </span>
                        {el.checkInTime}시
                      </p>
                      <p>
                        <span className="font-semibold">체크아웃</span>:{' '}
                        {el.checkOutTime}시
                      </p>
                      <p>
                        <span className="font-semibold">기본인원</span>:{' '}
                        {el.defaultPeople}명
                      </p>
                      <p>
                        <span className="font-semibold">최대인원</span>:{' '}
                        {el.maxPeople}명
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row sm:w-1/3 justify-center">
                    <div className="flex sm:flex-col gap-3 my-auto items-center">
                      {/* 가격 버튼을 클릭하면 사용자가 예약을 정말 실행할지 확인하기 위해 ConfirmModal이 띄워짐 */}
                      <button
                        className="flex gap-2 btn btn-sm font-semibold w-fit sm:w-full min-w-[80px] md:min-w-[100px] md:btn-md md:text-base bg-red-500 disabled:bg-base-300 hover:bg-red-600 text-white"
                        onClick={() => {
                          setRoomData((prev) => ({
                            ...prev,
                            roomId: el.id.toString(),
                            roomName: el.roomName,
                            imgUrl: el.pictureUrlList[0].url,
                            price: el.price.toString()
                          }));
                          setConfirmModalState(true);
                        }}
                        disabled={el.price === null}
                      >
                        {el.price === null
                          ? '예약 완료'
                          : addCommasToPrice(el.price) + '원'}
                      </button>
                      <button
                        onClick={(e) => addRoomComparisonCart(e, el)}
                        className="flex gap-2 btn btn-sm min-w-[80px] md:min-w-[100px] md:btn-md border-red-500 btn-ghost hover:bg-red-500 hover:text-white"
                      >
                        비교함에 담기
                      </button>
                      <ConfirmModal
                        data={roomData}
                        modalState={confirmModalState}
                        setModalState={setConfirmModalState}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="flex justify-center items-center h-40 bg-base-200 border rounded-lg">
          <p>준비된 방이 없습니다.</p>
        </div>
      )}
      <AlertModal
        content={modalContent}
        modalState={alertModalState}
        handleModal={setAlertModalState}
      />
    </>
  );
};
