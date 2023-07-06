import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useModal from '../hooks/useModal';
import { Navigate, Outlet } from 'react-router-dom';

const AuthRoute = () => {
  const { authUser } = useAuth();
  const { openModal } = useModal();

  useEffect(() => {
    if (!authUser.isLoggedIn) {
      openModal({ content: '로그인이 필요한 페이지입니다.' });
    }
  }, [authUser.isLoggedIn, openModal]);

  if (!authUser.isLoggedIn) {
    return <Navigate to={'/signIn'} />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthRoute;
