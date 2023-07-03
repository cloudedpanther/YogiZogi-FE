import LocalMap from './LocalMap';
import { PositionProps } from '../../api/map';
import useLocalMap from '../../hooks/useLocalMap';
import useModal from '../../hooks/useModal';
import MapModal from './MapModal';

interface LocalMapViewProp {
  address: string;
  position: PositionProps;
}

const LocalMapView = ({ address, position }: LocalMapViewProp) => {
  const { openModal } = useModal();
  const { localData, localCategory } = useLocalMap(position);

  return (
    <>
      <article className="flex md:flex-col max-sm:flex-col gap-2 sm:gap-5 rounded-lg overflow-hidden min-w-[16rem]">
        <div
          className="cursor-pointer w-64 max-sm:w-full h-64 max-sm:h-48 min-w-[16rem] rounded-lg overflow-hidden"
          onClick={() =>
            openModal({ content: <MapModal position={position} /> })
          }
        >
          <LocalMap position={position} localData={localData} type="mini" />
        </div>
        <div className="flex flex-col gap-2 lg:justify-center px-2">
          <div className="line-clamp-1">
            <img
              src="./assets/icons/location.svg"
              alt="destination icon"
              className="inline-flex items-center h-6 w-6 pb-1"
            />
            {address}
          </div>

          {localCategory.map((item) => (
            <p key={item.title} className="font-normal line-clamp-2">
              <span className="font-semibold">{item.title}: </span>
              숙소 5분 거리로 {item.title}이 있어 편리
            </p>
          ))}
        </div>
      </article>
    </>
  );
};

export default LocalMapView;
