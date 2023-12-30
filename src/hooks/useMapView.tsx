import { useCallback, useState } from 'react';

const useMapView = () => {
  const [isMapView, setIsMapView] = useState(false);

  const onViewToggle = useCallback(() => {
    setIsMapView((viewType) => !viewType);
  }, [isMapView]);

  return [isMapView, onViewToggle] as const;
};

export default useMapView;
