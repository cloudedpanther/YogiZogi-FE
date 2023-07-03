import { rest } from 'msw';
import { accommodationData } from './api/data/accommodationData';
import { accommodationDetailData } from './api/data/accommodationDetailData';
import { reviewData } from './api/data/reviewData';
import { Category } from '../components/searchResult/constants';

let reviewIdCount = 100;

export const handlers = [
  // 회원가입
  rest.post('/api/user/sign-up', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        code: 'RESPONSE_SUCCESS',
        status: 'OK',
        msg: 'SUCCESS',
        data: {
          msg: '회원 가입에 성공했습니다.'
        }
      })
    );
  }),

  // 로그인
  rest.post('/api/user/login', async (req, res, ctx) => {
    const { email } = await req.json();

    return res(
      ctx.status(200),
      ctx.json({
        code: 'RESPONSE_SUCCESS',
        status: 'OK',
        msg: 'SUCCESS',
        data: {
          'X-AUTH-TOKEN':
            'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3YnMwOTZAZGF1bS5uZXRfMjgyMTI2NzgwMSIsImlzcyI6Ii7sgq3soJwuIzI4MjEyNjc4MDEiLCJqdGkiOiIxNiIsImlhdCI6MTY4NzI2MDY1MiwiZXhwIjoxNjg3MzQ3MDUyfQ.m8O-2imqlYu6UJ-lny4MdncvLka8R5r0U2soq23G3qo'
        }
      })
    );
  }),

  // 로그아웃
  rest.get('/api/user/logout', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 'RESPONSE_SUCCESS',
        status: 'OK',
        msg: 'SUCCESS',
        data: null
      })
    );
  }),

  rest.delete('/api/user/:userId/mybook/:bookId', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        code: 'RESPONSE_SUCCESS',
        status: 'OK',
        msg: 'SUCCESS',
        data: {
          msg: '성공적으로 작업을 수행 했습니다.'
        }
      })
    );
  }),

  // 예약 목록 확인
  rest.get('/api/user/:userId/mybook', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 'RESPONSE_SUCCESS',
        status: 'OK',
        msg: 'SUCCESS',
        data: [
          {
            id: 7,
            userId: 3,
            accommodationId: 1,
            bookName: '홍길동',
            accommodationName: 'ACB 호텔',
            picUrl:
              'https://image.goodchoice.kr/resize_1000X500x0/affiliate/2020/03/24/5e799e9748723.jpg',
            checkInDate: '2023-06-13',
            checkOutDate: '2023-06-15',
            price: 180000,
            rate: 8.7,
            reviewRegistered: true
          },
          {
            id: 5,
            userId: 3,
            accommodationId: 1,
            bookName: '홍길동',
            accommodationName: 'ABC 호텔',
            picUrl:
              'https://image.goodchoice.kr/resize_1000X500x0/affiliate/2020/03/24/5e799e9748723.jpg',
            checkInDate: '2023-06-01',
            checkOutDate: '2023-06-02',
            price: 100000,
            rate: 8.6,
            reviewRegistered: false
          },
          {
            id: 3,
            userId: 3,
            accommodationId: 1,
            bookName: '홍길동',
            accommodationName: 'BAC 호텔',
            picUrl:
              'https://image.goodchoice.kr/resize_1000X500x0/affiliate/2020/03/24/5e799e9748723.jpg',
            checkInDate: '2023-07-01',
            checkOutDate: '2023-07-04',
            price: 20000,
            rate: 9.3,
            reviewRegistered: false
          }
        ]
      })
    );
  }),

  // 숙소 검색
  rest.get('/api/accommodation/search', (req, res, ctx) => {
    const keyword = req.url.searchParams.get('keyword');
    const sort = req.url.searchParams.get('sort');
    const direction = req.url.searchParams.get('direction');
    const minprice = req.url.searchParams.get('minprice');
    const maxprice = req.url.searchParams.get('maxprice');
    const category = req.url.searchParams.get('category');
    const lat = req.url.searchParams.get('lat');
    const lon = req.url.searchParams.get('lon');
    const page = parseInt(req.url.searchParams.get('page') || '0');
    const pageSize = parseInt(req.url.searchParams.get('pageSize') || '0');

    if (keyword === null || !sort || !direction) {
      return;
    }

    const startIndex = pageSize * (page - 1);
    const endIndex = startIndex + pageSize;

    const calcDistance = (latD: number, lonD: number) => {
      return Math.sqrt(
        Math.pow(Number(lat) - latD, 2) + Math.pow(Number(lon) - lonD, 2)
      );
    };

    const filteredData = accommodationData
      .filter(
        (data) =>
          data.accommodationName.includes(keyword) ||
          data.address.includes(keyword)
      )
      .sort((d1, d2) => {
        if (sort === 'price' && d1.price && d2.price) {
          if (direction === 'asc') {
            return d1.price - d2.price;
          }

          return d2.price - d1.price;
        }

        if (sort === 'distance') {
          return calcDistance(d1.lat, d1.lon) - calcDistance(d2.lat, d2.lon);
        }

        return d2.rate - d1.rate;
      })
      .filter((data) => {
        if (!minprice) return true;
        if (data.price) return Number(minprice) <= data.price;
      })
      .filter((data) => {
        if (!maxprice) return true;

        if (data.price) return data.price <= Number(maxprice);
      })
      .map((data) => {
        return {
          ...data,
          picUrl: data.picUrl
        };
      });

    const pagedData = filteredData.slice(startIndex, endIndex);

    return res(
      ctx.status(200),
      ctx.json({
        code: 'RESPONSE_SUCCESS',
        status: 'OK',
        msg: 'SUCCESS',
        data: {
          msg: '성공적으로 작업을 수행 했습니다.'
        },
        content: pagedData,
        pageable: {
          sort: {
            empty: false,
            sorted: true,
            unsorted: false
          },
          offset: 0,
          pageNumber: page,
          pageSize: pageSize,
          paged: true,
          unpaged: false
        },
        totalElements: filteredData.length,
        totalPages: Math.ceil(accommodationData.length / pageSize),
        last: true,
        size: pageSize,
        number: 0,
        sort: {
          empty: false,
          sorted: true,
          unsorted: false
        },
        numberOfElements:
          endIndex <= accommodationData.length
            ? pageSize
            : accommodationData.length - endIndex,
        first: true,
        empty: false
      })
    );
  }),

  // 숙소 예약
  rest.post('api/accommodation/:accommodationId/book', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        code: 'RESPONSE_SUCCESS',
        status: 'OK',
        msg: 'SUCCESS',
        data: {
          msg: '예약 및 결제가 성공적으로 이루어졌습니다.'
        }
      })
    );
  }),

  // 숙소 리뷰 등록
  rest.post(
    'api/accommodation/:accommodationId/review',
    async (req, res, ctx) => {
      const { accommodationId, rating, description } = await req.json();

      const userId = 99;

      const newData = {
        id: reviewIdCount++,
        userId,
        accommodationId,
        rating,
        description
      };

      reviewData.push(newData);

      return res(
        ctx.status(201),
        ctx.json({
          code: 'RESPONSE_SUCCESS',
          status: 'OK',
          msg: 'SUCCESS',
          data: {
            msg: '성공적으로 리뷰를 작성 했습니다.'
          }
        })
      );
    }
  ),

  // 숙소 리뷰 목록 확인
  rest.get('/api/accommodation/:accommodationId/review', (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get('page') || '0');
    const pageSize = parseInt(req.url.searchParams.get('pagesize') || '0');

    const startIndex = pageSize * (page - 1);
    const endIndex = startIndex + pageSize;

    return res(
      ctx.status(200),
      ctx.json({
        code: 'RESPONSE_SUCCESS',
        status: 'OK',
        msg: 'SUCCESS',
        data: {
          msg: '성공적으로 작업을 수행 했습니다.'
        },
        content: reviewData.slice(startIndex, endIndex),
        pageable: {
          sort: {
            empty: false,
            sorted: true,
            unsorted: false
          },
          offset: 0,
          pageNumber: page,
          pageSize: pageSize,
          paged: true,
          unpaged: false
        },
        totalElements: reviewData.length,
        totalPages: Math.ceil(reviewData.length / pageSize),
        last: true,
        size: pageSize,
        number: 0,
        sort: {
          empty: false,
          sorted: true,
          unsorted: false
        },
        numberOfElements:
          endIndex <= reviewData.length
            ? pageSize
            : reviewData.length - endIndex,
        first: true,
        empty: false
      })
    );
  }),

  // 숙소 리뷰 수정: 구현 미정

  // 숙소 리뷰 삭제: 구현 미정

  // 숙소 상세
  rest.get('/api/accommodation/:accommodationId', (req, res, ctx) => {
    const { accommodationId } = req.params;

    const checkindate = req.url.searchParams.get('checkindate');
    const checkoutdate = req.url.searchParams.get('checkoutdate');
    const people = req.url.searchParams.get('people');
    const data = accommodationDetailData.find(
      (data) => data.id == Number(accommodationId)
    );

    if (!data) {
      return res(
        ctx.status(403),
        ctx.json({
          code: 'ACCOMMODATION_NOT_FOUND',
          status: 'BAD_REQUEST',
          msg: '존재하지 않는 숙소입니다.',
          data: null
        })
      );
    }

    const {
      id,
      accommodationName,
      category,
      rate,
      address,
      region,
      lat,
      lon,
      info,
      picUrlList,
      rooms
    } = data;

    return res(
      ctx.status(200),
      ctx.json({
        code: 'RESPONSE_SUCCESS',
        status: 'OK',
        msg: 'SUCCESS',
        data: [
          {
            msg: '성공적으로 작업을 수행 했습니다.'
          },
          {
            id,
            accommodationName,
            category,
            rate,
            address,
            region,
            lat,
            lon,
            info,
            picUrlList,
            rooms
          }
        ]
      })
    );
  })
];
