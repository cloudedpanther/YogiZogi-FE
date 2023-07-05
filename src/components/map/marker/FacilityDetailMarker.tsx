import { ISearchResultContent } from 'api/search';
import { addCommasToPrice } from '../../../helpers';

interface FacilityDetailMarkerProps {
  info: ISearchResultContent;
  handleOnClick: () => void;
}

const FacilityDetailMarker = ({
  info,
  handleOnClick
}: FacilityDetailMarkerProps) => {
  return (
    <div
      className="cursor-pointer absolute bottom-full mb-2 w-72 h-72 rounded-2xl drop-shadow-md bg-white z-50 max-sm:hidden"
      onClick={handleOnClick}
    >
      <div className="w-72 h-72 rounded-2xl overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={info.picUrl}
          alt={`${info.accommodationName} image`}
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 rounded-2xl bg-black opacity-30"></div>
      </div>
      <div className="absolute bottom-0 p-4 w-full text-white">
        <div className="flex justify-between">
          <h1 className="flex-1 font-medium text-lg">
            {info.accommodationName}
          </h1>
          <span className="flex items-center text-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="orange"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="orange"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
            {info.rate}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-sm truncate">{info.address}</span>
          <span className="font-normal text-sm">{addCommasToPrice(info.price)}원</span>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetailMarker;
