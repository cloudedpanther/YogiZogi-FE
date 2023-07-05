import LocalMapView from '../components/map/LocalMapView';
import { useEffect, useState } from 'react';
import { fetchData } from '../api';
import {
  AccommodationDetailInitData,
  IAccommodationDetailResponse,
  IReservationConfirm,
  IRoomResponse
} from '../api/accommodationDetail';
import {
  ImageCarouselModal,
  IImageCarouselModal
} from '../components/accommodationDetail/ImageCarouselModal';
import { RoomInfo } from '../components/accommodationDetail/RoomInfo';
import { Review } from '../components/accommodationDetail/Review';
import { AccommodationInfo } from '../components/accommodationDetail/AccommodationInfo';
import './AccommodationDetail.css';
import { FloatingIcon } from '../components/floatingIcons/FloatingIcon';
import { getQueryStrData } from '../utils/handleQueryString';

const AccommodationDetail = () => {
  const [accommodationData, setAccommodationData] =
    useState<IAccommodationDetailResponse>(AccommodationDetailInitData);

  const { accommodationId, checkInDate, checkOutDate, people } =
    getQueryStrData();

  const [modalProps, setModalProps] = useState<IImageCarouselModal>({
    imgList: [],
    alt: '',
    selectedImg: 0
  });

  const [roomData, setRoomData] = useState<IReservationConfirm>({
    accommodationName: '',
    accommodationId: accommodationId,
    roomId: '',
    roomName: '',
    address: '',
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
    rate: 0,
    people: people,
    price: '',
    imgUrl: ''
  });

  useEffect(() => {
    fetchData
      .get(
        `/accommodation/${accommodationId}?checkindate=${checkInDate}&checkoutdate=${checkOutDate}&people=${people}`
      )
      .then((res: any) => {
        res.data.data.rooms = res.data.data.rooms.filter(
          (room: IRoomResponse) => room.pictureUrlList.length > 0
        );
        const { accommodationName, rate, address } = res.data.data;
        setAccommodationData({ ...res.data.data });
        setRoomData((prev) => ({
          ...prev,
          accommodationName,
          accommodationId: id,
          rate,
          people,
          address
        }));
      })
      .catch(() => {});
  }, []);

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
            {accommodationData && (
              <RoomInfo
                roomInfo={accommodationData.rooms}
                setModalProps={setModalProps}
                setRoomData={setRoomData}
                roomData={roomData}
              />
            )}
          </div>
        </div>
        <div className="divider" />
        <Review id={accommodationId} accommodationData={accommodationData} />
      </section>
      <FloatingIcon />
      <ImageCarouselModal
        imgList={modalProps.imgList}
        alt={modalProps.alt}
        selectedImg={modalProps.selectedImg}
      />
    </div>
  );
};

export default AccommodationDetail;
