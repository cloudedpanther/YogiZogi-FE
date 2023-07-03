import { atom } from 'recoil';

export const selectedAccommodation = atom({
  key: 'selectedAccommodation',
  default: [] as IComparison[]
});

export const selectedRoom = atom({
  key: 'selectedRoom',
  default: [] as IComparison[]
});
