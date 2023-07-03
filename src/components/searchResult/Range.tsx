import { useCallback } from 'react';

interface IRange {
  readonly width: number;
  readonly steps: number;
  readonly onRangeValueChange: (min: number, max: number) => void;
}

const Range = ({ width, steps, onRangeValueChange }: IRange) => {
  const STEP_WIDTH = width / (steps + 1);
  const THUMB_WIDTH = STEP_WIDTH * 2;

  const thumbList = [
    {
      left: 0
    },
    {
      left: width - THUMB_WIDTH
    }
  ];

  const getDOMs = useCallback(() => {
    const slider: HTMLElement | null = document.querySelector('.slider');

    const sliderRange: HTMLElement | null =
      document.querySelector('.sliderRange');

    const targetThumb: (HTMLElement & HTMLDivElement) | null =
      document.querySelector('.thumbMoving');

    const thumbs: NodeListOf<HTMLElement> | null =
      document.querySelectorAll('.thumb');

    return { slider, sliderRange, targetThumb, thumbs };
  }, []);

  const handleRangeValueChange = useCallback((min: number, max: number) => {
    const { slider, sliderRange } = getDOMs();

    if (!slider || !sliderRange) return;

    sliderRange.style.width = `${max - min + THUMB_WIDTH}px`;
    sliderRange.style.left = `${min}px`;

    const currentMinPrice = min / STEP_WIDTH + 1;
    const currentMaxPrice = max / STEP_WIDTH + 1;

    onRangeValueChange(currentMinPrice, currentMaxPrice);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { slider, targetThumb, thumbs } = getDOMs();

    if (!slider || !targetThumb) return;

    document.addEventListener;
    let newLeft = Math.floor(e.clientX - slider?.getBoundingClientRect().left);

    if (newLeft < 0) {
      newLeft = 0;
    }

    let rightEdge = slider.offsetWidth - targetThumb.offsetWidth;
    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }

    if (newLeft % STEP_WIDTH === 0) {
      targetThumb.style.left = `${newLeft}px`;

      const rangeValues = Array.from(thumbs).map((thumb) => {
        const stringValue = thumb.style.left;

        if (stringValue === '') return 0;

        return parseInt(stringValue.split('px')[0]);
      });

      const min = Math.min(...rangeValues);
      const max = Math.max(...rangeValues);

      handleRangeValueChange(min, max);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const { slider, targetThumb, thumbs } = getDOMs();

    if (!slider || !targetThumb) return;

    document.addEventListener;
    let newLeft = Math.floor(
      e.touches[0].clientX - slider?.getBoundingClientRect().left
    );

    if (newLeft < 0) {
      newLeft = 0;
    }

    let rightEdge = slider.offsetWidth - targetThumb.offsetWidth;
    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }

    if (newLeft % STEP_WIDTH === 0) {
      targetThumb.style.left = `${newLeft}px`;

      const rangeValues = Array.from(thumbs).map((thumb) => {
        const stringValue = thumb.style.left;

        if (stringValue === '') return 0;

        return parseInt(stringValue.split('px')[0]);
      });

      const min = Math.min(...rangeValues);
      const max = Math.max(...rangeValues);

      handleRangeValueChange(min, max);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    const { slider, targetThumb } = getDOMs();

    if (!slider || !targetThumb) return;

    targetThumb.classList.remove('thumbMoving');
  }, []);

  const handleTouchEnd = useCallback(() => {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);

    const { slider, targetThumb } = getDOMs();

    if (!slider || !targetThumb) return;

    targetThumb.classList.remove('thumbMoving');
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const { slider } = getDOMs();

    if (!slider) return;

    const targetThumb = e.currentTarget;
    targetThumb.classList.add('thumbMoving');

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    targetThumb.ondragstart = () => {
      return false;
    };
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const { slider } = getDOMs();

      if (!slider) return;

      const targetThumb = e.currentTarget;
      targetThumb.classList.add('thumbMoving');

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      targetThumb.ondragstart = () => {
        return false;
      };
    },
    []
  );

  return (
    <div className="slider h-10 relative" style={{ width: `${width}px` }}>
      <div className="track w-full h-2 bg-gray-300 rounded absolute top-4 left-0"></div>
      <div
        className="sliderRange absolute z-[2] top-4 bg-emerald-400 h-2"
        style={{ width: `${width}px` }}
      ></div>
      {thumbList.map((thumb, index) => {
        return (
          <div
            key={`thumb-${index}`}
            className="thumb absolute top-2 h-6 border-emerald-400 border-4 bg-white rounded-lg z-[3] cursor-pointer"
            style={{ width: `${THUMB_WIDTH}px`, left: `${thumb.left}px` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          ></div>
        );
      })}
    </div>
  );
};

export default Range;
