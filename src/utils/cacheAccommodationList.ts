import { ISearchParams, ISearchResultContent } from '../api/search';

interface IAccCache {
  params: ISearchParams;
  totalElements: number;
  accommodationList: ISearchResultContent[];
}

const CACHE_KEY = 'ACC_CACHE_LIST';

export const saveAccCache = ({
  params,
  totalElements,
  accommodationList
}: IAccCache) => {
  const obj = { params, totalElements, accommodationList };
  const json = JSON.stringify(obj);

  sessionStorage.setItem(CACHE_KEY, json);
};

export const getAccCache = () => {
  const json = sessionStorage.getItem(CACHE_KEY);
  if (!json) return {} as IAccCache;

  return JSON.parse(json) as IAccCache;
};

export const isCached = (urlParams: ISearchParams) => {
  const json = sessionStorage.getItem(CACHE_KEY);
  if (!json) return false;

  const { params } = JSON.parse(json);

  const paramsLength = Object.keys(params).length;
  const urlParamsLength = Object.keys(urlParams).length;
  if (paramsLength !== urlParamsLength) return false;

  const isAllMatch = !Object.keys(params).find(
    (key) => urlParams[key] !== params[key]
  );

  return isAllMatch;
};
