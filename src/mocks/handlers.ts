import { rest } from 'msw';
import {
  getAccommodationData,
  getAccommodationDetailData
} from './data/accommodations';
import { createJWTToken, getDateTerm, toHaversine } from './helps';
import { DEFAULT_REVIEWS, IStoragedReviews } from './data/reviews';
import { TEST_USER_JSON } from './data/testUser';

interface IPostSignUpReqBody {
  id: string;
  email: string;
  nickname: string;
  password: string;
}

interface ILocalStorageUser extends IPostSignUpReqBody {}

interface IPostLoginReqBody {
  email: string;
  password: string;
}

interface IBookData {
  id: string;
  userId: string;
  accommodationId: string;
  bookName: string;
  accommodationName: string;
  picUrl: string;
  checkInDate: string;
  checkOutDate: string;
  price: number;
  roomId: string;
  rate: number;
  reviewRegistered: boolean;
}

export const handlers = [
  // 회원가입
  rest.post<IPostSignUpReqBody>('/api/user/sign-up', (req, res, ctx) => {
    const { email, nickname, password } = req.body;

    const users: ILocalStorageUser[] = JSON.parse(
      localStorage.getItem('users') || TEST_USER_JSON
    );

    const emailExist = users.find((user) => user.email === email) !== undefined;
    if (emailExist) {
      return res(
        ctx.status(400),
        ctx.json({
          code: 'ALREADY_REGISTERED_EMAIL',
          status: 'BAD_REQUEST',
          msg: '이미 회원 가입을 완료한 유저입니다.',
          data: null
        })
      );
    }

    const nicknameExist =
      users.find((user) => user.nickname === nickname) !== undefined;
    if (nicknameExist) {
      return res(
        ctx.status(400),
        ctx.json({
          code: 'ALREADY_REGISTERED_NICKNAME',
          status: 'BAD_REQUEST',
          msg: '이미 등록된 닉네임입니다.',
          data: null
        })
      );
    }

    const newUsers = [
      ...users,
      { email, nickname, password, id: String(Date.now()) }
    ];
    localStorage.setItem('users', JSON.stringify(newUsers));

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
  rest.post<IPostLoginReqBody>('/api/user/login', async (req, res, ctx) => {
    const { email, password } = req.body;

    const users: ILocalStorageUser[] = JSON.parse(
      localStorage.getItem('users') || TEST_USER_JSON
    );

    const userNotFound =
      users.find((user) => user.email === email) === undefined;
    if (userNotFound) {
      return res(
        ctx.status(400),
        ctx.json({
          code: 'NOT_FOUND_USER',
          status: 'BAD_REQUEST',
          msg: '존재하지 않는 유저입니다.',
          data: null
        })
      );
    }

    const pwNotMatch =
      users.find((user) => user.email === email)?.password !== password;
    if (pwNotMatch) {
      return res(
        ctx.status(400),
        ctx.json({
          code: 'NOT_MATCH_ID_PASSWORD',
          status: 'BAD_REQUEST',
          msg: '비밀번호가 일치하지 않습니다.',
          data: null
        })
      );
    }

    const { id, nickname } = users.find(
      (user) => user.email === email
    ) as ILocalStorageUser;

    const jwt = await createJWTToken(id, email, nickname);

    const loggedInUser = {
      id,
      nickname
    };

    sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

    return res(
      ctx.status(200),
      ctx.json({
        code: 'RESPONSE_SUCCESS',
        status: 'OK',
        msg: 'SUCCESS',
        data: {
          'X-AUTH-TOKEN': jwt
        }
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

    const checkInDate = req.url.searchParams.get('checkindate');
    const checkOutDate = req.url.searchParams.get('checkoutdate');

    if (keyword === null || !sort || !direction) {
      return;
    }

    const startIndex = pageSize * page;
    const endIndex = startIndex + pageSize;

    const dateTerm = getDateTerm(checkInDate || '', checkOutDate || '');

    const accommodationData = getAccommodationData(dateTerm);

    const processedData = accommodationData
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
          return (
            toHaversine(Number(lat), Number(lon), d1.lat, d1.lon) -
            toHaversine(Number(lat), Number(lon), d2.lat, d2.lon)
          );
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
      .filter((data) => {
        if (!category) return true;

        return data.category === parseInt(category);
      });

    const pagedData = processedData.slice(startIndex, endIndex);

    return res(
      ctx.status(200),
      ctx.json({
        code: 'RESPONSE_SUCCESS',
        status: 'OK',
        msg: 'SUCCESS',
        data: {
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
          totalElements: processedData.length,
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
        }
      })
    );
  }),

  // 숙소 상세
  rest.get('/api/accommodation/:accommodationId', (req, res, ctx) => {
    const { accommodationId } = req.params;

    const checkInDate = req.url.searchParams.get('checkindate');
    const checkOutDate = req.url.searchParams.get('checkoutdate');
    const people = req.url.searchParams.get('people');

    const dateTerm = getDateTerm(checkInDate || '', checkOutDate || '');

    const accommodationDetailData = getAccommodationDetailData(dateTerm);

    const data = accommodationDetailData.find(
      (data) => data.id === Number(accommodationId)
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

    const processedRoomsData = data.rooms.filter(
      (room) => Number(people) <= room.maxPeople
    );
    const processedData = { ...data, rooms: processedRoomsData };

    return res(
      ctx.status(200),
      ctx.json({
        code: 'RESPONSE_SUCCESS',
        status: 'OK',
        msg: 'SUCCESS',
        data: processedData
      })
    );
  }),

  // 숙소 리뷰 목록 확인
  rest.get('/api/accommodation/:accommodationId/review', (req, res, ctx) => {
    const { accommodationId } = req.params;

    const page = parseInt(req.url.searchParams.get('page') || '0');
    const pageSize = parseInt(req.url.searchParams.get('pagesize') || '0');
    const startIndex = pageSize * page;
    const endIndex = startIndex + pageSize;

    const defaultReviews = DEFAULT_REVIEWS.map((review) => {
      return { ...review, accommodationId };
    });

    const storageReviewData = JSON.parse(
      localStorage.getItem('reviews') || '{}'
    )[String(accommodationId)];

    const reviewData = !!storageReviewData
      ? [...storageReviewData, ...defaultReviews]
      : defaultReviews;

    return res(
      ctx.status(200),
      ctx.json({
        code: 'RESPONSE_SUCCESS',
        status: 'OK',
        msg: 'SUCCESS',
        data: {
          msg: '성공적으로 작업을 수행 했습니다.',
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
        }
      })
    );
  }),

  // 숙소 리뷰 등록
  rest.post(
    'api/accommodation/:accommodationId/review',
    async (req, res, ctx) => {
      const loggedInUser = sessionStorage.getItem('loggedInUser');

      if (!loggedInUser) return;

      const { nickname: nickName } = JSON.parse(loggedInUser);

      const { accommodationId } = req.params;
      const { rate: rating, description, bookId } = await req.json();

      const newReview = {
        id: new Date().getTime() + 'review0283',
        nickName,
        rating,
        description
      };

      const storagedReviews: IStoragedReviews = JSON.parse(
        localStorage.getItem('reviews') || '{}'
      );

      const currentAccommodationReviews =
        storagedReviews[String(accommodationId)] || [];

      const updatedReviews = {
        ...storagedReviews,
        [String(accommodationId)]: [...currentAccommodationReviews, newReview]
      };

      localStorage.setItem('reviews', JSON.stringify(updatedReviews));

      const books = JSON.parse(localStorage.getItem('books') || '[]');

      const updatedBooks = books.map((bookData: IBookData) => {
        if (bookData.id === bookId) {
          return { ...bookData, reviewRegistered: true };
        }
        return bookData;
      });

      localStorage.setItem('books', JSON.stringify(updatedBooks));

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

  // 숙소 예약
  rest.post(
    'api/accommodation/:accommodationId/book',
    async (req, res, ctx) => {
      const loggedInUser = sessionStorage.getItem('loggedInUser');

      if (!loggedInUser) return;

      const { id } = JSON.parse(loggedInUser);

      const {
        accommodationId,
        bookName,
        checkInDate,
        checkOutDate,
        payAmount,
        people,
        roomId
      } = await req.json();

      const dateTerm = getDateTerm(checkInDate || '', checkOutDate || '');

      const accommodationData = getAccommodationData(dateTerm).find(
        (data) => data.id === accommodationId
      );

      if (!accommodationData) return;

      const { accommodationName, picUrl } = accommodationData;

      const newBookData = {
        id: new Date().getTime() + 'rk11dudwns96',
        userId: id,
        accommodationId,
        bookName,
        accommodationName,
        picUrl,
        checkInDate,
        checkOutDate,
        price: parseInt(payAmount) * people,
        roomId,
        rate: 0,
        reviewRegistered: false
      };

      const books = JSON.parse(localStorage.getItem('books') || '[]');

      const newBooks = JSON.stringify([...books, newBookData]);

      localStorage.setItem('books', newBooks);

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
    }
  ),

  // 예약 목록 확인
  rest.get('/api/user/:userId/mybook', (req, res, ctx) => {
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    if (!loggedInUser) return;

    const { id } = JSON.parse(loggedInUser);

    const books = JSON.parse(localStorage.getItem('books') || '[]').filter(
      (data: IBookData) => data.userId === id
    );

    return res(
      ctx.status(200),
      ctx.json({
        code: 'RESPONSE_SUCCESS',
        status: 'OK',
        msg: 'SUCCESS',
        data: books
      })
    );
  }),

  // 예약 취소
  rest.delete('/api/user/:userId/mybook/:bookId', (req, res, ctx) => {
    const books = JSON.parse(localStorage.getItem('books') || '[]');

    console.log('original books: ', books);

    const { bookId } = req.params;

    const newBooks = books.filter((data: IBookData) => data.id !== bookId);

    console.log('new books: ', newBooks);

    localStorage.setItem('books', JSON.stringify(newBooks));

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
  })
];
