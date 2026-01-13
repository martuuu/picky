import { create } from 'zustand';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PickerStore {
  // Add picker state here
}

export const usePickerStore = create<PickerStore>(() => ({}));
