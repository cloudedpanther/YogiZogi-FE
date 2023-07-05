import { useEffect, useState } from 'react';
import {
  IAccommodationDetailResponse,
  IReviewContent,
  IReviewResponse
} from '../../api/accommodationDetail';
import RatingStars from '../../components/common/RatingStars';
import { fetchData } from '../../api';

interface IReview {
  id: string;
  accommodationData: IAccommodationDetailResponse;
}
/**
 * @param id accommodation Id(string),
 * @param accommodationData IAccommodationDetailResponse: 
*/

export const Review = ({ id, accommodationData }: IReview) => {
  const [page, setPage] = useState(0);
  const PageSize = 20;

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

  const [reviewRes, setReviewRes] = useState<IReviewResponse>({
    content: [],
    totalElements: 0,
    totalPages: 0
  });
  const [reviewArr, setReviewArr] = useState<IReviewContent[]>([]);

  const getReview = async (page: number) => {
    fetchData
      .get(`/accommodation/${id}/review?page=${page}&pagesize=${PageSize}`)
      .then((res: any) => {
        setReviewRes({
          content: res.data.data.content,
          totalElements: res.data.data.totalElements,
          totalPages: res.data.data.totalPages
        });
        setReviewArr((prev) => {
          const newReviewArr: IReviewContent[] = [...prev];
          newReviewArr.push(res.data.data.content);
          return newReviewArr;
        });
      })
      .catch(() => []);
  };

  const handleReviewPageButton = (page: number) => {
    setPage(page);
    if (!reviewArr[page]) getReview(page);
  };

  useEffect(() => {
    getReview(page);
  }, []);

  return (
    <>
      <h2 className="text-lg md:text-2xl font-semibold mb-4">리뷰</h2>
      {reviewRes.content.length > 0 && reviewArr.length > 0 ? (
        <>
          <div>
            <div className="flex items-center text-xl md:text-3xl text-center">
              <div className="my-5 w-1/3 p-2">
                <span className="font-semibold text-red-500">
                  {accommodationData && accommodationData.rate}
                </span>{' '}
                / 10 점
              </div>
              <div className="divider divider-horizontal mx-1" />
              <div className="w-2/3 text-center">
                <p className="mb-3 font-semibold">
                  {accommodationData &&
                    rateAdj[Math.trunc(accommodationData.rate) - 1]}
                </p>
                <p className="text-xs md:text-lg">
                  총 {reviewRes.totalElements}개의 확인된 리뷰가 있습니다.
                </p>
              </div>
            </div>
          </div>
          <div className="divider" />
          <div>
            {reviewArr[page] &&
              Object.values(reviewArr[page]).map((el, idx) => {
                return (
                  <div
                    key={idx}
                    className="flex flex-col gap-3 p-3 border rounded-lg mb-5 text-xs md:text-base"
                  >
                    <p className="font-semibold">{el.nickName}</p>
                    <div className="flex flex-col sm:flex-row gap-4 text-xs md:text-base font-medium">
                      <div className="flex items-center gap-2 font-semibold">
                        평점 : <RatingStars rate={el.rating} />
                      </div>
                    </div>
                    <p> {el.description}</p>
                  </div>
                );
              })}
            <div className="flex justify-center items-center">
              {reviewRes.totalPages > 0 &&
                new Array(reviewRes.totalPages).fill(0).map((_, idx) => {
                  return (
                    <div key={idx} className="join">
                      <input
                        aria-label={(idx + 1).toString()}
                        className="join-item btn btn-square rounded-md btn-sm mr-1 checked:bg-red-500 checked:text-white border-none important"
                        type="radio"
                        name="options"
                        checked={page === idx}
                        onChange={() => handleReviewPageButton(idx)}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      ) : (
        <div className="p-3 border rounded-lg mb-5">
          <div className="text-center">등록된 리뷰가 없습니다.</div>
        </div>
      )}
    </>
  );
};
