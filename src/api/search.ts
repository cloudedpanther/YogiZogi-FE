import { fetchData } from '.';

export interface ISearchParams {
  [key: string]: string | undefined;
  keyword: string;
  checkindate: string;
  checkoutdate: string;
  people: string;
  lat: string;
  lon: string;
  sort: string;
  direction: string;
  minprice?: string;
  maxprice?: string;
  category: string;
  page: string;
}

interface IStaticSearchParams {
  readonly keyword: string;
  readonly checkindate: string;
  readonly checkoutdate: string;
  readonly people: string;
  readonly lat: string;
  readonly lon: string;
  readonly sort: string;
  readonly direction: string;
}

interface IDynamicSearchParams {
  readonly minprice?: string;
  readonly maxprice?: string;
  readonly category: string;
  readonly page: string;
}

export interface ISearchResultContent {
  id: number;
  accommodationName: string;
  address: string;
  rate: number;
  price: number;
  lat: number;
  lon: number;
  category: number;
  picUrl: string;
  info: string;
}

interface ISearchResultResponse {
  data: {
    code: string;
    status: string;
    msg: string;
    data: {
      msg: string;
      content: ISearchResultContent[];
      totalElements: number;
    };
  };
}

export const SEARCH_RESULT_PAGE_SIZE = 20;

const SEARCH_URL = '/accommodation/search?';

const getStaticQueryString = ({
  keyword,
  checkindate,
  checkoutdate,
  people,
  lat,
  lon,
  sort,
  direction
}: IStaticSearchParams) => {
  const params = [
    {
      name: 'keyword',
      value: keyword
    },
    {
      name: 'checkindate',
      value: checkindate
    },
    {
      name: 'checkoutdate',
      value: checkoutdate
    },
    {
      name: 'people',
      value: people
    },
    {
      name: 'lat',
      value: lat
    },
    {
      name: 'lon',
      value: lon
    },
    {
      name: 'sort',
      value: sort
    },
    {
      name: 'direction',
      value: direction
    }
  ];

  const queryString = params
    .map((param) => `&${param.name}=${param.value}`)
    .join('');

  return queryString;
};

const getDynamicQueryString = ({
  minprice,
  maxprice,
  category
}: IDynamicSearchParams) => {
  const INFINITE_PRICE = 999999999;
  const params = [
    {
      name: 'minprice',
      value: maxprice !== undefined && minprice === undefined ? 0 : minprice
    },
    {
      name: 'maxprice',
      value:
        minprice !== undefined && maxprice === undefined
          ? INFINITE_PRICE
          : maxprice
    },
    {
      name: 'category',
      value: category === '0' ? undefined : category
    }
  ];

  const queryString = params
    .map((param) =>
      param.value === undefined ? '' : `&${param.name}=${param.value}`
    )
    .join('');

  return queryString;
};

export const getDetailedSearchResult = async (searchParams: ISearchParams) => {
  const {
    keyword,
    checkindate,
    checkoutdate,
    people,
    lat,
    lon,
    sort,
    direction,
    minprice,
    maxprice,
    category,
    page
  } = searchParams;

  const staticParams = {
    keyword,
    checkindate,
    checkoutdate,
    people,
    lat,
    lon,
    sort,
    direction
  };

  const dynamicParams = {
    minprice,
    maxprice,
    category,
    page
  };

  const url = `${SEARCH_URL}${getStaticQueryString(
    staticParams
  )}${getDynamicQueryString(
    dynamicParams
  )}&page=${page}&pageSize=${SEARCH_RESULT_PAGE_SIZE}`;

  const res = await fetchData.get<ISearchResultResponse>(url);

  if (!res) {
    const emptyData = {
      content: [],
      totalElements: 0
    };

    return emptyData;
  }

  const data = {
    content: res.data.data.content,
    totalElements: res.data.data.totalElements
  };

  return data;
};
