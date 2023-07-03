export interface IFacility {
  facility: string;
}

export interface IComparisonBoxProps {
  accommodationName: string;
  accommodationId: string;
  roomId: number;
  price: number;
  imgUrl: string;
}

export interface IComparisonItem {
  accommodationId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  people: string;
}

export interface IComparisonResponse {
  id: number;
  accommodationName: string;
  roomName: string;
  rate: number;
  address: string;
  convenience: string;
  picUrl: string;
  price: number;
  accommodationId: string;
  checkInDate: string;
  checkOutDate: string;
  people: string;
}

export interface IFetchDataForChart {
  accommodationName: string;
  address: string
  convenience: string
  id: number;
  picUrl: string
  price: number;
  rate: number;
}