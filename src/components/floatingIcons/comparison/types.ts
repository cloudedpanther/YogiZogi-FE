export interface IFacility {
  facility: string;
}

export interface IComparisonBoxProps {
  accommodationName: string;
  accommodationId: string;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  price: number;
  imgUrl: string;
  people: string;
}

export interface IComparisonItem {
  accommodationName: string;
  roomName: string;
  address: string;
  convenience: string;
  id: number;
  picUrl: string;
  price: number;
  rate: number;
}

export interface IComparisonFactor {
  itemPrices: number[];
  minPrice: number;
  highRate: number;
}
