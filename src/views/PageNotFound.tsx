const PageNotFound = () => {
  return (
    <div className="h-[calc(100vh-144px)] md:h-[calc(100vh-112px)] max-w-[1024px] m-auto flex flex-col items-center justify-center gap-2">
      <figure className="p-5"><img src="/assets/images/404.png" alt="404 error image" /></figure>
      <h2 className="text-5xl sm:text-9xl font-extrabold text-">404</h2>
      <p className="text-xl sm:text-3xl font-semibold">페이지를 찾을 수 없습니다.</p>
      <p>페이지가 존재하지 않거나 에러가 발생했습니다.</p> <p>Home으로 이동하세요.</p>
      <button className="btn bg-red-500 hover:bg-red-600 text-md sm:text-xl text-white">홈으로 가기</button>
    </div>
  );
};

export default PageNotFound;
