'use client';

import { Slide } from '@/components/presentation/Slide';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Code2, Crown, Eye, X } from 'lucide-react';
import { useState } from 'react';

const RevealItem = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      onClick={() => setIsVisible(true)}
      className={`relative cursor-pointer group ${className}`}
    >
      <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-md select-none'}`}>
        {children}
      </div>
      
      {/* Overlay Mask */}
      {!isVisible && (
        <div className="absolute inset-0 bg-zinc-800/50 rounded flex items-center justify-center border border-zinc-700/50 backdrop-blur-[2px] group-hover:bg-zinc-800/70 transition-colors">
          <Eye className="w-3 h-3 text-zinc-500 opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </div>
  );
};

export function ModelSlide() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Slide className="bg-zinc-950">
      <div className="flex flex-col h-full justify-center max-w-7xl mx-auto w-full px-4 md:px-8 relative z-10 py-4">
        
        {/* Background Effect */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
            Quanto vale ter sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">própria tecnologia?</span>
          </h2>
          <p className="text-zinc-400 text-lg">
            Comparativo de investimento e retorno para a escola.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative w-full max-w-6xl mx-auto overflow-hidden">
            
            {/* VS Badge - Fades out in Detail View */}
            <AnimatePresence>
              {!showDetails && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring" }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center w-12 h-12 bg-zinc-950 rounded-full border-4 border-zinc-900 shadow-xl"
                >
                  <span className="font-black text-zinc-600 text-sm">VS</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              className="flex gap-8 items-stretch"
              initial={false}
              animate={{ x: showDetails ? "-51.5%" : "0%" }} // Slide to show 2nd and 3rd card
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              
              {/* Card 1: Mercado */}
              <div className="min-w-[calc(50%-16px)] w-[calc(50%-16px)]">
                <Card className="h-full bg-zinc-900/50 border-zinc-800 relative overflow-hidden group hover:border-zinc-700 transition-colors">
                  <CardContent className="p-6 space-y-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-zinc-400 font-medium text-base">No Mercado Tradicional</h3>
                        <p className="text-xl font-bold text-white mt-1">Software House</p>
                      </div>
                      <div className="p-2 bg-zinc-800 rounded-xl">
                        <Code2 className="w-5 h-5 text-zinc-500" />
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-zinc-800">
                      <div className="flex justify-between items-center text-zinc-300 text-sm">
                        <span>Desenvolvimento App</span>
                        <span className="font-mono text-red-500 font-bold">R$ 18.000+</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-300 text-sm">
                        <span>Manutenção Mensal</span>
                        <span className="font-mono text-red-500 font-bold">R$ 1.500/mês</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-300 opacity-50 text-sm">
                        <span>Prazo de Entrega</span>
                        <span>6-8 meses</span>
                      </div>
                    </div>

                    <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center">
                      <p className="text-[10px] text-red-400 uppercase font-bold mb-1">Custo 1º Ano</p>
                      <p className="text-2xl font-black text-red-500">~ R$ 36.000,00</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Card 2: Essência */}
              <div className="min-w-[calc(50%-16px)] w-[calc(50%-16px)] z-20">
                <Card className={`h-full bg-gradient-to-b from-zinc-900 to-black border-primary/30 relative overflow-hidden shadow-2xl transition-all duration-500 ${showDetails ? 'shadow-none border-zinc-800' : 'shadow-primary/10'}`}>
                  <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-primary to-orange-500" />
                  
                  <CardContent className="p-6 space-y-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold mb-2">
                          <Crown className="w-3 h-3" />
                          Oportunidade Única
                        </div>
                        <p className="text-xl font-bold text-white mt-1">Parceria Essência</p>
                      </div>
                      {!showDetails && (
                        <motion.button 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => setShowDetails(true)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-green-500/20 rounded-xl cursor-pointer hover:bg-green-500/30 transition-colors"
                        >
                          <ArrowRight className="w-5 h-5 text-green-400" />
                        </motion.button>
                      )}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-zinc-800">
                      <div className="flex justify-between items-center text-white text-sm">
                        <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Desenvolvimento App</span>
                        <RevealItem>
                          <span className="font-mono text-primary font-bold text-lg">R$ 0,00</span>
                        </RevealItem>
                      </div>
                      <div className="flex justify-between items-center text-white text-sm">
                        <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Manutenção Mensal</span>
                        <RevealItem>
                            <span className="font-mono text-green-400 font-bold">Sem Custo</span>
                        </RevealItem>
                      </div>
                      <div className="flex justify-between items-center text-white text-sm">
                        <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Prazo de Entrega</span>
                        <RevealItem>
                            <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded">Pronto Fev/2026</span>
                        </RevealItem>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-3 rounded-xl border border-green-500/20 text-center relative overflow-hidden">
                      <div className="relative z-10">
                        <p className="text-[10px] text-green-400 uppercase font-bold mb-1">Ganhos para a Escola</p>
                        <p className="text-xl font-black text-white">Sistema Próprio +</p>
                        <p className="text-base font-bold text-green-400">Economia Vitalícia</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

               {/* Card 3: Permuta Details (Hidden initially) */}
               <div className="min-w-[calc(50%-16px)] w-[calc(50%-16px)]">
                 <Card className="h-full bg-zinc-900 border border-zinc-800 relative overflow-hidden shadow-2xl">
                    <button 
                      onClick={() => setShowDetails(false)}
                      className="absolute top-4 right-4 text-zinc-500 hover:text-white z-10 p-2 hover:bg-zinc-800 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <CardContent className="p-6 space-y-6">
                      <div className="text-center pt-2">
                        <h3 className="text-2xl font-bold text-white mb-2">Proposta de Permuta 2026</h3>
                        <p className="text-zinc-400 text-sm">Troca equivalente por serviços educacionais</p>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg shrink-0">M</div>
                            <div>
                              <p className="font-bold text-white">Matheus e Miguel</p>
                              <p className="text-xs text-zinc-500">Beneficiários</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm p-3 bg-zinc-800/50 rounded-lg">
                            <span className="text-zinc-300">Mensalidade (Jan-Dez)</span>
                            <span className="text-green-400 font-mono font-bold">100%</span>
                          </div>
                          <div className="flex justify-between items-center text-sm p-3 bg-zinc-800/50 rounded-lg">
                            <span className="text-zinc-300">Material Escolar 2026</span>
                            <span className="text-green-400 font-mono font-bold">100%</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-800 text-center">
                          <p className="text-sm text-zinc-500 mb-1">Investimento Financeiro Real</p>
                          <p className="text-3xl font-black text-white">R$ 0,00</p>
                          <p className="text-xs text-zinc-600 mt-2"></p>
                        </div>
                      </div>
                    </CardContent>
                 </Card>
               </div>

            </motion.div>
        </div>

        {/* Footer Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 text-zinc-400 bg-zinc-900/50 px-5 py-2 rounded-full border border-zinc-800">
             <Code2 className="w-4 h-4 text-orange-500" />
             <span className="text-xs md:text-sm">
               Garantia de <strong>evolução constante e manutenções mensais</strong> no ano de 2025.
             </span>
          </div>
        </motion.div>

      </div>
    </Slide>
  );
}
