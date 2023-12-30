import React, { useCallback, useState } from 'react';
import { Sort, sortingFactorList, sortingFactors } from './constants';
import { SortingFactorTypes } from './types';

const SortingFactorSelect = () => {
  const [selectedSortingFactor, setSelectedSortingFactor] =
    useState<SortingFactorTypes>(Sort.RATE);

  const handleSelectSortingFactor = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.id as SortingFactorTypes;

      if (sortingFactorList.includes(value)) {
        setSelectedSortingFactor(value);
      }
    },
    []
  );

  return (
    <section className="flex flex-wrap md:flex-nowrap gap-2 items-center mt-7 mb-7 md:mt-0 md:mb-0">
      {sortingFactors.map((factor) => {
        return (
          <div key={factor.id}>
            <input
              type="radio"
              name="sortBy"
              id={factor.id}
              value={factor.id}
              className="hidden peer"
              onChange={handleSelectSortingFactor}
              checked={factor.id === selectedSortingFactor}
            />
            <label
              htmlFor={factor.id}
              className="btn btn-ghost bg-white drop-shadow btn-sm h-10 lg:w-28 w-[104px] peer-checked:text-emerald-500 peer-checked:border-emerald-500"
            >
              {factor.text}
            </label>
          </div>
        );
      })}
    </section>
  );
};

export default SortingFactorSelect;
