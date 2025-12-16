"use client";

import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { motion } from "framer-motion";
import { Baby, BookOpen, Clock, Palette } from "lucide-react";

export default function TurmasPage() {
  const sections = [
    {
      id: "bercario",
      title: "Berçário",
      icon: Baby,
      color: "blue",
      content: [
        "O Colégio Essência Feliz é muito mais do que um lugar onde oferece os cuidados básicos aos bebês enquanto seus pais trabalham.",
        "Em todas as etapas do dia, desde o acolhimento na chegada, as trocas de fraldas, alimentação, atividades de estímulo e recreativas, nossos profissionais estão atentas aos interesses e necessidades individuais das crianças, acolhendo-os com muito carinho e atenção."
      ],
      schedule: ["6 horas diárias", "8 horas diárias", "10 horas diárias"]
    },
    {
      id: "infantil",
      title: "Ensino Infantil",
      icon: Palette,
      color: "green",
      content: [
        "Durante esse processo criamos oportunidade para que os alunos tenham consciência dos sons das palavras, frases, sílabas e fonemas como unidades separadas e saibam reconhecê-las para ler e escrever de forma espontânea e com segurança."
      ]
    },
    {
      id: "fundamental",
      title: "Ensino Fundamental 1",
      icon: BookOpen,
      color: "orange",
      content: [
        "Ciente da importância das principais habilidades a serem adquiridas na educação infantil como o desenvolvimento afetivo e social, da coordenação motora grossa e fina e da linguagem, temos um projeto pedagógico que promove atividades lúdicas com foco nas habilidades sociais e intelectuais.",
        "Nessa etapa trabalhamos a consciência fonoaudióloga através de brincadeiras e jogos sonoros em que a criança se apropria dos sons das palavras que ouve, preparando-as para alfabetização."
      ]
    }
  ];

  return (
    <main>
      <PageHeader 
        title="Nossas Turmas" 
        description="Programas educacionais completos para cada fase do desenvolvimento infantil."
      />

      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="space-y-20">
            {sections.map((section, index) => (
              <motion.div 
                key={section.id}
                className={`grid lg:grid-cols-12 gap-8 items-start ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Icon Column */}
                <div className={`lg:col-span-2 flex justify-center lg:justify-start ${index % 2 === 1 ? 'lg:order-last lg:justify-end' : ''}`}>
                  <div className={`w-20 h-20 rounded-2xl bg-${section.color}-50 flex items-center justify-center text-${section.color}-600 shadow-sm`}>
                    <section.icon className="w-10 h-10" />
                  </div>
                </div>

                {/* Content Column */}
                <div className={`lg:col-span-10 bg-neutral-50 rounded-3xl p-8 lg:p-10 border border-neutral-100`}>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-neutral-900 mb-6">
                    {section.title}
                  </h2>
                  <div className="space-y-4 text-neutral-600 leading-relaxed mb-8">
                    {section.content.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>

                  {section.schedule && (
                    <div className="bg-white rounded-xl p-6 border border-neutral-100 shadow-sm inline-block">
                      <div className="flex items-center gap-2 mb-3 text-neutral-900 font-bold">
                        <Clock className="w-5 h-5 text-primary" />
                        <span>Opções de Horário</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {section.schedule.map((time) => (
                          <span key={time} className="px-3 py-1 bg-primary/10 text-primary-dark text-sm font-medium rounded-full">
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
