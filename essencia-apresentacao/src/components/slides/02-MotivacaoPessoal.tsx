'use client';

import { Slide } from '@/components/presentation/Slide';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Briefcase, Clock, Heart, Star, TrendingDown } from 'lucide-react';

export function MotivacaoPessoalSlide() {
  return (
    <Slide className="bg-gradient-to-br from-zinc-50 to-orange-50/30">
      <div className="flex flex-col h-full justify-center max-w-6xl mx-auto w-full">
        
        {/* Header - Título Emocional */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 font-medium text-sm mb-4">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-800 tracking-tight">
            Nossa História com o Colégio Essência Feliz
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          
          {/* Lado Esquerdo: O Vínculo (Positivo) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Clock className="w-8 h-8 text-primary-dark" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-800">Mais de 7 Anos de História</h3>
                    <p className="text-zinc-500 font-medium">Matheus & Miguel</p>
                  </div>
                </div>
                
                <p className="text-lg text-zinc-600 leading-relaxed mb-4">
                  Nossos filhos cresceram nos corredores do Escola Infantil Espaço Feliz. Vimos eles se desenvolverem, 
                  superamos juntos uma pandemia e criamos um <span className="font-bold text-primary-dark">vínculo inquebrável</span> com a escola.
                </p>
                
                <div className="flex gap-2 text-sm text-zinc-500 items-center">
                  <Star className="w-4 h-4 text-orange-400 fill-current" />
                  <span>Momentos de alegria e superação.</span>
                </div>
              </CardContent>
            </Card>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pl-6 border-l-2 border-zinc-200"
            >
              <p className="text-xl font-serif italic text-zinc-500">
                &quot;Nosso plano sempre foi deixar os meninos aqui o maior tempo possível.&quot;
              </p>
            </motion.div>
          </motion.div>

          {/* Lado Direito: O Desafio (A Realidade) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
             <Card className="border-none shadow-lg bg-red-50/50 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-red-400" />
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <TrendingDown className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-800 flex items-center gap-2">
                       <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-lg border border-orange-200">2026</span>
                       A Grande Mudança
                    </h3>
                    <p className="text-red-500 font-medium mt-1">Um novo ciclo, um novo desafio</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 247, 237, 1)" }} // orange-50
                    transition={{ delay: 0.8, type: "spring" }}
                    className="flex gap-4 items-start p-5 bg-white rounded-xl border-l-4 border-orange-500 shadow-md ring-1 ring-black/5"
                  >
                    <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                      <Briefcase className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg">Transição de Carreira</h4>
                      <p className="text-zinc-600 leading-snug mt-1">
                        Edilene fecha o Salão para se tornar <span className="font-bold text-white bg-orange-500 px-2 py-0.5 rounded-md shadow-sm">Arquiteta</span>.
                      </p>
                    </div>
                  </motion.div>

                  <div className="flex gap-4 items-start">
                     <div className="w-5 h-5 mt-1 shrink-0 flex items-center justify-center font-bold text-zinc-400 px-2 border border-zinc-300 rounded text-xs">$</div>
                     <p className="text-zinc-600">
                       Início de carreira é difícil. Sem a renda dela, a conta não fecha.
                     </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-zinc-900 text-white p-6 rounded-2xl shadow-xl"
            >
              <p className="text-lg font-medium leading-relaxed flex items-center gap-4">
                <span className="text-3xl">🥺</span>
                <span>
                   Sozinho, mesmo cortando custos, não consigo manter as mensalidades.
                   <br />
                   <span className="text-zinc-400 text-sm font-normal">Precisamos de uma solução criativa.</span>
                </span>
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </Slide>
  );
}
