import { useEffect, useRef } from 'react';
import Footer from './Footer';
import Nav from './Nav';
import { Location, useLocation } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const history = useRef<Location[]>([]);
  const location = useLocation();

  useEffect(() => {
    if (!history.current.length) {
      history.current.push(location);
      return;
    }

    const prev = [...history.current];
    const last = prev[prev.length - 1];

    history.current = [...prev, location];

    if (last.pathname === location.pathname) return;
    if (
      last.pathname.includes('accommodation') &&
      location.pathname.includes('searchResult')
    )
      return;

    scrollTo(0, 0);
  }, [location]);

  return (
    <div className="relative">
      <Nav />
      <main className="pt-16 pb-20 md:pb-12 min-h-screen">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
