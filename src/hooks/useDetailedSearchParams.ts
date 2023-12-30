import { useSearchParams } from 'react-router-dom';
import { useCallback, useRef } from 'react';
import { ISearchParams } from '../api/search';
import {
  getDirection,
  getMaxPrice,
  getMinPrice,
  getSort
} from '../utils/getProcessedFormData';

const useDetailedSearchParams = () => {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();

  const getParamsObject = useCallback(
    () => Object.fromEntries(urlSearchParams.entries()) as ISearchParams,
    []
  );

  const searchParams = useRef<ISearchParams>(getParamsObject());

  const setSearchParams = useCallback((formData: FormData, page: number) => {
    const category = String(formData.get('category'));
    const minprice = getMinPrice(String(formData.get('minPrice')));
    const maxprice = getMaxPrice(String(formData.get('maxPrice')));
    const sort = getSort(String(formData.get('sortBy')));
    const direction = getDirection(String(formData.get('sortBy')));

    const params = getParamsObject();

    const newParams = {
      ...params,
      category,
      sort,
      direction,
      page: String(page)
    };
    if (minprice !== undefined) newParams.minprice = minprice;
    if (maxprice !== undefined) newParams.maxprice = maxprice;

    setUrlSearchParams(() => {
      searchParams.current = newParams;
      return { ...newParams };
    });

    return newParams;
  }, []);

  return [searchParams.current, setSearchParams] as const;
};

export default useDetailedSearchParams;
