import React from 'react';

interface SignLayoutProps {
  children: React.ReactNode;
}

const SignLayout = ({ children }: SignLayoutProps) => {
  return (
    <div className="relative h-[calc(100vh-112px)] max-md:h-[calc(100vh-144px)] min-w-[375px] min-h-[600px]">
      <div className="h-full flex">
        <div className="relative flex-1" style={{ backgroundColor: '#00BB98' }}>
          <h1 className="absolute top-1/4 max-md:hidden pr-36 w-full text-end text-7xl max-md:text-5xl text-white font-bold max-lg:text-center max-lg:pr-0 max-md:z-50">
            YogiZogi
          </h1>
          <img
            className="absolute bottom-0 left-0"
            style={{ maxHeight: '50%' }}
            src="https://yogizogi-zerobase-2023.github.io/FE/assets/images/signin.png"
            alt="일러스트"
          />
        </div>
        <div className="relative max-md:absolute top-0 left-0 right-0 bottom-0 bg-white max-md:bg-inherit flex-1 ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SignLayout;
