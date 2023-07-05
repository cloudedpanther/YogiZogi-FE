import { SearchBar } from '../components/searchBar/SearchBar';

const Main = () => {
  return (
    <div
      className="bg-no-repeat bg-cover"
      style={{
        backgroundImage:
          'url(/assets/images/main.png)'
      }}
    >
      <div className="h-[calc(100vh-144px)] md:h-[calc(100vh-112px)] max-w-[1024px] m-auto flex flex-col justify-center">
        <h1 className="mb-5 text-5xl sm:6xl md:text-8xl md:mb-16 font-semibold text-center">
          YogiZogi
        </h1>
        <div className="p-3">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};
export default Main;
