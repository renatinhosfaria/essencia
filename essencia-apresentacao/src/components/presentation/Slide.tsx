'use client';

import { usePresentationStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideProps {
  children: ReactNode;
  className?: string; // Para estilização customizada por slide
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 1.05,
  }),
};

export function Slide({ children, className = "" }: SlideProps) {
  const direction = usePresentationStore((state) => state.direction);

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.4 }
      }}
      className={`absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-background ${className}`}
    >
      <div className="w-full max-w-7xl px-8 md:px-16 mx-auto h-full flex flex-col justify-center">
        {children}
      </div>
    </motion.div>
  );
}
