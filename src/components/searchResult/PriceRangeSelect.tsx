import { useCallback, useState } from 'react';
import Range from './Range';
import { MAX_PRICE, MIN_PRICE, RANGE_WIDTH, STEPS } from './constants';

const PriceRangeSelect = () => {
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);

  const renderCurrentPriceRange = useCallback(() => {
    if (maxPrice === MAX_PRICE) {
      return `${minPrice}만원 이상`;
    }

    return `${minPrice}만원 ~ ${maxPrice}만원`;
  }, [minPrice, maxPrice]);

  const handleRangeValueChange = useCallback(
    (price1: number, price2: number) => {
      for (const value of [price1, price2]) {
        if (value < MIN_PRICE || value > MAX_PRICE || isNaN(value)) return;
      }

      const min = Math.min(price1, price2);
      const max = Math.max(price1, price2);

      setMinPrice(min);
      setMaxPrice(max);
    },
    []
  );

  return (
    <section style={{ width: `${248}px` }}>
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold">가격 범위</p>
        <p className="text-xs font-bold text-red-500">
          {renderCurrentPriceRange()}
        </p>
      </div>
      <Range
        width={RANGE_WIDTH}
        steps={STEPS}
        onRangeValueChange={handleRangeValueChange}
      />
      <input
        type="range"
        name="minPrice"
        id="minPrice"
        value={minPrice}
        readOnly
        className="block absolute w-px h-px overflow-hidden -m-px"
      />
      <input
        type="range"
        name="maxPrice"
        id="maxPrice"
        value={maxPrice}
        readOnly
        className="block absolute w-px h-px overflow-hidden -m-px"
      />
      <div className="text-xs font-bold text-gray-400 flex justify-between">
        <p>{`${MIN_PRICE}만원`}</p>
        <p>{`${MAX_PRICE}만원`}</p>
      </div>
    </section>
  );
};

export default PriceRangeSelect;
