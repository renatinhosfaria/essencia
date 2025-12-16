'use client';

import { Slide } from '@/components/presentation/Slide';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const GROWTH_RATE = 0.10; // 10%

export function MotivacaoEssenciaSlide() {
  const [baseStudents, setBaseStudents] = useState<number>(0);
  const [costPerStudent, setCostPerStudent] = useState<number>(0);

  const projections = [
    { year: 2026, label: 'Ano 1' },
    { year: 2027, label: 'Ano 2' },
    { year: 2028, label: 'Ano 3' },
    { year: 2029, label: 'Ano 4' },
    { year: 2030, label: 'Ano 5' },
  ].map((item, index) => {
    const students = Math.floor(baseStudents * Math.pow(1 + GROWTH_RATE, index + 1));
    const annualCost = students * costPerStudent * 12; // Mensal * 12
    return { ...item, students, annualCost };
  });

  const totalWasted = projections.reduce((acc, curr) => acc + curr.annualCost, 0);

  // Calc current annual cost for display
  const currentAnnualCost = baseStudents * costPerStudent * 12;

  // Max value for chart scaling (dynamic based on current max)
  const maxProjectionCost = Math.max(...projections.map(p => p.annualCost), currentAnnualCost * 1.5); 

  return (
    <Slide className="bg-zinc-50">
      <div className="flex flex-col h-full justify-center max-w-7xl mx-auto w-full px-4 md:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium text-xs mb-3 uppercase tracking-wider">
            <AlertCircle className="w-3 h-3" />
            O Custo da Terceirização
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-zinc-900 tracking-tight max-w-4xl mx-auto">
            O impacto financeiro do <span className="text-primary">"Agenda Edu"</span> no longo prazo.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Coluna Esquerda: Contexto Atual */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white border-zinc-200 shadow-sm h-full">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
                       <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                         <Calendar className="w-5 h-5" />
                       </span>
                       Cenário Atual (2025)
                    </h3>
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg group hover:ring-1 hover:ring-blue-300 transition-all">
                        <span className="text-zinc-500 text-sm">Alunos</span>
                        <div className="flex items-center gap-2">
                           <Input 
                             type="number" 
                             value={baseStudents} 
                             onChange={(e) => setBaseStudents(Number(e.target.value))}
                             className="w-20 h-8 text-right font-bold text-zinc-900 font-mono bg-white border-zinc-200 focus:ring-blue-500"
                           />
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg group hover:ring-1 hover:ring-red-300 transition-all">
                        <span className="text-zinc-500 text-sm">Custo/Aluno</span>
                         <div className="flex items-center gap-2">
                           <span className="text-zinc-400 text-sm">R$</span>
                           <Input 
                             type="number" 
                             value={costPerStudent} 
                             onChange={(e) => setCostPerStudent(Number(e.target.value))}
                             className="w-20 h-8 text-right font-bold text-red-600 font-mono bg-white border-zinc-200 focus:ring-red-500"
                           />
                         </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                        <span className="text-red-700 text-sm font-medium">Custo Anual</span>
                        <span className="font-bold text-red-700 font-mono">
                          R$ {currentAnnualCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-zinc-100">
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      Preencha os valores acima para simular o cenário real da escola.
                      <strong className="text-zinc-700 block mt-2">O cálculo se ajusta automaticamente.</strong>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Coluna Direita: Projeção */}
          <div className="lg:col-span-8">
            <motion.div
              layout // Smooth transition when height changes due to projection updates
              className="bg-white border border-zinc-200 shadow-xl rounded-2xl p-6 h-full flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">Projeção 2026-2030</h3>
                  <p className="text-sm text-zinc-500">Considerando crescimento de 10% a.a.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  Crescimento Sustentável
                </div>
              </div>

              {/* Gráfico de Barras Customizado */}
              <div className="flex-1 flex flex-col justify-end gap-3 min-h-[300px]">
                <div className="flex items-end justify-between gap-2 md:gap-4 h-full pb-6 border-b border-zinc-100">
                  {projections.map((proj, i) => {
                    // Normalizar altura para exibição baseado no máximo calculado
                    const heightPercentage = Math.max((proj.annualCost / maxProjectionCost) * 100, 15); 
                    
                    return (
                      <div key={proj.year} className="flex-1 h-full flex flex-col justify-end items-center gap-2 group">
                         <div className="text-[10px] md:text-sm font-bold text-zinc-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {proj.students} alunos
                         </div>
                         <motion.div 
                           initial={false} // Disable initial animation on update for snappier feel
                           animate={{ height: `${heightPercentage}%` }}
                           transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                           className="w-full max-w-[60px] bg-gradient-to-t from-red-500 to-orange-400 rounded-t-xl relative overflow-hidden shadow-lg group-hover:brightness-110 transition-all"
                         >
                            <div className="absolute top-2 w-full text-center text-white/90 text-xs md:text-sm font-bold truncate px-1">
                               {Math.floor(proj.annualCost / 1000)}k
                            </div>
                         </motion.div>
                         <span className="text-xs md:text-sm font-medium text-zinc-600">{proj.year}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

               {/* Total Acumulado */}
               <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-red-100 rounded-lg">
                     <DollarSign className="w-5 h-5 text-red-600" />
                   </div>
                   <span className="text-zinc-600 font-medium">Despesa Acumulada (5 anos)</span>
                 </div>
                 <motion.div 
                    key={totalWasted} // Re-animate on number change
                    initial={{ scale: 1.1, color: '#ef4444' }}
                    animate={{ scale: 1, color: 'transparent' }} // Back to gradient (handled by className)
                    className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600"
                 >
                    R$ {totalWasted.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                 </motion.div>
               </div>

            </motion.div>
          </div>

        </div>
      </div>
    </Slide>
  );
}
