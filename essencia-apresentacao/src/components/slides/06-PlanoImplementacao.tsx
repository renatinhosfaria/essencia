'use client';

import { Slide } from '@/components/presentation/Slide';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Flag, GraduationCap, Users } from 'lucide-react';

const TimelineItem = ({ 
  icon: Icon, 
  title, 
  date, 
  description, 
  delay,
  isLast = false
}: { 
  icon: any, 
  title: string, 
  date: string, 
  description: string, 
  delay: number,
  isLast?: boolean
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative flex-1 group"
  >
    {/* Connector Line */}
    {!isLast && (
      <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-zinc-200 -z-10 overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ delay: delay + 0.2, duration: 0.5 }}
          className="w-full h-full bg-gradient-to-r from-primary to-orange-500"
        />
      </div>
    )}

    {/* Icon Node */}
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-200 group-hover:border-primary transition-all duration-300 flex items-center justify-center shadow-lg group-hover:shadow-primary/20 mb-6">
        <Icon className="w-8 h-8 text-zinc-400 group-hover:text-primary transition-colors" />
      </div>

      {/* Card Content */}
      <div className="w-full bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm group-hover:shadow-md transition-all hover:-translate-y-1">
        <div className="mb-3">
          <span className="text-[10px] font-bold tracking-wider text-orange-600 uppercase bg-orange-100 px-2 py-1 rounded-full">{date}</span>
        </div>
        <h3 className="font-bold text-zinc-900 text-lg mb-2 leading-tight">{title}</h3>
        <p className="text-zinc-500 font-medium text-sm mb-4 leading-relaxed line-clamp-3">{description}</p>
        
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 transition-colors group-hover:bg-primary group-hover:text-white">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Pesquisa Semanal</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export function PlanoImplementacaoSlide() {
  return (
    <Slide className="bg-white">
      <div className="flex flex-col h-full justify-center max-w-7xl mx-auto w-full px-4 md:px-8 relative z-10 py-8">
        
        {/* Cleaner Background Effect */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[100px] -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 font-medium text-xs mb-4">
            <Calendar className="w-3 h-3 text-orange-500" />
            <span>Roadmap de Adoção 2026</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">
            Implementação <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Gradual & Segura</span>
          </h2>
          <p className="text-zinc-500 font-medium mt-3 text-lg max-w-2xl mx-auto">
            Um processo validado etapa por etapa, garantindo a adaptação tranquila de pais e alunos.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-4 justify-between items-start relative px-4">
          <TimelineItem 
            icon={Flag}
            title="Piloto: 5º Ano"
            date="Fevereiro"
            description="Início controlado apenas com a turma do 5º ano para validação inicial em ambiente real."
            delay={0.2}
          />
          
          <TimelineItem 
            icon={Users}
            title="Expansão 1"
            date="+30 Dias"
            description="Após aprovação do piloto, expansão para 4º e 3º anos do Fundamental I."
            delay={0.4}
          />
          
          <TimelineItem 
            icon={GraduationCap}
            title="Expansão 2"
            date="+60 Dias"
            description="Cobertura total do ciclo inicial (Fundamental I) consolidando a cultura de uso."
            delay={0.6}
          />

          <TimelineItem 
            icon={CheckCircle2}
            title="Rollout Total"
            date="Contínuo"
            description="Avanço gradual para todas as turmas até atingir 100% de adesão escolar."
            delay={0.8}
            isLast={true}
          />
        </div>

      </div>
    </Slide>
  );
}
