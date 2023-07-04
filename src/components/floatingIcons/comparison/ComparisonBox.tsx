import { SetterOrUpdater, useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  selectedAccommodation,
  selectedRoom
} from '../../../store/atom/comparisonAtom';
import { addCommasToPrice } from '../../../helpers';
import { AlertModal } from '../../common/AlertModal';
import { ComparisonModal } from './ComparisonModal';
import { getDateFormat, getSlashDateFormat } from '../../../utils/handleDate';
import { IComparisonBoxProps, IComparisonItem } from './types';

interface IComparisonBox {
  display: boolean;
  source: string;
}

export const ComparisonBox = ({ display, source }: IComparisonBox) => {
  let data: IComparisonBoxProps[],
    setData: SetterOrUpdater<IComparisonBoxProps[]>;
  const [alertModalState, setAlertModalState] = useState(false);
  const [comparisonModalState, setComparisonModalState] = useState(false);
  const [comparisonItems, setComparisonItems] = useState<IComparisonItem[]>([]);
  const [selectedRooms, setSelectedRooms] = useRecoilState(selectedRoom);
  const [selectedAcc, setSelectedAcc] = useRecoilState(selectedAccommodation);

  useEffect(() => {
    const lastTimeStamp = localStorage.getItem('lastTimeStamp');
    const selectedRooms = localStorage.getItem('selectedRoom');
    const selectedAcc = localStorage.getItem('selectedAccommodation');

    if (
      lastTimeStamp &&
      JSON.parse(lastTimeStamp) !== getDateFormat(new Date())
    )
      localStorage.clear();
    else {
      if (selectedRooms) {
        const parsedData = JSON.parse(selectedRooms);
        setSelectedRooms(parsedData);
      }

      if (selectedAcc) {
        const parsedData = JSON.parse(selectedAcc);
        setSelectedAcc(parsedData);
      }
    }
  }, []);

  if (source === 'room') {
    data = selectedRooms;
    setData = setSelectedRooms;
  } else {
    data = selectedAcc;
    setData = setSelectedAcc;
  }

  const navigate = useNavigate();
  const urlParams = new URLSearchParams(
    '?' + window.location.hash.split('?')[1]
  );

  const {
    checkindate: checkInDate,
    checkoutdate: checkOutDate,
    people: people
  } = Object.fromEntries(urlParams.entries());

  const handleComparison = () => {
    if (data.length < 2) setAlertModalState(true);
    else {
      const comparisonData = data.map((el) => {
        return {
          accommodationId: el.accommodationId,
          roomId: el.roomId.toString(),
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          people: people
        };
      });
      setComparisonItems(comparisonData);
      setComparisonModalState(true);
    }
  };

  const deleteSelectedAcc = (idx: number) => {
    const newItems = data.filter((_, i) => i !== idx);
    setData(newItems);
  };

  const saveComparisonData = () => {
    const handleBeforeUnload = () => {
      const today = getDateFormat(new Date());
      const lastTimeStamp = localStorage.getItem('lastTimeStamp');

      if (lastTimeStamp && lastTimeStamp !== today) localStorage.clear();
      else {
        localStorage.setItem(
          'lastTimeStamp',
          JSON.stringify(getDateFormat(new Date()))
        );
        localStorage.setItem('selectedRoom', JSON.stringify(selectedRooms));
        localStorage.setItem(
          'selectedAccommodation',
          JSON.stringify(selectedAcc)
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  };

  saveComparisonData();

  return (
    <article
      className={`flex flex-col justify-between chat chat-end absolute ${
        source === 'room'
          ? 'bottom-16 md:bottom-28 right-16 md:right-20'
          : 'bottom-6 right-16 md:right-20'
      } w-80 h-fit ${display ? 'block' : 'hidden'}`}
    >
      <div className="chat-bubble bg-[#1A1A3D] flex flex-col justify-between w-full h-fit">
        {data.length === 0 && (
          <div className="flex items-center justify-center w-full h-20 mb-2 text-sm bg-white rounded-xl text-black">
            {source === 'room'
              ? '원하시는 객실을 담아주세요'
              : '원하시는 숙소를 담아주세요'}
          </div>
        )}
        {data.map((el, idx) => {
          return (
            <div
              key={idx}
              className="flex justify-between gap-1 mb-2 h-20 rounded-lg bg-white"
            >
              <figure
                className="w-5/12 object-cover rounded-s-lg cursor-pointer tooltip tooltip-warning tooltip-right"
                data-tip="자세히보기"
                onClick={() => {
                  navigate(
                    `/accommodation/${el.accommodationId}?&checkindate=${checkInDate}&checkoutdate=${checkOutDate}&people=${people}`
                  );
                  location.reload();
                }}
              >
                <img
                  src={el.imgUrl}
                  alt={`${el.accommodationName} image`}
                  className="rounded-s-lg h-full w-full"
                />
              </figure>
              <div className="w-5/12 text-sm text-black">
                <p className="truncate font-semibold text-base">
                  {el.accommodationName}
                </p>
                <p>
                  {getSlashDateFormat(checkInDate)} ~{' '}
                  {getSlashDateFormat(checkOutDate)}
                </p>
                <p>{addCommasToPrice(el.price)}원</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();

                  deleteSelectedAcc(idx);
                }}
                className="badge badge-neutral badge-sm mt-1 mr-1 w-3 text-white"
              >
                ✕
              </button>
            </div>
          );
        })}
        <div onClick={handleComparison} className="flex justify-end items-end">
          <button className="btn btn-sm bg-white  border-none text-sm font-normal">
            비교하기
          </button>
        </div>
      </div>
      <ComparisonModal
        data={comparisonItems}
        modalState={comparisonModalState}
        handleModal={setComparisonModalState}
      />
      <AlertModal
        content="최소 2개의 상품을 담아주세요!"
        modalState={alertModalState}
        handleModal={setAlertModalState}
      />
    </article>
  );
};
