import axios from 'axios';
import { AUTH_TOKEN_KEY } from '../store/atom/authAtom';

// export const BASE_URL = 'https://yogizogi.shop/api';
export const BASE_URL = '/api';

/**
 * 커스텀 axios 인스턴스 생성
 * token, baseUrl, header 공통 처리
 */
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-AUTH-TOKEN': localStorage.getItem(AUTH_TOKEN_KEY)
      ? localStorage.getItem(AUTH_TOKEN_KEY)
      : sessionStorage.getItem(AUTH_TOKEN_KEY)
  }
});

export const fetchData = {
  get: async <T>(url: string) => {
    const res: T = await axiosInstance(url);
    return res;
  },

  post: async <T>(url: string, data: T) => {
    const res = await axiosInstance({
      method: 'post',
      url: url,
      data
    });
    return res;
  },

  delete: async (url: string) => {
    const res = await axiosInstance({
      method: 'delete',
      url: url
    });
    return res;
  }
};
