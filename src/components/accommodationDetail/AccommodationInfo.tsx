import { IAccommodationDetailResponse } from '../../api/accommodationDetail';
import RatingStars from '../../components/common/RatingStars';

export const AccommodationInfo = ({
  accommodationData
}: {
  accommodationData: IAccommodationDetailResponse;
}) => {
  return (
    <>
      {accommodationData && (
        <>
          <h1 className="text-2xl md:text-4xl font-bold">
            {accommodationData.accommodationName}
          </h1>
          <div className="flex items-center gap-5 text-xs sm:text-sm md:text-base">
            <span className="flex items-center gap-2">
              <img src="./assets/icons/location.svg" alt="location icon" />
              {accommodationData.address}
            </span>
            <div className="flex items-center gap-1">
              평점 :<RatingStars rate={accommodationData.rate} />
            </div>
          </div>
          <article className=" flex flex-col gap-2 text-xs sm:text-sm md:text-base w-full">
            {accommodationData.info && (
              <>
                <details open className="bg-base-200 p-3 rounded-lg ">
                  <summary className="text-base md:text-lg font-semibold cursor-pointer">
                    기본정보
                  </summary>
                  {accommodationData.info && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: accommodationData.info
                          .split('<section class="default_info">')[1]
                          .split('<!-- 편의시설 및 서비스 -->')[0]
                          .split('<!-- 판매자 정보 -->')[0]
                      }}
                      className="mt-2"
                    />
                  )}
                </details>
                {accommodationData.info.includes(
                  '<!-- 편의시설 및 서비스 -->'
                ) && (
                  <details className="bg-base-200 p-3 rounded-lg">
                    <summary className="text-base md:text-lg font-semibold cursor-pointer">
                      편의시설 및 서비스
                    </summary>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: accommodationData.info
                          .split('<section class="service">')[1]
                          .split('</section>')[0]
                      }}
                      className="mt-2"
                    />
                  </details>
                )}
                <details className="bg-base-200 p-3 rounded-lg">
                  <summary className="text-base md:text-lg font-semibold cursor-pointer">
                    판매자 정보
                  </summary>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: accommodationData.info
                        .split('<section class="seller_info">')[1]
                        .split('</section>')[0]
                    }}
                    className="mt-2"
                  />
                </details>
              </>
            )}
          </article>
        </>
      )}
    </>
  );
};
