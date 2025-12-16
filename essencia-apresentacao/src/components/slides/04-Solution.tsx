'use client';

import { Slide } from '@/components/presentation/Slide';
import { motion } from 'framer-motion';
import { CheckCheck } from 'lucide-react';
import Image from 'next/image';

// Mock de Interface de Celular
const MobileMockup = () => (
  <motion.div 
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
    className="relative w-[300px] h-[600px] bg-zinc-950 rounded-[3rem] border-8 border-zinc-800 shadow-2xl overflow-hidden"
  >
    {/* App Content - Image */}
    <div className="w-full h-full relative bg-white">
      <Image 
        src="/imagem-celular.png" 
        alt="Interface do App Portal Essência" 
        fill
        className="object-contain object-top"
        quality={100}
        unoptimized
        priority
      />
      
      {/* Overlay Button */}
      <div className="absolute bottom-12 left-0 w-full flex justify-center z-10 px-6">
        <motion.a
          href="http://localhost:3001/"
          target="_blank"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, type: "spring" }}
          className="w-full bg-gradient-to-r from-green-600 to-orange-600 text-white font-bold py-4 rounded-xl shadow-2xl shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer no-underline"
        >
          Clique e Descubra 👆
        </motion.a>
      </div>
    </div>
  </motion.div>
);

export function SolutionSlide() {
  return (
    <Slide className="bg-zinc-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Lado Esquerdo: Descrição da Solução */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-bold text-sm mb-4 border border-green-200">
                A Solução Definitiva
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-zinc-900 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-600">Portal Essência</span>
            </h2>
            <p className="text-xl text-zinc-600 mt-6 leading-relaxed font-medium">
              Não é só um app. É um ecossistema completo de comunicação, 
              feito sob medida, com a sua marca e os seus dados.
            </p>
          </motion.div>

          {/* Features List */}
          <div className="space-y-4">
            {[
              "Aplicativo Nativo (iOS & Android)",
              "Identidade 100% Personalizada",
              "Comunicação em Tempo Real",
              "Escola é Dona dos Dados"
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCheck className="w-4 h-4" />
                </div>
                <span className="text-lg text-zinc-700 font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lado Direito: Demonstração Visual */}
        <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-orange-300/30 blur-[100px] -z-10 rounded-full"></div>
            <MobileMockup />
        </div>

      </div>
    </Slide>
  );
}
