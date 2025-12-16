'use client';

import { Slide } from '@/components/presentation/Slide';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function CTASlide() {
  return (
    <Slide className="bg-zinc-950 text-white overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px]"></div>
        </div>

      <div className="flex flex-col items-center justify-center text-center space-y-12 relative z-10">
        
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.8 }}
        >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-4">
                O Futuro Começa <span className="text-primary">Aqui.</span>
            </h1>
            <p className="text-2xl text-zinc-400 font-light max-w-2xl mx-auto">
                Vamos construir juntos a história digital do Colégio Essência Feliz?
            </p>
        </motion.div>



        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
        >
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-full group">
                Vamos Iniciar
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
        </motion.div>

        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 text-sm text-zinc-600"
        >
            
        </motion.p>
      </div>
    </Slide>
  );
}
