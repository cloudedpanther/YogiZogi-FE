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
import { fetchData } from '../../../api';
import { AxiosResponse } from 'axios';
import { getQueryStrData } from '../../../utils/handleQueryString';

interface IComparisonBox {
  display: boolean;
  source: string;
}

/**
 * @param display boolean, 비교함이 띄워질지 여부
 * @param source string, page source ('room' or 'accommodation')
 */

export const ComparisonBox = ({ display, source }: IComparisonBox) => {
  let data: IComparisonBoxProps[],
    setData: SetterOrUpdater<IComparisonBoxProps[]>;

  const [selectedRooms, setSelectedRooms] = useRecoilState(selectedRoom);
  const [selectedAcc, setSelectedAcc] = useRecoilState(selectedAccommodation);

  const [alertModalState, setAlertModalState] = useState(false);
  const [comparisonModalState, setComparisonModalState] = useState(false);
  const [comparisonItems, setComparisonItems] = useState<IComparisonItem[][]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // 페이지가 reload 된 후, 기존 비교함에 있던 정보를 localstorage에서 가져와 recoil로 상태관리
  // 오늘 비교함에 담은 데이터가 아닌 경우, localstorage를 비워줌
  const clearLocalStorageOfComparison = () => {
    localStorage.removeItem('lastTimeStamp');
    localStorage.removeItem('selectedRoom');
    localStorage.removeItem('selectedAccommodation');
  };

  useEffect(() => {
    const lastTimeStamp = localStorage.getItem('lastTimeStamp');
    const selectedRooms = localStorage.getItem('selectedRoom');
    const selectedAcc = localStorage.getItem('selectedAccommodation');

    if (
      lastTimeStamp &&
      JSON.parse(lastTimeStamp) !== getDateFormat(new Date())
    )
      clearLocalStorageOfComparison();
    else {
      if (
        lastTimeStamp &&
        JSON.parse(lastTimeStamp) !== getDateFormat(new Date())
      )
        clearLocalStorageOfComparison();
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
    }
  }, []);

  if (source === 'room') {
    data = selectedRooms;
    setData = setSelectedRooms;
  } else {
    data = selectedAcc;
    setData = setSelectedAcc;
  }

  const { checkInDate, checkOutDate, people } = getQueryStrData();

  // 사용자가 현재 페이지를 떠나기 전에 비교함의 상품 데이터를 localstorage에 저장
  const saveComparisonData = () => {
    const handleBeforeUnload = () => {
      const today = getDateFormat(new Date());
      const lastTimeStamp = localStorage.getItem('lastTimeStamp');

      if (lastTimeStamp && lastTimeStamp !== today)
        clearLocalStorageOfComparison();
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

  // 28일 간격 3개의 날짜 반환(차트에 쓰일 3개의 check in/out date를 반환)
  const getThreeDates = (day: string) => {
    const startDate = new Date(`2023-07-${day}`);
    let days = [];

    for (let i = 0; i < 3; i++) {
      const currentDate = new Date(
        startDate.getTime() + i * 28 * 24 * 60 * 60 * 1000
      );
      days.push(getDateFormat(currentDate));
    }
    return days;
  };

  // 데이터 fetching
  // Promise.all()을 사용해, 모든 데이터를 받아왔을 때, comparisonItems 상태 업데이트
  const fetchDataForItem = (items: IComparisonBoxProps[]) => {
    let checkInDays: string[], checkOutDays: string[];
    let fetchUrl: string[][] = [];

    items.forEach((item) => {
      let itemUrls: string[] = [];

      const checkInDates = checkInDate.split('-').pop();
      const checkOutDates = checkOutDate.split('-').pop();

      checkInDays = getThreeDates(checkInDates!);
      checkOutDays = getThreeDates(checkOutDates!);

      checkInDays.forEach((el, idx) => {
        itemUrls.push(
          item.roomId === undefined || item.roomId === 0
            ? `/accommodation/compare/accommodation?accommodationid=${item.accommodationId}&checkindate=${el}&checkoutdate=${checkOutDays[idx]}&people=${people}`
            : `/accommodation/compare/room?roomid=${item.roomId}&checkindate=${el}&checkoutdate=${checkOutDays[idx]}&people=${people}`
        );
      });
      fetchUrl.push(itemUrls);
    });

    let response: Promise<AxiosResponse>[][] = [];
    fetchUrl.map((urls) => {
      let urlArr: Promise<AxiosResponse>[] = [];
      urls.forEach((url) => {
        urlArr.push(
          fetchData.get<AxiosResponse>(url) as Promise<AxiosResponse>
        );
      });
      response.push(urlArr);
    });
    return response;
  };

  const handleComparison = () => {
    if (data.length < 2) setAlertModalState(true);
    else {
      const fetchDataForAllItems = () => {
        const promises = fetchDataForItem(data);
        return Promise.all<Promise<AxiosResponse[]>[]>(
          promises.map((promiseArr) => Promise.all(promiseArr)) as Promise<
            AxiosResponse[]
          >[]
        )
          .then((results) => {
            setComparisonItems([
              ...results.map((x) => x.map((y) => (y.data ? y.data.data : {})))
            ]);
          })
          .then(() => {
            setComparisonModalState(true);
            setIsLoading(false);
          });
      };

      setIsLoading(true);
      fetchDataForAllItems();
    }
  };

  const deleteSelectedAcc = (idx: number) => {
    const newItems = data.filter((_, i) => i !== idx);
    const newComparisonItems = comparisonItems.filter((_, i) => i !== idx);
    setData(newItems);
    setComparisonItems(newComparisonItems);
  };

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
      {!isLoading && (
        <ComparisonModal
          data={comparisonItems}
          source={source}
          modalState={comparisonModalState}
          handleModal={setComparisonModalState}
        />
      )}
      <AlertModal
        content="최소 2개의 상품을 담아주세요!"
        modalState={alertModalState}
        handleModal={setAlertModalState}
      />
    </article>
  );
};
