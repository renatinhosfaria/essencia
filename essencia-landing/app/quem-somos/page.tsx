"use client";

import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { motion } from "framer-motion";
import { Heart, Star, Users } from "lucide-react";
import Image from "next/image";

export default function QuemSomosPage() {
  return (
    <main>
      <PageHeader 
        title="Quem Somos" 
        description="Uma história de amor, acolhimento e compromisso com o futuro das nossas crianças."
      />

      <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary-dark font-medium text-sm border border-primary/20">
                Nossa História
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-neutral-900">
                Um sonho guiado pelo amor e pela fé
              </h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>
                  O Colégio Essência Feliz nasceu do sonho de nossa diretora, Daviane, que idealizou um espaço onde a educação fosse guiada por amor, acolhimento e valores cristãos.
                </p>
                <p>
                  Desde sua inauguração em 2013, nossa missão tem sido transformar vidas, oferecendo uma experiência educativa que vai além do aprendizado tradicional, acolhendo cada criança como única e proporcionando um ambiente verdadeiramente feliz.
                </p>
                <p>
                  Aqui, acreditamos que educar é um ato de fé e compromisso com o futuro. Nosso propósito é guiar cada criança pelo caminho da bondade, cultivando virtudes que florescem ao longo da vida.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative z-10">
                {/* Using a placeholder or existing image if available, falling back to a colored div if no specific image */}
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    {/* Ideally replace with actual image */}
                    <Image 
                        src="/images/about.png" 
                        alt="Nossa escola" 
                        fill
                        className="object-cover"
                    />
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24 bg-neutral-50">
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Acolhimento",
                description: "Ambiente seguro e afetuoso onde cada criança se sente amada e valorizada."
              },
              {
                icon: Star,
                title: "Excelência",
                description: "Proposta pedagógica focada no desenvolvimento integral e de qualidade."
              },
              {
                icon: Users,
                title: "Valores",
                description: "Educação pautada em princípios cristãos, ética e cidadania."
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{value.title}</h3>
                <p className="text-neutral-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
