"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { ArrowRight, Baby, BookOpen, Palette, User } from "lucide-react";

const classes = [
  {
    id: "bercario",
    name: "Berçário",
    ageRange: "0 a 1 ano",
    icon: Baby,
    color: "blue",
    description:
      "Ambiente acolhedor e seguro para os primeiros meses de vida, com atenção individualizada e muito carinho.",
    highlights: [
      "Estimulação sensorial",
      "Rotina personalizada",
      "Acompanhamento nutricional",
    ],
    schedule: "Meio período ou integral",
  },
  {
    id: "maternal",
    name: "Maternal",
    ageRange: "1 a 3 anos",
    icon: User,
    color: "green",
    description:
      "Fase de descobertas! Incentivamos a autonomia através de atividades lúdicas e interação social.",
    highlights: [
      "Desenvolvimento motor",
      "Socialização",
      "Introdução à música e arte",
    ],
    schedule: "Meio período ou integral",
  },
  {
    id: "jardim",
    name: "Jardim",
    ageRange: "3 a 5 anos",
    icon: Palette,
    color: "orange",
    description:
      "Aprendizado criativo com foco em brincadeiras educativas, arte e desenvolvimento da coordenação motora.",
    highlights: [
      "Alfabetização inicial",
      "Atividades artísticas",
      "Educação física",
    ],
    schedule: "Meio período ou integral",
  },
  {
    id: "pre-escola",
    name: "Pré-escola",
    ageRange: "5 a 6 anos",
    icon: BookOpen,
    color: "purple",
    description:
      "Preparação para o ensino fundamental com atividades que estimulam o raciocínio lógico e a alfabetização.",
    highlights: [
      "Alfabetização completa",
      "Matemática lúdica",
      "Inglês básico",
    ],
    schedule: "Meio período ou integral",
  },
];

const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    hover: "hover:shadow-blue-200/50",
    gradient: "from-blue-500 to-cyan-500",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-100",
    hover: "hover:shadow-green-200/50",
    gradient: "from-green-500 to-emerald-500",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-100",
    hover: "hover:shadow-orange-200/50",
    gradient: "from-orange-500 to-amber-500",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-100",
    hover: "hover:shadow-purple-200/50",
    gradient: "from-purple-500 to-pink-500",
  },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring" as const, 
      stiffness: 50 
    } 
  },
};

export function Classes() {
  return (
    <section id="turmas" className="py-20 md:py-32 bg-neutral-50 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <Container>
        <motion.div 
          className="text-center space-y-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary-dark font-medium text-sm border border-primary/20">
             Educacional
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900">
            Nossas <span className="text-gradient">Turmas</span>
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Programas educacionais completos para cada fase do desenvolvimento
            infantil, com atividades lúdicas e pedagógicas.
          </p>
        </motion.div>

        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {classes.map((classItem) => {
            const colors =
              colorClasses[classItem.color as keyof typeof colorClasses];

            return (
              <motion.div
                key={classItem.id}
                variants={item}
                className={`group bg-white rounded-[2rem] p-6 shadow-card hover:shadow-premium transition-all duration-300 hover:-translate-y-2 border ${colors.border} ${colors.hover} relative flex flex-col h-full`}
              >
                
                <div
                  className={`w-16 h-16 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-inner`}
                >
                  <classItem.icon className="w-8 h-8" />
                </div>

                <h3 className="font-display text-2xl font-bold text-neutral-900 mb-2">
                  {classItem.name}
                </h3>
                <p className={`text-xs font-bold mb-4 uppercase tracking-wider ${colors.text} bg-white px-2 py-1 rounded-md inline-block border ${colors.border}`}>
                  {classItem.ageRange}
                </p>

                <p className="text-neutral-500 mb-6 leading-relaxed text-sm flex-grow">
                  {classItem.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {classItem.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2 text-sm text-neutral-600"
                    >
                      <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${colors.bg.replace('50', '400')}`} />
                      {highlight}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-dashed border-neutral-200 mb-6">
                  <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1 font-semibold">
                    Horário
                  </p>
                  <p className="text-sm font-medium text-neutral-700">
                    {classItem.schedule}
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  className={`w-full group-hover:bg-gradient-to-r ${colors.gradient} group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-none`}
                >
                  <span className="flex items-center justify-center gap-2">
                    Saiba Mais
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}

