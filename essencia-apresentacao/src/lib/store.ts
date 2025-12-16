import { create } from 'zustand';

interface PresentationState {
  currentSlide: number;
  direction: number;
  totalSlides: number;
  setTotalSlides: (total: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
}

export const usePresentationStore = create<PresentationState>((set, get) => ({
  currentSlide: 0,
  direction: 0,
  totalSlides: 0,
  setTotalSlides: (total) => set({ totalSlides: total }),
  nextSlide: () => {
    const { currentSlide, totalSlides } = get();
    if (currentSlide < totalSlides - 1) {
      set({ currentSlide: currentSlide + 1, direction: 1 });
    }
  },
  prevSlide: () => {
    const { currentSlide } = get();
    if (currentSlide > 0) {
      set({ currentSlide: currentSlide - 1, direction: -1 });
    }
  },
  goToSlide: (index) => {
    const { currentSlide } = get();
    set({ 
      currentSlide: index, 
      direction: index > currentSlide ? 1 : -1 
    });
  },
}));
