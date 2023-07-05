import { MdOutlineBedroomParent } from 'react-icons/md';
import { BsBuilding } from 'react-icons/bs';
import { useRef, useState } from 'react';
import { ComparisonBox } from './comparison/ComparisonBox';
import { useRecoilValue } from 'recoil';
import {
  selectedAccommodation,
  selectedRoom
} from '../../store/atom/comparisonAtom';
import { useClickOutside } from '../../hooks/useClickOutside';

export const FloatingIcon = () => {
  const selectedAcc = useRecoilValue(selectedAccommodation);
  const selectedRooms = useRecoilValue(selectedRoom);
  const [comparisonState, setComparisonState] = useState(false);
  const [source, setSource] = useState('');

  const floatingIconsRef = useRef<HTMLDivElement>(null)

  const handleOutsideClick = () => {
    setComparisonState(false)
  }

  useClickOutside(floatingIconsRef, handleOutsideClick)
  return (
    <div ref={floatingIconsRef} className="fixed bottom-[5%] flex flex-col gap-1 md:gap-5 right-1 sm:right-5 md:right-10 z-20">
      <div className="indicator">
        <span className="indicator-item badge bg-red-500 text-white w-4 h-4 md:w-6 md:h-6 right-2 top-3 text-[10px] md:text-base border-none">
          {selectedRooms.length}
        </span>
        <button
          onClick={() => {
            if (source === 'room') {
              setComparisonState(false);
              setSource('');
            } else {
              setComparisonState(true);
              setSource('room');
            }
          }}
          className="btn bg-white border-red-500 md:w-16 md:h-16 rounded-[50%]"
        >
          <MdOutlineBedroomParent className="md:w-6 md:h-6" />
        </button>
      </div>
      <div className="indicator">
        <span className="indicator-item badge bg-red-500 text-white w-4 h-4 md:w-6 md:h-6 right-2 top-3 text-[10px] md:text-base border-none">
          {selectedAcc.length}
        </span>
        <button
          onClick={() => {
            if (source === 'accommodation') {
              setComparisonState(false);
              setSource('')
            } else {
              setComparisonState(true);
              setSource('accommodation');
            }
          }}
          className="btn bg-white border-red-500 md:w-16 md:h-16 rounded-[50%]"
        >
          <BsBuilding className="md:w-6 md:h-6" />
        </button>
      </div>
      <ComparisonBox display={comparisonState} source={source} />
    </div>
  );
};