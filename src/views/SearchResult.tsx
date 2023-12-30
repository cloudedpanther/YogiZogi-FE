import SortingFactorSelect from '../components/searchResult/SortingFactorSelect';
import CategorySelect from '../components/searchResult/CategorySelect';
import PriceRangeSelect from '../components/searchResult/PriceRangeSelect';
import useMapView from '../hooks/useMapView';
import useDetailedSearch from '../hooks/useDetailedSearch';
import { Link } from 'react-router-dom';
import AccommodationPreview from '../components/searchResult/AccommodationPreview';
import { FloatingIcon } from '../components/floatingIcons/FloatingIcon';
import MapView from '../components/map/MapView';
import useDetailedSearchParams from '../hooks/useDetailedSearchParams';

const SearchResult = () => {
  const [isMapView, onViewToggle] = useMapView();
  const {
    formRef,
    onSubmit,
    totalElements,
    accommodationList,
    isLoading,
    observerTarget
  } = useDetailedSearch();
  const [searchParams] = useDetailedSearchParams();

  return (
    <div
      className="max-w-5xl mx-auto px-4 py-8 bg-white"
      style={{ minWidth: '375px' }}
    >
      {isLoading && (
        <div className="w-screen h-full absolute top-0 left-0 z-[300]"></div>
      )}
      {isMapView ? (
        // 지도로 보기
        <>
          <section>
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">
                {`${totalElements}개의 검색 결과`}
              </h3>
              <button
                className="btn btn-ghost bg-white drop-shadow text-xs px-8 h-10 min-h-full"
                onClick={onViewToggle}
              >
                목록으로 보기
              </button>
            </div>
            <hr className="mt-2 mb-8" />
            {!totalElements && (
              <p className="text-center p-4">검색 결과가 없습니다.</p>
            )}
            <div>
              {!isLoading && (
                <MapView
                  searchData={accommodationList}
                  param={{
                    people: parseInt(searchParams.people),
                    checkindate: searchParams.checkindate,
                    checkoutdate: searchParams.checkoutdate
                  }}
                />
              )}
            </div>
          </section>
        </>
      ) : (
        // 목록으로 보기
        <>
          {/* 상세 검색 도구 */}
          <form
            className="bg-slate-100 px-4 py-6 rounded-lg"
            onSubmit={onSubmit}
            ref={formRef}
          >
            <section className="lg:flex lg:items-center lg:justify-between">
              <CategorySelect />
              <div className="hidden lg:block h-12 w-0.5 bg-gray-200"></div>
              <section className="md:flex md:justify-between lg:justify-end lg:gap-4 items-center mt-2 md:mb-0 lg:mt-0 max-w-3xl">
                <SortingFactorSelect />
                <PriceRangeSelect />
              </section>
            </section>
            <div className="mt-4 flex lg:justify-end">
              <button
                type="submit"
                className="btn bg-red-500 text-white drop-shadow btn-sm h-10 w-24 hover:bg-red-600"
              >
                검색하기
              </button>
            </div>
          </form>

          {/* 검색 결과 */}
          <section className="mt-10">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">
                {isLoading ? (
                  <span className="loading loading-dots loading-md"></span>
                ) : (
                  `${totalElements}개의 검색 결과`
                )}
              </h3>
              <button
                className="btn btn-ghost bg-white drop-shadow text-xs px-8 h-10 min-h-full"
                onClick={onViewToggle}
              >
                지도로 보기
              </button>
            </div>
            <hr className="mt-2 mb-8" />
            {!isLoading && !totalElements && (
              <p className="text-center p-4">검색 결과가 없습니다.</p>
            )}
            <div className="grid lg:grid-cols-3 auto-rows-fr gap-4 md:grid-cols-2">
              {accommodationList?.map((accommodation) => {
                return (
                  <Link
                    key={String(accommodation.id) + String(new Date())}
                    to={`/accommodation/${accommodation.id}?checkindate=${searchParams.checkindate}&checkoutdate=${searchParams.checkoutdate}&people=${searchParams.people}`}
                  >
                    <AccommodationPreview data={accommodation} />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* 무한스크롤 옵저버 */}
          <div
            ref={observerTarget}
            className="w-full flex justify-center items-center h-60"
          >
            <p className="loading loading-spinner loading-lg"></p>
          </div>

          {/* 비교함 아이콘 */}
          <FloatingIcon />

          {/* 모달 */}
          {/* <AlertModal
        content="최대 3개의 상품만 담을 수 있습니다."
        modalState={modalState}
        handleModal={setModalState}
      /> */}
        </>
      )}
    </div>
  );
};

export default SearchResult;
