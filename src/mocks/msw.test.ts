import axios from 'axios';
import { describe, expect, expectTypeOf, it } from 'vitest';

describe('MSW Fetch Test: ', () => {
  it('sign up', async () => {
    const reqBodyExist = {
      email: 'test@test.com',
      nickname: 'test',
      password: 'test1234'
    };

    const reqBodyNew = {
      email: 'newtest@test.com',
      nickname: 'newtest',
      password: 'test65433'
    };

    const goTest = async (data: {
      email: string;
      nickname: string;
      password: string;
    }) => {
      try {
        const res = await axios({
          method: 'post',
          url: '/api/user/sign-up',
          headers: {
            'Content-Type': 'application/json'
          },
          data
        });
        expect(res.status).toBe(201);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          expect(error.response?.status).toBe(400);
        }
      }
    };

    goTest(reqBodyExist);
    goTest(reqBodyNew);
  });
});
