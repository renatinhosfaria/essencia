"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { GraduationCap, Heart, Smile, Users } from "lucide-react";
import Image from "next/image";

const stats = [
  {
    value: "15",
    suffix: " Anos",
    label: "De excelência em educação",
    icon: GraduationCap,
  },
  {
    value: "200",
    suffix: "+",
    label: "Crianças felizes aprendendo",
    icon: Smile,
  },
  {
    value: "25",
    suffix: "",
    label: "Professores especialistas",
    icon: Users,
  },
  {
    value: "98",
    suffix: "%",
    label: "Satisfação dos pais",
    icon: Heart,
  },
];

const values = [
  {
    icon: "🤗",
    title: "Cuidado Individual",
    description:
      "Cada criança é única e recebe atenção personalizada para seu desenvolvimento pleno e feliz.",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: "🎨",
    title: "Aprendizado Lúdico",
    description:
      "Educação através de brincadeiras, arte e atividades criativas que estimulam a imaginação.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: "🛡️",
    title: "Segurança Total",
    description:
      "Ambiente monitorado em tempo integral com equipe treinada para garantir a segurança absoluta.",
    color: "bg-green-100 text-green-600",
  },
];

export function About() {
  return (
    <section id="sobre" className="py-20 md:py-32 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 bg-neutral-50/50">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          {/* Text Content */}
          <motion.div 
            className="space-y-10"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <div className="inline-block py-1 px-3 rounded-full bg-secondary/10 border border-secondary/20 text-secondary-foreground font-medium text-sm">
                 Nossa História
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
                Sobre a <span className="text-gradient-secondary">Essencia Feliz</span>
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Há mais de 15 anos, a Essencia Feliz é referência em educação
                infantil, oferecendo um ambiente acolhedor onde cada criança
                pode crescer, aprender e ser feliz.
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Nossa missão é proporcionar uma educação de excelência,
                combinando atividades pedagógicas com muito carinho, segurança e
                respeito à individualidade de cada aluno. Acreditamos que brincar é a forma mais séria de aprender.
              </p>
            </div>

            {/* Values Grid */}
            <div className="space-y-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-card hover:shadow-premium transition-all duration-300 flex items-start gap-5 border border-neutral-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner ${value.color}`}>
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 text-xl mb-2">{value.title}</h3>
                    <p className="text-neutral-500 leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div 
            className="relative order-first lg:order-last"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 ring-8 ring-white">
              <Image
                src="/images/about.png"
                alt="Ambiente escolar Essencia Feliz"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 text-white p-6 backdrop-blur-md bg-white/10 rounded-2xl border border-white/20">
                <p className="font-medium text-lg italic">"Educar a mente sem educar o coração não é educação."</p>
                <div className="flex items-center gap-2 mt-3 opacity-90">
                    <div className="w-8 h-1 bg-primary rounded-full" />
                    <p className="text-sm font-semibold uppercase tracking-wider">Aristóteles</p>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-60" />
            <div className="absolute -z-10 -bottom-12 -left-12 w-64 h-64 bg-secondary/20 rounded-full blur-3xl opacity-60" />
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative p-6 rounded-3xl bg-white shadow-card hover:shadow-premium transition-all duration-300 group border border-neutral-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
            >
              <div className="absolute -right-4 -top-4 opacity-5 text-9xl font-bold text-neutral-900 group-hover:opacity-10 transition-opacity select-none pointer-events-none">
                {index + 1}
              </div>
              
              <stat.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              
              <div className="font-display text-4xl lg:text-5xl font-bold text-neutral-900 mb-2">
                {stat.value}
                <span className="text-2xl text-secondary ml-1">{stat.suffix}</span>
              </div>
              <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

