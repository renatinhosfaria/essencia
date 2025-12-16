"use client";

import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { motion } from "framer-motion";
import { BookOpen, Coins, Heart, Lightbulb } from "lucide-react";

export default function ProjetosPage() {
  const projects = [
    {
      title: "Virtudes Cristãs",
      icon: Heart,
      color: "red",
      description: "Inspirado pelos princípios bíblicos, o projeto busca cultivar nas crianças virtudes que serão fundamentais para sua formação como cidadãos do bem.",
      longDescription: "Reflete nosso compromisso em oferecer uma educação que vai além do conhecimento técnico. Vivenciamos as virtudes cristãs em cada momento.",
      method: [
        "Atividades elaboradas pelas professoras",
        "Exemplificação das abordagens na rotina",
        "Rodas de conversas",
        "Músicas",
        "Contação de histórias"
      ]
    },
    {
      title: "Método Fônico",
      icon: BookOpen,
      color: "blue",
      description: "Considerado o melhor método de alfabetização, com eficácia comprovada cientificamente.",
      longDescription: "Ajuda os pequenos a entenderem a estrutura da língua, favorecendo a leitura e escrita com confiança. Aplicado de forma cuidadosa e individualizada.",
      method: [
        "Consciência Fonêmica",
        "Decodificação",
        "Leitura de Palavras",
        "Compreensão",
        "Leitura de Textos"
      ]
    },
    {
      title: "Líder Em Mim",
      icon: Lightbulb,
      color: "yellow",
      description: "Nossos pequenos são inspirados a descobrir seu próprio valor e a florescer como líderes.",
      longDescription: "As crianças aprendem a enfrentar desafios com coragem, cultivar relacionamentos saudáveis e trilhar um caminho de bondade e cidadania.",
      method: [
        "Competências Socioemocionais",
        "Pensamento científico, crítico e criativo",
        "Repertório cultural",
        "Empatia e Cooperação"
      ]
    },
    {
      title: "Educação Financeira",
      icon: Coins,
      color: "green",
      description: "Introduz, de maneira lúdica e prática, os conceitos básicos de finanças desde cedo.",
      longDescription: "Capacita os pequenos para compreenderem o valor do dinheiro e desenvolverem uma visão equilibrada sobre consumo e economia.",
      method: [
        "Atividades Interativas",
        "Conceitos básicos de finanças",
        "Matemática Financeira",
        "Uso consciente dos recursos",
        "Metas de Economia"
      ]
    }
  ];

  return (
    <main>
      <PageHeader 
        title="Nossos Projetos" 
        description="Metodologias exclusivas que enriquecem o aprendizado e a formação do caráter."
      />

      <section className="py-16 lg:py-24 bg-neutral-50">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 flex flex-col h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-${project.color}-50 flex items-center justify-center text-${project.color}-600 mb-6`}>
                  <project.icon className="w-8 h-8" />
                </div>

                <h3 className="font-display text-2xl font-bold text-neutral-900 mb-3">
                  {project.title}
                </h3>
                
                <p className="text-neutral-600 mb-4 font-medium">
                  {project.description}
                </p>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6 flex-grow">
                  {project.longDescription}
                </p>

                <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-100">
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                    Através de
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {project.method.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-neutral-700">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${project.color}-400 shrink-0`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
