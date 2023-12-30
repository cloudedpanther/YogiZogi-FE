import { useCallback, useRef } from 'react';

export const useIntersectionObserver = (callback: () => void) => {
  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log('ratio: ', entry.intersectionRatio);
          console.log('intersecting?: ', entry.isIntersecting);

          if (!entry.isIntersecting) return;
          unobserve();
          callback();
        });
      },
      { threshold: 0.3 }
    )
  );

  const target = useRef<HTMLDivElement>(null);

  const observe = useCallback(() => {
    if (!target.current) return;
    observer.current.observe(target.current);
  }, []);

  const unobserve = useCallback(() => {
    if (!target.current) return;

    observer.current.unobserve(target.current);
  }, []);

  const showTarget = useCallback(() => {
    if (!target.current) return;

    target.current.classList.remove('hidden');
    target.current.classList.add('flex', 'justify-center', 'items-center');
  }, []);

  const hideTarget = useCallback(() => {
    if (!target.current) return;

    target.current.classList.remove('flex', 'justify-center', 'items-center');
    target.current.classList.add('hidden');
  }, []);

  return { observe, unobserve, target, showTarget, hideTarget };
};
