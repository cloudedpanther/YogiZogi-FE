import RatingStars from '../common/RatingStars';
import { ISearchResultContent } from 'api/search';
import { BiShoppingBag } from 'react-icons/bi';
import { useRecoilState } from 'recoil';
import { selectedAccommodation } from '../../store/atom/comparisonAtom';
import { useState } from 'react';
import { AlertModal } from '../../components/common/AlertModal';
import { addCommasToPrice } from '../../helpers';

interface IAccommodationPreview {
  data: ISearchResultContent;
}

const AccommodationPreview = ({ data }: IAccommodationPreview) => {
  const { accommodationName, rate, picUrl, address, price } = data;
  const [comparisonItems, setComparisonItems] = useRecoilState(
    selectedAccommodation
  );
  const [alertModalState, setAlertModalState] = useState(false);

  const addComparisonCart = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (
      comparisonItems.some(
        (el) => el.accommodationName === data.accommodationName
      )
    )
      setAlertModalState(true);
    else setComparisonItems((prev) => [...prev, data]);
  };

  return (
    <article className="card bg-base-100 shadow-xl mb-2">
      <figure
        className="h-60 bg-cover bg-center"
        style={{ backgroundImage: `url('${picUrl}')` }}
      ></figure>
      <div className="card-body grid gap-0 grid-cols-5 grid-rows-3 py-2 px-4 items-center">
        <div className="row-start-1 row-end-2 col-start-1 col-end-6">
          <p className="card-title block text-lg truncate"></p>
        </div>
      </div>
      <div className="card-body grid gap-0 grid-cols-5 grid-rows-3 py-2 px-4 items-center">
        <div className="row-start-1 row-end-2 col-start-1 col-end-6">
          <p className="card-title block text-lg truncate">
            {accommodationName}
          </p>
        </div>
        <div className="flex items-center gap-2 row-start-2 row-end-3 col-start-1 col-end-6 text-lg font-bold text-right">
          <p>{`${addCommasToPrice(price)}원`}</p>
          <button
            onClick={(e) => addComparisonCart(e)}
            className="btn btn-sm btn-circle btn-success"
          >
            <BiShoppingBag className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm row-start-3 row-end-4 col-start-1 col-end-4">
        <img src="./assets/icons/location.svg" alt="destination icon" className="text-red-500 text-2xl shrink-0"/>
          <p className="truncate">{address}</p>
        </div>
        <div className="row-start-3 row-end-4 col-start-4 col-end-6 flex items-center justify-end">
          <RatingStars rate={rate} />
        </div>
      </div>
      <AlertModal
        content="이미 담긴 상품입니다."
        modalState={alertModalState}
        handleModal={setAlertModalState}
      />
    </article>
  );
};

export default AccommodationPreview;
