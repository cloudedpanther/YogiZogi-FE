import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AccommodationPreview from '../components/searchResult/AccommodationPreview';
import Range from '../components/searchResult/Range';
import {
  Category,
  DEFAULT_LAT,
  DEFAULT_LON,
  Direction,
  MAX_PRICE,
  MIN_PRICE,
  RANGE_WIDTH,
  STEPS,
  Sort,
  View,
  categories,
  categoryList,
  sortingFactorList,
  sortingFactors,
  SEARCH_START_PAGE
} from '../components/searchResult/constants';
import {
  CategoryTypes,
  SortingFactorTypes
} from '../components/searchResult/types';
import {
  ISearchParams,
  ISearchResultContent,
  getDetailedSearchResult
} from '../api/search';
import { getTodayString, getTomorrowString } from '../utils/handleDate';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import MapView from '../components/map/MapView';
import { FloatingIcon } from '../components/floatingIcons/FloatingIcon';
import { AlertModal } from '../components/common/AlertModal';
import { useRecoilState } from 'recoil';
import { selectedAccommodation } from '../store/atom/comparisonAtom';

const SearchResult = () => {
  // 숙소 비교 관련 코드
  const [selectedAcc, setSelectedAcc] = useRecoilState(selectedAccommodation);
  const [modalState, setModalState] = useState(false);

  const [accommodationList, setAccommodationList] = useState<
    ISearchResultContent[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  const [viewType, setViewType] = useState<boolean>(View.LIST);

  const [selectedCategory, setSelctedCategory] = useState<CategoryTypes>(
    Category.ALL
  );

  const [selectedSortingFactor, setSelectedSortingFactor] =
    useState<SortingFactorTypes>(Sort.RATE);

  const [minRangeValue, setMinRangeValue] = useState(MIN_PRICE);
  const [maxRangeValue, setMaxRangeValue] = useState(MAX_PRICE);

  const location = useLocation();
  const initialParams = new URLSearchParams(location.search);

  const [totalElements, setTotalElements] = useState<number>(0);

  const [isDataEnd, setIsDataEnd] = useState(false);

  const searchParams = useRef<ISearchParams>({
    keyword: initialParams.get('keyword') || '',
    checkindate: initialParams.get('checkindate') || getTodayString(),
    checkoutdate: initialParams.get('checkoutdate') || getTomorrowString(),
    people: initialParams.get('people') || '1',
    lat: initialParams.get('lat') || DEFAULT_LAT,
    lon: initialParams.get('lon') || DEFAULT_LON,
    sort: Sort.RATE,
    direction: Direction.DESC,
    minprice: null,
    maxprice: null,
    category: Category.ALL,
    page: SEARCH_START_PAGE
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  const [observe, unobserve] = useIntersectionObserver(async () => {
    setIsLoading(true);
  });

  const showObserver = useCallback(() => {
    if (!observerTarget.current) return;

    observerTarget.current.classList.remove('hidden');
    observerTarget.current.classList.add(
      'flex',
      'justify-center',
      'items-center'
    );
  }, [observerTarget]);

  const hideObserver = useCallback(() => {
    if (!observerTarget.current) return;

    observerTarget.current.classList.remove(
      'flex',
      'justify-center',
      'items-center'
    );
    observerTarget.current.classList.add('hidden');
  }, [observerTarget]);

  const getParams = useCallback(() => {
    return {
      keyword: searchParams.current.keyword,
      checkindate: searchParams.current.checkindate,
      checkoutdate: searchParams.current.checkoutdate,
      people: searchParams.current.people,
      lat: searchParams.current.lat,
      lon: searchParams.current.lon,
      sort: searchParams.current.sort,
      direction: searchParams.current.direction,
      minprice: searchParams.current.minprice,
      maxprice: searchParams.current.maxprice,
      category: searchParams.current.category,
      page: searchParams.current.page
    };
  }, [searchParams]);

  const handleViewToggle = useCallback(() => {
    setViewType((viewType) => {
      const nextValue = !viewType;
      if (!observerTarget.current) {
        return nextValue;
      }

      if (nextValue === View.MAP) {
        stopObserving();
        hideObserver();
        return nextValue;
      }

      if (!isDataEnd && nextValue === View.LIST) {
        startObserving();
      }

      return nextValue;
    });
  }, [viewType]);

  const handleRangeValueChange = useCallback(
    (min: number, max: number) => {
      for (const value of [min, max]) {
        if (value < MIN_PRICE || value > MAX_PRICE || isNaN(value)) return;
      }

      setMinRangeValue(min);
      setMaxRangeValue(max);

      let minValue: string | null = String(min * 10000);
      let maxValue: string | null = String(max * 10000);

      if (min === 1) minValue = null;
      if (max === 30) maxValue = null;

      searchParams.current.minprice = minValue;
      searchParams.current.maxprice = maxValue;
    },
    [
      minRangeValue,
      maxRangeValue,
      searchParams.current.minprice,
      searchParams.current.maxprice
    ]
  );

  const handleSelectCategory = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.id) as CategoryTypes;

      if (categoryList.includes(value)) {
        setSelctedCategory(value);
        searchParams.current.category = value;
      }
    },
    [selectedCategory, searchParams.current.category]
  );

  const handleSelectSortingFactor = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.id as SortingFactorTypes;

      if (sortingFactorList.includes(value)) {
        if (value === Sort.RATE) {
          searchParams.current.sort = value;
          searchParams.current.direction = 'desc';
        }

        if (value === Sort.DISTANCE) {
          searchParams.current.sort = value;
          searchParams.current.direction = 'asc';
        }

        if (value === Sort.HIGHPRICE) {
          searchParams.current.sort = 'price';
          searchParams.current.direction = 'desc';
        }

        if (value === Sort.LOWPRICE) {
          searchParams.current.sort = 'price';
          searchParams.current.direction = 'asc';
        }

        setSelectedSortingFactor(value);
      }
    },
    [
      searchParams.current.sort,
      searchParams.current.direction,
      selectedSortingFactor
    ]
  );

  const renderCurrentPriceRange = useCallback(() => {
    if (maxRangeValue === MAX_PRICE) {
      return `${minRangeValue}만원 이상`;
    }

    return `${minRangeValue}만원 ~ ${maxRangeValue}만원`;
  }, [minRangeValue, maxRangeValue]);

  const startObserving = useCallback(() => {
    if (observerTarget.current !== null) {
      showObserver();
      observe(observerTarget.current);
    }
  }, [observerTarget]);

  const stopObserving = useCallback(() => {
    if (observerTarget.current !== null) {
      unobserve(observerTarget.current);
    }
  }, [observerTarget]);

  const checkDataEnd = useCallback(
    (prev: number, cur: number, total: number) => {
      if (cur === 0 || prev + cur === total) {
        setIsDataEnd(true);
      }
    },
    []
  );

  const handleDetailedSearch = useCallback(async () => {
    const params = getParams();
    const { totalElements: newTotalElements, content } =
      await getDetailedSearchResult(params);

    setAccommodationList((prev) => {
      checkDataEnd(prev.length, content.length, newTotalElements);
      return [...prev, ...content];
    });

    if (totalElements === 0) {
      setTotalElements(newTotalElements);
    }
  }, [totalElements]);

  const handleSearchButtonClick = useCallback(async () => {
    setAccommodationList([]);
    setTotalElements(0);
    searchParams.current.page = SEARCH_START_PAGE;

    startObserving();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!searchParams.current.keyword) {
        searchParams.current.sort = Sort.DISTANCE;
        searchParams.current.direction = Direction.ASC;

        setSelectedSortingFactor(Sort.DISTANCE);
      }
      startObserving();
    };
    init();
  }, []);

  useEffect(() => {
    if (observerTarget.current === null) {
      return;
    }

    if (isLoading) {
      stopObserving();

      const loadData = async () => {
        await handleDetailedSearch();
        searchParams.current.page++;
        setIsLoading(false);
      };
      loadData();
      return;
    }

    if (!isDataEnd && viewType === View.LIST) {
      startObserving();
      return;
    }

    hideObserver();
  }, [isLoading]);

  // 비교함에 상품이 3개 이상일때, 초기 3개의 상품만 반환
  useEffect(() => {
    if (selectedAcc.length > 3) {
      setSelectedAcc(selectedAcc.slice(0, 3));
      setModalState(true);
    }
  }, [selectedAcc]);

  return (
    <div
      className="max-w-5xl mx-auto px-4 py-8 bg-white"
      style={{ minWidth: '375px' }}
    >
      {isLoading && (
        <div className="w-screen h-full absolute top-0 left-0 z-[300]"></div>
      )}
      {viewType !== View.MAP && (
        <section className="bg-slate-100 px-4 py-6 rounded-lg">
          <section className="lg:flex lg:items-center lg:justify-between">
            <section className="flex gap-2">
              {categories.map((category) => {
                const categoryKey = `${category.id}`;
                return (
                  <div key={categoryKey}>
                    <input
                      type="radio"
                      name="category"
                      id={categoryKey}
                      className="hidden peer"
                      onChange={handleSelectCategory}
                      checked={category.id === selectedCategory}
                    />
                    <label
                      htmlFor={categoryKey}
                      className="btn btn-ghost bg-white drop-shadow peer-checked:text-red-500 peer-checked:border-red-500"
                    >
                      {category.text}
                    </label>
                  </div>
                );
              })}
            </section>
            <div className="hidden lg:block h-12 w-0.5 bg-gray-200"></div>
            <section className="md:flex md:justify-between lg:justify-end lg:gap-4 items-center mt-2 md:mb-0 lg:mt-0 max-w-3xl">
              <section className="flex flex-wrap md:flex-nowrap gap-2 items-center mt-7 mb-7 md:mt-0 md:mb-0">
                {sortingFactors.map((factor) => {
                  return (
                    <div key={factor.id}>
                      <input
                        type="radio"
                        name="sortBy"
                        id={factor.id}
                        className="hidden peer"
                        onChange={handleSelectSortingFactor}
                        checked={factor.id === selectedSortingFactor}
                      />
                      <label
                        htmlFor={factor.id}
                        className="btn btn-ghost bg-white drop-shadow btn-sm h-10 lg:w-28 w-[104px] peer-checked:text-emerald-500 peer-checked:border-emerald-500"
                      >
                        {factor.text}
                      </label>
                    </div>
                  );
                })}
              </section>
              <section style={{ width: `${248}px` }}>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold">가격 범위</p>
                  <p className="text-xs font-bold text-red-500">
                    {renderCurrentPriceRange()}
                  </p>
                </div>
                <Range
                  width={RANGE_WIDTH}
                  steps={STEPS}
                  onRangeValueChange={handleRangeValueChange}
                />
                <div className="text-xs font-bold text-gray-400 flex justify-between">
                  <p>{`${MIN_PRICE}만원`}</p>
                  <p>{`${MAX_PRICE}만원`}</p>
                </div>
              </section>
            </section>
          </section>
          <div className="mt-4 flex lg:justify-end">
            <button
              type="button"
              className="btn bg-red-500 text-white drop-shadow btn-sm h-10 w-24 hover:bg-red-600"
              onClick={handleSearchButtonClick}
            >
              검색하기
            </button>
          </div>
        </section>
      )}
      <section className={viewType !== View.MAP ? 'mt-10' : ''}>
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">
            {isLoading ? (
              <span className="loading loading-dots loading-md"></span>
            ) : !totalElements && !isDataEnd ? (
              <span className="loading loading-dots loading-md"></span>
            ) : (
              `${totalElements}개의 검색 결과`
            )}
          </h3>
          <button
            className="btn btn-ghost bg-white drop-shadow text-xs px-8 h-10 min-h-full"
            onClick={handleViewToggle}
          >
            {!viewType ? '지도로 보기' : '목록으로 보기'}
          </button>
        </div>
        <hr className="mt-2 mb-8" />
        {!isLoading && !totalElements && isDataEnd ? (
          <p className="text-center p-4">검색 결과가 없습니다.</p>
        ) : viewType === View.MAP ? (
          <div>
            {!isLoading && (
              <MapView
                searchData={accommodationList}
                param={{
                  people: parseInt(searchParams.current.people),
                  checkindate: searchParams.current.checkindate,
                  checkoutdate: searchParams.current.checkoutdate
                }}
              />
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 auto-rows-fr gap-4 md:grid-cols-2">
            {accommodationList?.map((accommodation) => {
              return (
                <Link
                  key={String(accommodation.id) + String(new Date())}
                  to={`/accommodation/${accommodation.id}?checkindate=${searchParams.current.checkindate}&checkoutdate=${searchParams.current.checkoutdate}&people=${searchParams.current.people}`}
                >
                  <AccommodationPreview data={accommodation} />
                </Link>
              );
            })}
          </div>
        )}
      </section>
      <div
        ref={observerTarget}
        className="w-full justify-center items-center h-60"
      >
        <p className="loading loading-spinner loading-lg"></p>
      </div>
      <FloatingIcon />
      <AlertModal
        content="최대 3개의 상품만 담을 수 있습니다."
        modalState={modalState}
        handleModal={setModalState}
      />
    </div>
  );
};
export default SearchResult;
