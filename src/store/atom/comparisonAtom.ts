import { IComparisonBoxProps } from 'components/floatingIcons/comparison/types';
import { atom } from 'recoil';

export const selectedAccommodation = atom({
  key: 'selectedAccommodation',
  default: [] as IComparisonBoxProps[]
});

export const selectedRoom = atom({
  key: 'selectedRoom',
  default: [] as IComparisonBoxProps[]
});
