import LocalMapView from '../components/map/LocalMapView';
import { useEffect, useState } from 'react';
import { fetchData } from '../api';
import { AxiosResponse } from 'axios';
import {
  AccommodationDetailInitData,
  IAccommodationDetailResponse
} from '../api/accommodationDetail';
import {
  CarouselModal,
  IModalProps
} from '../components/accommodationDetail/CarouselModal';
import { RoomInfo } from '../components/accommodationDetail/RoomInfo';
import { Review } from '../components/accommodationDetail/Review';
import { AccommodationInfo } from '../components/accommodationDetail/AccommodationInfo';
import './AccommodationDetail.css';

const AccommodationDetail = () => {
  const [accommodationData, setAccommodationData] =
    useState<IAccommodationDetailResponse>(AccommodationDetailInitData);

  const [page, setPage] = useState(0);

  const [modalProps, setModalProps] = useState<IModalProps>({
    imgList: [],
    alt: '',
    selectedImg: 0
  });

  const accommodationId =
    window.location.hash.match(/\/accommodation\/(\d+)/) || '';
  const id = accommodationId[1];

  const urlParams = new URLSearchParams(
    '?' + window.location.hash.split('?')[1]
  );
  const {
    checkindate: checkInDate,
    checkoutdate: checkOutDate,
    people
  } = Object.fromEntries(urlParams.entries());

  const [roomData, setRoomData] = useState({
    accommodationName: '',
    accommodationId: 0,
    address: '',
    rate: 0,
    roomId: 0,
    roomName: '',
    roomImg: '',
    price: 0,
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
    people: people
  });

  useEffect(() => {
    (async () => {
      const result: AxiosResponse<any, any> | undefined = await fetchData.get(
        `/accommodation/${id}?checkindate=${checkInDate}&checkoutdate=${checkOutDate}&people=${people}`
      );

      if (result) {
        const data = result.data.data;
        setAccommodationData(data);
        setRoomData((prev) => ({
          ...prev,
          accommodationName: data.accommodationName,
          accommodationId: data.id,
          address: data.address,
          rate: data.rate
        }));
      }
    })();
  }, [id]);

  return (
    <div className="flex flex-col gap-10 lg:pt-10 max-w-5xl mx-auto mb-20 p-5 lg:px-0">
      <div className="grid grid-rows-2 grid-cols-3 gap-2">
        {accommodationData &&
          accommodationData.picUrlList.slice(0, 3).map((el, idx) => {
            if (idx === 0)
              return (
                <label
                  key={idx}
                  htmlFor="reservationModal"
                  className="col-span-2 row-span-2 cursor-pointer"
                  onClick={() =>
                    setModalProps({
                      imgList: accommodationData.picUrlList,
                      alt: 'accommodation first image',
                      selectedImg: idx
                    })
                  }
                >
                  <figure>
                    <img
                      src={el.url}
                      alt={`${accommodationData.accommodationName}-image-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                </label>
              );
            else {
              if (el.url.length > 0) {
                return (
                  <label
                    key={idx}
                    htmlFor="reservationModal"
                    onClick={() =>
                      setModalProps({
                        imgList: accommodationData.picUrlList,
                        alt: 'accommodation total image',
                        selectedImg: idx
                      })
                    }
                  >
                    <figure>
                      <img
                        src={el.url}
                        alt={`${accommodationData.accommodationName}-image-${idx}`}
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    </figure>
                  </label>
                );
              } else {
                return (
                  <figure key={idx}>
                    <div className="flex items-center justify-center w-full h-full object-cover bg-gray-300">
                      No Image
                    </div>
                  </figure>
                );
              }
            }
          })}
      </div>
      <section className="flex flex-col gap-5 md:gap-10">
        <div className="flex gap-5 flex-col md:flex-row">
          <div
            className="flex flex-col gap-5"
            style={{ width: '-webkit-fill-available' }}
          >
            <AccommodationInfo accommodationData={accommodationData} />
          </div>
          {accommodationData && accommodationData.id !== 0 && (
            <LocalMapView
              address={accommodationData.address}
              position={{
                lat: accommodationData.lat,
                lng: accommodationData.lon
              }}
            />
          )}
        </div>
        <div className="divider my-0" />
        <div>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">
            객실안내 및 예약
          </h2>
          <div className="flex flex-col gap-5 text-xs sm:text-sm md:text-base">
            {accommodationData && accommodationData.rooms && (
              <RoomInfo
                roomInfo={accommodationData.rooms}
                setModalProps={setModalProps}
                accommodationName={accommodationData.accommodationName}
                setRoomData={setRoomData}
                roomData={roomData}
              />
            )}
          </div>
        </div>
        <div className="divider" />
        <Review
          id={id}
          accommodationData={accommodationData}
          page={page}
          setPage={setPage}
        />
      </section>
      <CarouselModal
        imgList={modalProps.imgList}
        alt={modalProps.alt}
        selectedImg={modalProps.selectedImg}
      />
    </div>
  );
};

export default AccommodationDetail;
