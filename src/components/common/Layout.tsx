import { useEffect } from 'react';
import Footer from './Footer';
import Nav from './Nav';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
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
