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
import { IComparisonItem, IComparisonResponse } from './types';
import { fetchData } from '../../../api';
import { PriceComparisonChart } from './PriceComparisonChart';

export const DraggableAccommodationList = ({
  data
}: {
  data: IComparisonItem[];
}) => {
  const navigate = useNavigate();
  const [comparisonData, setComparisonData] = useState([...data]);
  const [selectedItemInfo, setSelectedItemInfo] = useState<
    IComparisonResponse[]
  >([]);
  
  const minPrice = Math.min(...selectedItemInfo.map((el) => el.price));
  const highRate = Math.max(...selectedItemInfo.map((el) => el.rate));

  const hasConveniences = selectedItemInfo.some(el => el.convenience === '')

  const fetchDataForItem = (el: any) => {
    const fetchUrl =
      el.roomId === '0'
        ? `/accommodation/compare/accommodation?accommodationid=${el.accommodationId}&checkindate=${el.checkInDate}&checkoutdate=${el.checkOutDate}&people=${el.people}`
        : `/accommodation/compare/room?roomid=${el.roomId}&checkindate=${el.checkInDate}&checkoutdate=${el.checkOutDate}&people=${el.people}`;

    return fetchData.get(fetchUrl).then((res: any) => {
      return {
        ...res.data.data,
        accommodationId: el.accommodationId,
        checkInDate: el.checkInDate,
        checkOutDate: el.checkOutDate,
        people: el.people
      };
    })
    .catch(() => {});
  };

  useEffect(() => {
    const fetchDataForAllItems = async () => {
      const promises = data.map((el) => fetchDataForItem(el));
      try {
        const results = await Promise.all(promises);
        setSelectedItemInfo(results);
      } catch {
        setSelectedItemInfo([]);
      }
    };
    setComparisonData([...data]);
    fetchDataForAllItems();
  }, [data]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source } = result;

      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        source.index === destination.index
      )
        return;

      const updatedselectedItemInfo = Array.from(selectedItemInfo);
      updatedselectedItemInfo.splice(source.index, 1);
      updatedselectedItemInfo.splice(
        destination.index,
        0,
        selectedItemInfo[source.index]
      );
      setSelectedItemInfo(updatedselectedItemInfo);

      const updatedData = Array.from(comparisonData);
      updatedData.splice(source.index, 1);
      updatedData.splice(destination.index, 0, comparisonData[source.index]);
      setComparisonData(updatedData);
    },
    [selectedItemInfo, setSelectedItemInfo]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="selectedAccommodations" direction="horizontal">
        {(provided) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex gap-1 text-center w-full justify-center text-xs md:text-base"
          >
            {selectedItemInfo.length > 0 &&
              selectedItemInfo.map((el, idx) => {
                return (
                  <Draggable
                    draggableId={el.id.toString() + idx}
                    index={idx}
                    key={el.id.toString() + idx}
                  >
                    {(provided, snapshot) => (
                      <>
                        {idx === 1 && data.length === 3 && (
                          <div className="divider w-1 h-full m-0 bg-gray-300"></div>
                        )}
                        <li
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className={`w-44 pb-1 rounded-lg list-none bg-white hover:shadow-lg ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
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
                            className="flex flex-col gap-y-1 text-center w-full p-1 text-xs md:text-base rounded-lg"
                          >
                            <figure className="relative h-32 object-cover mx-1">
                              <div className="absolute top-[-10px] left-16 badge bg-red-500 text-white font-bold">
                                {' '}
                                · · ·
                              </div>
                              <img
                                src={el.picUrl}
                                className="w-full h-full rounded-lg"
                              />
                            </figure>
                            <p className="truncate block font-semibold mr-1">
                              {el.accommodationName}
                            </p>
                            {comparisonData[idx] && (
                              <PriceComparisonChart
                                data={comparisonData[idx]}
                              />
                            )}
                            <p className="flex justify-center gap-1">
                              {addCommasToPrice(el.price)}원
                              {el.price === minPrice && (
                                <img
                                  src="https://em-content.zobj.net/thumbs/320/google/350/red-heart_2764-fe0f.png"
                                  alt="heart mark"
                                  className="w-4 md:h-5 md:pt-1"
                                />
                              )}
                            </p>
                            <div className="flex items-center justify-center gap-1 h-4 md:h-6 ">
                              <RatingStars rate={el.rate} />
                              {el.rate === highRate && (
                                <img
                                  src="https://em-content.zobj.net/thumbs/320/google/350/red-heart_2764-fe0f.png"
                                  alt="heart mark"
                                  className="w-4 h-5 py-[2px]"
                                />
                              )}
                            </div>
                            <p className="truncate">{el.address}</p>
                            {!hasConveniences && (
                              <details
                                id="comparisonFacility"
                                className="bg-base-200 px-1 rounded-lg"
                                open
                              >
                                <summary className="cursor-pointer">
                                  {`${
                                    el.convenience.split(',').length
                                  }개의 편의시설`}
                                </summary>
                                <div className="text-xs">{el.convenience}</div>
                              </details>
                            )}
                            <button
                              onClick={() => {
                                navigate(
                                  `/accommodation/${el.accommodationId}?checkindate=${el.checkInDate}&checkoutdate=${el.checkOutDate}&people=${el.people}`
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
