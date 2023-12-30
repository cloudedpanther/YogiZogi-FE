import {
  Direction,
  MAX_PRICE,
  MIN_PRICE,
  Sort
} from '../components/searchResult/constants';

export const getMinPrice = (param: string) => {
  const minVal = Number(param);
  if (minVal === MIN_PRICE) return undefined;

  return String(minVal * 10000);
};

export const getMaxPrice = (param: string) => {
  const maxVal = Number(param);
  if (maxVal === MAX_PRICE) return undefined;

  return String(maxVal * 10000);
};

export const getSort = (param: string) => {
  if (param === Sort.LOWPRICE) return 'price';
  if (param === Sort.HIGHPRICE) return 'price';
  return param;
};

export const getDirection = (sortParam: string) => {
  if (sortParam === Sort.LOWPRICE) return Direction.ASC;
  return Direction.DESC;
};
