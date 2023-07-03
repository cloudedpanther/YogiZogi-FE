import axios from 'axios';
import { describe, expectTypeOf, it } from 'vitest';

describe('MSW Fetch Test: ', () => {
  it('login', async () => {
    const result = {
      'X-AUTH-TOKEN':
        'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3YnMwOTZAZGF1bS5uZXRfMjgyMTI2NzgwMSIsImlzcyI6Ii7sgq3soJwuIzI4MjEyNjc4MDEiLCJqdGkiOiIxNiIsImlhdCI6MTY4NzI2MDY1MiwiZXhwIjoxNjg3MzQ3MDUyfQ.m8O-2imqlYu6UJ-lny4MdncvLka8R5r0U2soq23G3qo'
    };
    const {
      data: { data }
    } = await axios({
      method: 'post',
      url: '/api/user/login',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        email: 'test@test',
        password: '12345678'
      }
    });

    expectTypeOf(data.token).toBeObject();
    expect(data['X-AUTH-TOKEN']).toBe(result['X-AUTH-TOKEN']);
  });

  it('registered list', async () => {
    const result = [
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
    ];

    const {
      data: { data }
    } = await axios('/api/user/1/mybook');

    expectTypeOf(data).toBeArray();
    for (let i = 0; i < result.length; i++) {
      expect(data[i]).toEqual(result[i]);
    }
  });

  it('accommodation detail', async () => {
    const result = {
      id: 1,
      accommodationName: '역삼 인트로호텔',
      category: 1,
      rate: 9.9,
      address: '서울 강남구 역삼동 678-9',
      region: '강남구 역삼동',
      picUrl:
        '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg',
      lat: 37.50252991,
      lon: 127.0382753,
      info: '<article class="detail_info">\n<!-- 기본 정보 -->\n<h3 class="category" id="default_info_tab" type="h3"><span>기본 정보</span></h3>\n<section class="default_info">\n<!-- 사장님 한마디 & 추천이유 -->\n<div class="comment_mobile">\n<h3>사장님 한마디</h3>\n                    * 골드글라스/브론즈글',
      picUrlList: [
        {
          id: 96,
          url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
        },
        {
          id: 72,
          url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
        },
        {
          id: 45,
          url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
        },
        {
          id: 129,
          url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
        },
        {
          id: 68,
          url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
        },
        {
          id: 74,
          url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
        },
        {
          id: 12,
          url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
        }
      ],
      rooms: [
        {
          id: 1,
          roomName: '랜덤객실',
          checkInTime: '23',
          cheekOutTime: '12',
          defaultPeople: 2,
          maxPeople: 2,
          pictureUrlList: [
            {
              id: 7,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 3,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 1,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            }
          ],
          price: 280000
        },
        {
          id: 2,
          roomName: '로이',
          checkInTime: '23',
          cheekOutTime: '12',
          defaultPeople: 2,
          maxPeople: 2,
          pictureUrlList: [
            {
              id: 11,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 15,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 10,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            }
          ],
          price: 280000
        },
        {
          id: 3,
          roomName: '샴페인골드',
          checkInTime: '23',
          cheekOutTime: '12',
          defaultPeople: 2,
          maxPeople: 2,
          pictureUrlList: [
            {
              id: 22,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 20,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 24,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            }
          ],
          price: 280000
        },
        {
          id: 4,
          roomName: '미스트',
          checkInTime: '23',
          cheekOutTime: '12',
          defaultPeople: 2,
          maxPeople: 2,
          pictureUrlList: [
            {
              id: 31,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 30,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 35,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            }
          ],
          price: 280000
        },
        {
          id: 5,
          roomName: '에메랄드',
          checkInTime: '23',
          cheekOutTime: '12',
          defaultPeople: 2,
          maxPeople: 2,
          pictureUrlList: [
            {
              id: 48,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 47,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 44,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            }
          ],
          price: 280000
        },
        {
          id: 6,
          roomName: '아쿠아',
          checkInTime: '23',
          cheekOutTime: '12',
          defaultPeople: 2,
          maxPeople: 2,
          pictureUrlList: [
            {
              id: 59,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 60,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 57,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            }
          ],
          price: 280000
        },
        {
          id: 7,
          roomName: '다이아골드',
          checkInTime: '23',
          cheekOutTime: '12',
          defaultPeople: 2,
          maxPeople: 2,
          pictureUrlList: [
            {
              id: 66,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 68,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 69,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            }
          ],
          price: 350000
        },
        {
          id: 8,
          roomName: '비앙코',
          checkInTime: '23',
          cheekOutTime: '12',
          defaultPeople: 2,
          maxPeople: 2,
          pictureUrlList: [
            {
              id: 73,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 75,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 74,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            }
          ],
          price: 350000
        },
        {
          id: 9,
          roomName: '브론즈글라스',
          checkInTime: '23',
          cheekOutTime: '12',
          defaultPeople: 2,
          maxPeople: 2,
          pictureUrlList: [
            {
              id: 83,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 87,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 85,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            }
          ],
          price: 490000
        },
        {
          id: 10,
          roomName: '골드글라스',
          checkInTime: '23',
          cheekOutTime: '12',
          defaultPeople: 2,
          maxPeople: 2,
          pictureUrlList: [
            {
              id: 94,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 95,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            },
            {
              id: 93,
              url: '//image.goodchoice.kr/resize_370x220/adimg_new/49914/329560/874943ee5c604e46a4f529d8ecc1558d.jpg'
            }
          ],
          price: 30000
        }
      ]
    };

    const {
      data: { data }
    } = await axios('/api/accommodation/1');

    expectTypeOf(data).toBeArray();
    expectTypeOf(data[1]).toBeObject();
  });

  it('review list', async () => {
    const result = [
      {
        id: 20,
        userId: 16,
        accommodationId: 1,
        rating: 10,
        description: '별점 준 이유'
      },
      {
        id: 19,
        userId: 17,
        sellerId: null,
        accommodationId: 1,
        rating: 8,
        description: '별점 준 이유'
      },
      {
        id: 18,
        userId: 18,
        sellerId: null,
        accommodationId: 1,
        rating: 7,
        description: '별점 준 이유'
      }
    ];

    const {
      data: { content }
    } = await axios('/api/accommodation/1/review?page=1&pagesize=3');

    expectTypeOf(content).toBeArray();
    for (let i = 0; i < result.length; i++) {
      expectTypeOf(content[i]).toBeObject();
      expect(content[i]).toEqual(result[i]);
    }
  });
});
