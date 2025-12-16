'use client';

import { Slide } from '@/components/presentation/Slide';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function IntroSlide() {
  return (
    <Slide className="bg-gradient-to-br from-background via-orange-50 to-primary/20">
      <div className="flex flex-col items-center justify-center text-center space-y-12">
        
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="relative w-auto h-auto min-w-[200px] min-h-[200px] flex items-center justify-center"
        >
           {/* Logo Image */}
           <div className="relative w-80 h-40">
             <Image 
               src="/logo.png" 
               alt="Essencia Logo" 
               fill 
               className="object-contain"
               priority
             />
           </div>
        </motion.div>

        <div className="space-y-6 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold tracking-tight text-foreground"
          >
            Portal<span className="text-primary"> Essência</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-xl md:text-3xl text-muted-foreground font-light"
          >
            A transformação digital do <span className="font-semibold text-secondary">Colégio Essência Feliz</span>
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
          className="absolute bottom-12 text-muted-foreground text-sm"
        >
          
        </motion.div>
      </div>
    </Slide>
  );
}
