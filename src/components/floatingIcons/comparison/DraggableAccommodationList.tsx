import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from 'react-beautiful-dnd';
import { useCallback, useEffect, useState } from 'react';
import { addCommasToPrice } from '../../../helpers';
import RatingStars from '../../common/RatingStars';
import { useNavigate } from 'react-router-dom';
import { IComparisonItem, IComparisonFactor } from './types';
import { PriceComparisonChart } from './PriceComparisonChart';
import { useRecoilValue } from 'recoil';
import {
  selectedAccommodation,
  selectedRoom
} from '../../../store/atom/comparisonAtom';

/**
 * @param data IComparisonItem[][][]
 */

// 비교모달 내 각 상품의 section
export const DraggableAccommodationList = ({
  data,
  source
}: {
  data: IComparisonItem[][];
  source: string;
}) => {
  const selectedRooms = useRecoilValue(selectedRoom);
  const selectedAcc = useRecoilValue(selectedAccommodation);
  const [selectedItemInfo, setSelectedItemInfo] =
    useState<IComparisonItem[][]>(data);
  const comparisonData = source === 'room' ? selectedRooms : selectedAcc;
  const [comparisonFactor, setComparisonFactor] = useState<IComparisonFactor>({
    itemPrices: [],
    minPrice: 0,
    highRate: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    setSelectedItemInfo(data);

    const itemPrices = comparisonData.map((el) => el.price);
    const minPrice = Math.min(...itemPrices);
    const highRate = Math.max(...data.map((el) => el[0].rate));
    setComparisonFactor({
      itemPrices,
      minPrice,
      highRate
    });
  }, [data]);

  // 선택된 상품들 모두 편의시설 정보를 가지고 있는지 확인
  // 모든 아이템이 편의시설 정보를 가지고 있을때만, 비교모달에서 편의시설 정보 렌더링
  const hasConveniences = selectedItemInfo.some(
    (el) => el[0] && el[0].convenience === ''
  );

  // DnD에서 drop 이벤트가 발생했을 때 실행 - selectedItemInfo 배열 재정렬
  const onDragEnd = useCallback(
    (result: DropResult, _comparisonFactor: IComparisonFactor) => {
      const { destination, source } = result;

      if (!destination) {
        return;
      }
      if (
        destination.droppableId === source.droppableId &&
        source.index === destination.index &&
        _comparisonFactor.itemPrices.length <= 0
      ) {
        return;
      }
      const updatedSelectedItemInfo = Array.from([...selectedItemInfo]);
      const movedItem = updatedSelectedItemInfo[source.index];
      updatedSelectedItemInfo.splice(source.index, 1);
      updatedSelectedItemInfo.splice(destination.index, 0, movedItem);
      setSelectedItemInfo(updatedSelectedItemInfo);

      if (_comparisonFactor.itemPrices.length > 0) {
        const updatedItemPrice = Array.from(_comparisonFactor.itemPrices);
        const movedPrice = updatedItemPrice[source.index];
        updatedItemPrice.splice(source.index, 1);
        updatedItemPrice.splice(destination.index, 0, movedPrice);
        setComparisonFactor((prev) => ({
          ...prev,
          itemPrices: updatedItemPrice
        }));
      }
    },
    [selectedItemInfo]
  );

  return (
    <DragDropContext
      onDragEnd={(result) => onDragEnd(result, comparisonFactor)}
    >
      <Droppable droppableId="selectedAccommodations" direction="horizontal">
        {(provided) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex gap-1 justify-center p-1 text-center text-xs md:text-base"
          >
            {!isLoading &&
              selectedItemInfo.length > 0 &&
              selectedItemInfo.map((el, idx) => {
                const source = el[0].roomName ? 'room' : 'accommodation';

                if (el[0] === undefined) return null;
                return (
                  <Draggable draggableId={idx.toString()} index={idx} key={idx}>
                    {(provided, snapshot) => (
                      <>
                        <li
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className={`w-44 pb-1 rounded-lg list-none bg-white hover:shadow-lg border-[#1A1A3D] ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          } ${idx === 0 && 'border-2'}`}
                          style={{
                            ...provided.draggableProps.style,
                            top: snapshot.isDragging ? '4.3rem' : '3rem',
                            left:
                              idx === 0
                                ? data.length === 3
                                  ? '1.5rem'
                                  : '7rem'
                                : idx === 1
                                ? data.length === 3
                                  ? '12.5rem'
                                  : '18.2rem'
                                : '23.5rem'
                          }}
                        >
                          <div
                            key={idx}
                            className="flex flex-col gap-y-1 text-center w-full px-1 text-xs md:text-base rounded-lg"
                          >
                            <figure className="relative h-32 object-cover mx-1">
                              <div className="absolute top-[-10px] left-16 badge border border-gray-300 bg-white-500 font-bold">
                                {' '}
                                · · ·
                              </div>
                              <img
                                src={el[0].picUrl}
                                alt={`${el[0].accommodationName} image`}
                                className="w-full h-full rounded-lg"
                              />
                            </figure>
                            <p className="truncate block font-semibold mr-1">
                              {el[0].accommodationName}
                            </p>
                            {source === 'room' && (
                              <p className="truncate">{el[0].roomName}</p>
                            )}
                            <PriceComparisonChart
                              data={selectedItemInfo[idx]}
                            />
                            <p className="flex justify-center gap-1">
                              {source === 'room'
                                ? addCommasToPrice(roomPrice[idx])
                                : addCommasToPrice(accommodationPrice[idx])}
                              원
                              {(source === 'room' &&
                                roomPrice[idx] === Math.min(...roomPrice)) ||
                              (source === 'accommodation' &&
                                roomPrice[idx] === Math.min(...roomPrice)) ? (
                                <img
                                  src="https://em-content.zobj.net/thumbs/320/google/350/red-heart_2764-fe0f.png"
                                  alt="heart mark"
                                  className="w-4 md:h-5 md:pt-1"
                                />
                              ) : null}
                            </p>
                            <div className="flex items-center justify-center gap-1 h-4 md:h-6 ">
                              <RatingStars rate={el[0].rate} />
                              {el[0].rate === highRate && (
                                <img
                                  src="https://em-content.zobj.net/thumbs/320/google/350/red-heart_2764-fe0f.png"
                                  alt="heart mark"
                                  className="w-4 h-5 py-[2px]"
                                />
                              )}
                            </div>
                            <p className="truncate">{el[0].address}</p>
                            {!hasConveniences && (
                              <details
                                id="comparisonFacility"
                                className="bg-base-200 px-1 rounded-lg"
                                open
                              >
                                <summary className="cursor-pointer after:top-1.3 after:w-2 after:h-2">
                                  {`${
                                    el[0].convenience.split(',').length
                                  }개의 편의시설`}
                                </summary>
                                <div className="text-xs">
                                  {el[0].convenience}
                                </div>
                              </details>
                            )}
                            <button
                              onClick={() => {
                                const sourceData =
                                  source === 'accommodation'
                                    ? selectedAcc[idx]
                                    : selectedRooms[idx];
                                navigate(
                                  `/accommodation/${sourceData.accommodationId}?checkindate=${sourceData.checkInDate}&checkoutdate=${sourceData.checkOutDate}&people=${sourceData.people}`
                                );
                                location.reload();
                              }}
                              className="btn mx-auto mt-2  btn-sm text-xs md:text-base font-normal border-red-500 bg-white"
                            >
                              바로가기
                            </button>
                          </div>
                        </li>
                      </>
                    )}
                  </Draggable>
                );
              })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};
