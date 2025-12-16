'use client';

import { Button } from '@/components/ui/button';
import { usePresentationStore } from '@/lib/store';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Children, ReactNode, useEffect } from 'react';

interface DeckProps {
  children: ReactNode;
}

export function Deck({ children }: DeckProps) {
  const { 
    currentSlide, 
    direction, 
    nextSlide, 
    prevSlide, 
    setTotalSlides 
  } = usePresentationStore();

  const slides = Children.toArray(children);
  const total = slides.length;

  useEffect(() => {
    setTotalSlides(total);
  }, [total, setTotalSlides]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-zinc-950 text-white">
      {/* Slide Area */}
      <AnimatePresence initial={false} custom={direction} mode='popLayout'>
        {slides[currentSlide]}
      </AnimatePresence>

      <div className="absolute bottom-6 right-8 flex gap-2 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="rounded-full w-12 h-12 bg-black/10 border-black/10 hover:bg-black/20 hover:border-black/30 dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/20 dark:text-white transition-all backdrop-blur-sm"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={nextSlide}
          disabled={currentSlide === total - 1}
          className="rounded-full w-12 h-12 bg-black/10 border-black/10 hover:bg-black/20 hover:border-black/30 dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/20 dark:text-white transition-all backdrop-blur-sm"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-500 z-50" 
           style={{ width: `${((currentSlide + 1) / total) * 100}%` }}
      />
    </div>
  );
}
