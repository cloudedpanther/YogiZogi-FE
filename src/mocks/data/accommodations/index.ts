import { accommodationNameList } from './accommodationName';
import { picUrlList } from './picUrl';
import { addressList } from './address';
import { rateList } from './rate';
import { priceList } from './price';
import { latList } from './lat';
import { lonList } from './lon';
import { categoryList } from './category';
import { peopleMaxList } from './peopleMax';
import { infoList } from './info';
import { convenienceList } from './convenience';
import { IPicUrlList, IRoomData, getRoomData } from '../rooms';

interface IAccommodationData {
  id: number;
  accommodationName: string;
  picUrl: string;
  address: string;
  rate: number;
  price: number;
  lat: number;
  lon: number;
  category: number;
  peopleMax: number;
  // info: string;
}

interface IAccommodationDetailData {
  id: number;
  accommodationName: string;
  category: number;
  rate: number;
  address: string;
  region: string;
  picUrlList: IPicUrlList[];
  convenienceList: {}[];
  info: string;
  lat: number;
  lon: number;
  rooms: IRoomData[];
}

export const getAccommodationData = (dateTerm: number) =>
  Array.from({ length: 31 }, (_, index) => {
    const data: IAccommodationData = {
      id: index,
      accommodationName: accommodationNameList[index],
      picUrl: picUrlList[index][0]['url'],
      address: addressList[index],
      rate: rateList[index],
      price: priceList[index] * dateTerm,
      lat: latList[index],
      lon: lonList[index],
      category: categoryList[index],
      peopleMax: peopleMaxList[index]
      // info: infoList[index]
    };
    return data;
  });

export const getAccommodationDetailData = (dateTerm: number) => {
  return Array.from({ length: 31 }, (_, index) => {
    const data: IAccommodationDetailData = {
      id: index,
      accommodationName: accommodationNameList[index],
      category: categoryList[index],
      rate: rateList[index],
      address: addressList[index],
      region: '',
      picUrlList: picUrlList[index],
      convenienceList: convenienceList[index],
      info: infoList[index],
      lat: latList[index],
      lon: lonList[index],
      rooms: getRoomData(index, dateTerm)
    };
    return data;
  });
};
