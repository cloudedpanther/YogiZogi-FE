import { ISearchResultContent, getDetailedSearchResult } from '../api/search';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';
import useDetailedSearchParams from './useDetailedSearchParams';
import {
  getAccCache,
  isCached,
  saveAccCache
} from '../utils/cacheAccommodationList';

const useDetailedSearch = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [accommodationList, setAccommodationList] = useState<
    ISearchResultContent[]
  >([]);

  const [searchParams, setSearchParams] = useDetailedSearchParams();

  const formRef = useRef<HTMLFormElement>(null);

  const updateSearchResult = useCallback(async () => {
    setIsLoading(true);

    if (isCached(searchParams)) {
      const {
        totalElements: newTotalElements,
        accommodationList: newAccommodationList
      } = getAccCache();

      setTotalElements(newTotalElements);
      setAccommodationList(newAccommodationList);
      setIsLoading(() => false);

      return;
    }

    const { totalElements: newTotalElements, content } =
      await getDetailedSearchResult(searchParams);

    setTotalElements(newTotalElements);
    setAccommodationList((prev) => {
      const newAccommodationList = [...prev, ...content];

      saveAccCache({
        params: searchParams,
        totalElements: newTotalElements,
        accommodationList: newAccommodationList
      });

      return newAccommodationList;
    });
    setIsLoading(false);
  }, [searchParams]);

  const [isCallbackRunning, setIsCallbackRunning] = useState(false);

  const { observe, unobserve, target, showTarget, hideTarget } =
    useIntersectionObserver(() => {
      setIsCallbackRunning(true);
    });

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);

    setSearchParams(formData, 0);

    unobserve();
    setTotalElements(0);
    setAccommodationList([]);
    showTarget();
  }, []);

  const goToNextPage = useCallback(() => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);

    setSearchParams(formData, parseInt(searchParams.page) + 1);
  }, [searchParams]);

  /* 
    ...
    ...
      🔽🔽🔽🔽🔽  Searching Cycle  🔽🔽🔽🔽🔽
    ...
    ...
  */

  useEffect(() => {
    // search params set =>
    updateSearchResult();
    // loading... => done
  }, [searchParams]);

  useEffect(() => {
    if (isLoading) return;
    // => loading done

    if (accommodationList.length === totalElements) {
      hideTarget();
      return;
    }

    observe();
    // observer ready
  }, [isLoading]);

  useEffect(() => {
    if (!isCallbackRunning) return;

    // observer intersecting... =>
    setIsCallbackRunning(false);
    goToNextPage();
    // search params set... => start loading
  }, [isCallbackRunning]);

  return {
    formRef,
    onSubmit,
    totalElements,
    accommodationList,
    isLoading,
    observerTarget: target
  };
};

export default useDetailedSearch;
