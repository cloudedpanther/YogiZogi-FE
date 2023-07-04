import { useCallback, useState } from 'react';
import { CustomOverlayMap, Map } from 'react-kakao-maps-sdk';
import FacilityMarker from './marker/FacilityMarker';
import { ISearchResultContent } from 'api/search';
import useDynamicMap from '../../hooks/useDynamicMap';
import { useNavigate } from 'react-router-dom';
import { addCommasToPrice } from '../../helpers';

interface DynamicMapProps {
  searchData: ISearchResultContent[];
  param: {
    people: number;
    checkindate: string;
    checkoutdate: string;
  };
}

const DynamicMap = ({ searchData, param }: DynamicMapProps) => {
  const navigate = useNavigate();
  const [isMapLoad, setIsMapLoad] = useState<boolean>(false);
  const [isMapMove, setIsMapMove] = useState<boolean>(false);

  const {
    mapData,
    center,
    handleCloseInfo,
    mapBounds,
    activeMarker,
    setMapBounds,
    handleOnClickMove,
    searchMapData
  } = useDynamicMap(searchData);

  const handleMapMove = (map: kakao.maps.Map) => {
    setIsMapMove(true);
    setMapBounds(map);
  };

  const handleOnClickSearch = useCallback(() => {
    searchMapData();
    setIsMapMove(false);
    handleCloseInfo();
  }, []);

  const handleMoveDetail = (id: number) => {
    const url = `/accommodation/${id}?checkindate=${param.checkindate}&checkoutdate=${param.checkoutdate}&people=${param.people}`;
    if (typeof window !== 'undefined' && typeof window.open === 'function') {
      // window.open 사용 가능한 경우
      window.open(`#${url}`, '_blank');
    } else {
      // window.open 사용 불가능한 경우
      navigate(url);
    }
  };

  return (
    <div
      className="relative mx-auto max-w-5xl"
      style={{ height: 'calc(100vh - 200px)' }}
    >
      {isMapMove && <RefreshBtn handleOnClick={handleOnClickSearch} />}
      {activeMarker !== 0 && (
        <FacilityDetailBox
          info={mapData.find(({ id }) => id === activeMarker)}
          handleOnClick={() => handleMoveDetail(activeMarker)}
        />
      )}
      <Map
        center={center}
        style={{ width: '100%', height: '100%' }}
        isPanto={true}
        onClick={handleCloseInfo}
        onCreate={(map) => {
          if (!isMapLoad) {
            const bounds = mapBounds();
            setTimeout(() => {
              map.setBounds(bounds);
              setIsMapMove(false);
            }, 10);
            setIsMapLoad(true);
          }
        }}
        onDragEnd={handleMapMove}
        onZoomChanged={handleMapMove}
      >
        {mapData.map((item) => (
          <CustomOverlayMap
            position={{
              lat: item.lat,
              lng: item.lon
            }}
            clickable={true}
            key={item.id}
            zIndex={activeMarker === item.id ? 99 : -1}
          >
            <FacilityMarker
              info={item}
              isActive={activeMarker === item.id}
              handleOnClickMove={handleOnClickMove}
              handleOnClick={() => handleMoveDetail(activeMarker)}
            />
          </CustomOverlayMap>
        ))}
      </Map>
    </div>
  );
};

export default DynamicMap;

const RefreshBtn = ({ handleOnClick }: { handleOnClick: () => void }) => {
  return (
    <span
      className="cursor-pointer absolute flex items-center gap-2 top-8 left-1/2 px-6 py-3 rounded-full bg-white font-semibold text-sm hover:bg-base-200 transition-all drop-shadow-md -translate-x-1/2 z-10"
      onClick={handleOnClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>{' '}
      현 지도에서 검색
    </span>
  );
};

const FacilityDetailBox = ({
  info,
  handleOnClick
}: {
  info?: ISearchResultContent;
  handleOnClick: () => void;
}) => {
  if (!info) {
    return <></>;
  }
  return (
    <div
      className="absolute bottom-8 px-4 w-full h-auto z-10 sm:hidden"
      onClick={handleOnClick}
    >
      <div className="cursor-pointer flex max-w-[24rem] m-auto w-full h-32 bg-white rounded-lg drop-shadow-md overflow-hidden">
        <div className="min-w-[8rem] w-32 h-32">
          <img
            className="w-full h-full object-cover"
            src={info.picUrl}
            alt="이미지"
          />
        </div>
        <div className="w-[calc(100%-128px)] flex flex-col justify-between p-3">
          <div className="flex flex-col">
            <h1 className="flex-1 font-medium text-lg truncate">
              {info.accommodationName}
            </h1>
            <span className="text-sm truncate">{info.address}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="font-normal text-md">
              ₩{addCommasToPrice(info.price)}
            </span>
            <span className="flex items-center text-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="orange"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="orange"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
              {info.rate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
