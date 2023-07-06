import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { AUTH_TOKEN_KEY, LOGIN_MAINTAIN } from '../store/atom/authAtom';
import { authLoginState } from '../store/selector/authUserState';

const useAuth = () => {
  const [authUser, setAuthUser] = useRecoilState(authLoginState);

  const successLogin = useCallback((token: string) => {
    if (!!localStorage.getItem(LOGIN_MAINTAIN)) {
      setLocalStorage(token);
    } else {
      setSessionStorage(token);
    }
    setAuthUser({ ...authUser, isLoggedIn: true, token: token });
    localStorage.removeItem(LOGIN_MAINTAIN);
  }, []);

  /**
   * 로그아웃
   * storage token 삭제
   * authState 초기화
   */
  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthUser({ user: {}, isLoggedIn: false, token: '' });
  };

  /**
   * 로그인 유지시 localStorage 토큰 저장
   * @param token login token
   */
  const setLocalStorage = (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  };

  /**
   * 로그인시 sessionStorage 토큰 저장
   * @param token login token
   */
  const setSessionStorage = (token: string) => {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  };

  /**
   * token의 만료기간을 체크하여 로그아웃 및 리다이렉트
   */
  useEffect(() => {
    console.log(authUser);
    if (authUser.token) {
      if (!authUser.expiration) {
        handleLogout();
        location.href = '/';
      }
    }
  }, [authUser]);

  return { authUser, successLogin, handleLogout };
};

export default useAuth;
