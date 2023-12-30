import React, { useCallback, useState } from 'react';
import { Category, categories, categoryList } from './constants';
import { CategoryTypes } from './types';

const CategorySelect = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryTypes>(
    Category.ALL
  );

  const handleSelectCategory = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.id) as CategoryTypes;

      if (categoryList.includes(value)) {
        setSelectedCategory(value);
      }
    },
    []
  );

  return (
    <section className="flex gap-2">
      <input
        type="radio"
        name="category"
        id="0"
        value={Category.ALL}
        className="block absolute w-px h-px overflow-hidden -m-px"
        readOnly
        checked={selectedCategory === Category.ALL}
      />
      {categories.map((category) => {
        const categoryKey = `${category.id}`;
        return (
          <div key={categoryKey}>
            <input
              type="radio"
              name="category"
              id={categoryKey}
              value={categoryKey}
              className="hidden peer"
              onChange={handleSelectCategory}
              checked={category.id === selectedCategory}
            />
            <label
              htmlFor={categoryKey}
              className="btn btn-ghost bg-white drop-shadow peer-checked:text-red-500 peer-checked:border-red-500"
            >
              {category.text}
            </label>
          </div>
        );
      })}
    </section>
  );
};

export default CategorySelect;
