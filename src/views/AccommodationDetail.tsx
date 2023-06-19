import { addCommasToPrice } from '../helpers';
import RatingStars from '../components/common/RatingStars';
import { BiMap } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { fetchData } from '../api';
import { AxiosResponse } from 'axios';
import { AccommodationDetailInitData, IAccommodationDetailResponse, IReview, IReviewResponse } from '../api/accommodationDetail';
import { Modal } from '../components/accommodationDetail/Modal';

const AccommodationDetail = () => {
  const [accommodationData, setAccommodationData] =
    useState<IAccommodationDetailResponse>(AccommodationDetailInitData);
  const [page, setPage] = useState(1);
  const [reviewRes, setReviewRes] = useState<IReviewResponse>({
    content: [],
    totalElement: 0,
    totalPages: 0
  });
  const [reviewArr, setReviewArr] = useState<IReview[]>([]);

  const rateAdj = [
    'Terrible',
    'Poor',
    'Bad',
    'Okay',
    'Good',
    'Fine',
    'Very good',
    'Excellent',
    'Outstanding',
    'Perfect'
  ];

  const accommodationId =
    window.location.hash.match(/\/accommodation\/(\d+)/) || '';
  const id = accommodationId[1];

  const urlParams = new URLSearchParams(
    '?' + window.location.hash.split('?')[1]
  );
  const accommodationRate = urlParams.get('rate');

  const getReview = async (page: number) => {
    const reviewRes: AxiosResponse<any, any> | undefined = await fetchData.get(
      `/accommodation/${id}/review?page=${page}&pagesize=5`
    );
    if (reviewRes && reviewRes.data) {
      setReviewRes({
        content: reviewRes.data.content,
        totalElement: reviewRes.data.totalElements,
        totalPages: reviewRes.data.totalPages
      });
      setReviewArr((prev) => {
        const newReviewArr: IReview[] = [...prev];
        newReviewArr[page - 1] = reviewRes.data.content;
        return newReviewArr;
      });
    }
  };

  useEffect(() => {
    (async () => {
      const result: AxiosResponse<any, any> | undefined = await fetchData.get(
        `/accommodation/${id}`
      );

      if (result) {
        setAccommodationData(result.data.data[1]);
      }
      getReview(1);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!reviewArr[page - 1]) getReview(page);
    })();
  }, [page]);

  return (
    <div className="flex flex-col gap-10 lg:pt-10 max-w-5xl mx-auto mb-20 p-5 lg:px-0">
      <div className="grid grid-rows-2 grid-cols-4 gap-2">
        {accommodationData.pictureUrlList.slice(0, 5).map((el, idx) => {
          if (idx === 0)
            return (
              <label
                key={idx}
                htmlFor="reservationModal"
                className="col-span-2 row-span-2 cursor-pointer"
              >
                <figure>
                  <img
                    src={el}
                    alt={`${accommodationData.accommodationName}-image-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </figure>
              </label>
            );
          else {
            if (el.length > 0) {
              return (
                <label key={idx} htmlFor="reservationModal">
                  <figure>
                    <img
                      src={el}
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
        <Modal imgList={accommodationData.pictureUrlList} />
      </div>
      <section className="flex flex-col gap-5 md:gap-10">
        <div className="flex gap-5 flex-col md:flex-row">
          <div className="flex flex-col gap-5">
            <h1 className="text-2xl md:text-4xl font-bold">
              {accommodationData.accommodationName}
            </h1>
            <div className="flex items-center gap-5 text-xs sm:text-sm md:text-base">
              <span className="flex items-center gap-2">
                <BiMap />
                {accommodationData.address}
              </span>
              <div className="flex items-center gap-1">
                평점 :<RatingStars rate={Number(accommodationRate)} />
              </div>
            </div>
            <div className="text-xs sm:text-sm md:text-base">
              <h2 className="text-lg md:text-2xl font-semibold mb-2">
                숙소 정보
              </h2>
              <p className="leading-7">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim a
                praesentium explicabo totam officiis, placeat quis eaque
                doloribus vero, veniam eius quaerat rem, dolores et eum
                consectetur non quisquam nostrum!
                <br />
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia
                est repellendus impedit ab, et ducimus accusamus delectus atque
                dolorem hic maxime similique porro cumque mollitia quaerat
                fugiat? Ratione, quia illum?
              </p>
            </div>
          </div>
        </div>
        <div className="divider my-0" />
        <div>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">
            객실안내 및 예약
          </h2>
          <div className="flex flex-col gap-3">
            {accommodationData.room.map((el, idx) => {
              return (
                <div className="flex gap-3" key={idx}>
                  <figure className="mx-auto w-1/3 md:w-1/3">
                    <img src={el.pictureUrlList[0]} />
                  </figure>
                  <div className="flex flex-row w-1/3">
                    <div className="flex flex-col gap-3 w-3/4 md:w-3/4">
                      <h3 className="text-base md:text-xl font-semibold md:mb-1">
                        {el.roomName}
                      </h3>
                      <p className="flex gap-1 whitespace-pre-line">
                        체크인: {el.checkInTime}시 <br />
                        체크아웃: {el.checkOutTime}시 <br />
                        기본인원: {el.defaultPeople}명 <br />
                        최대인원: {el.maxPeople}명
                      </p>
                    </div>
                  </div>
                  <div className="divider divider-horizontal mx-2" />
                  <div className="flex flex-col gap-3 w-1/4 md:w-1/4 my-auto items-center justify-end">
                    {el.price.map((el, idx) => {
                      return (
                        <button key={idx} className="flex btn bg-red-500 hover:bg-red-600 text-white">
                          <p>{el.date}</p>
                          <p>{addCommasToPrice(el.price)}원</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="divider" />
        <div>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">리뷰</h2>
          <div className="flex items-center text-xl md:text-3xl text-center">
            <div className="my-5 w-1/3 p-2">
              <span className="font-semibold text-red-500">
                {accommodationRate}
              </span>{' '}
              / 10 점
            </div>
            <div className="divider divider-horizontal mx-1" />
            <div className="w-2/3 text-center">
              <p className="mb-3 font-semibold">
                {rateAdj[Math.trunc(Number(accommodationRate)) - 1]}
              </p>
              <p className="text-xs md:text-lg">
                총 8개의 확인된 리뷰가 있습니다.
              </p>
            </div>
          </div>
        </div>
        <div className="divider" />
        <div>
          <div className="flex flex-col gap-3 p-3 border rounded-lg text-xs md:text-base">
            <p className="font-semibold">name</p>
            <div className="flex flex-col sm:flex-row gap-4 text-xs md:text-base font-medium">
              <p className="font-semibold">
                투숙 기간 :{' '}
                <span className="text-slate-500 font-medium">1/1 ~ 2/1</span>
              </p>
              <div className="flex items-center gap-2 font-semibold">
                평점 :{' '}
                <div className="text-slate-500">
                  <RatingStars rate={9} />
                </div>
              </div>
            </div>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione
              molestiae, maiores perferendis non possimus, dolorum repellendus
              quam consequatur maxime obcaecati distinctio magni ab qui nam, id
              rem eligendi deserunt nemo?
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccommodationDetail;
