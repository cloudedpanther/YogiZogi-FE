import { atom } from 'recoil';

export const AUTH_TOKEN_KEY = 'authToken';
export const LOGIN_MAINTAIN = 'loginMaintain';

interface UserProps {
  id?: number;
  nickname?: string;
  email?: string;
}
interface AuthUserProps {
  user: UserProps;
  token: string | null;
  isLoggedIn: boolean;
  expiration?: boolean;
}

const initialize: AuthUserProps = {
  user: {},
  token:
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    sessionStorage.getItem(AUTH_TOKEN_KEY)
      ? String(
          localStorage.getItem(AUTH_TOKEN_KEY) ||
            sessionStorage.getItem(AUTH_TOKEN_KEY)
        )
      : null,
  isLoggedIn:
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    sessionStorage.getItem(AUTH_TOKEN_KEY)
      ? true
      : false
};

export const authUser = atom({
  key: 'authUser',
  default: initialize
});
