"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { ArrowRight, Heart, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center pt-28 pb-12 lg:pt-36 lg:pb-32 overflow-hidden bg-gradient-to-br from-background via-background to-neutral-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-60 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[100px] opacity-60 -translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px] opacity-40 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <motion.div 
            className="space-y-8 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary-foreground font-semibold text-sm backdrop-blur-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                  </span>
                  Matrículas Abertas 2025
                </span>
              </motion.div>
              
              <motion.h1 
                className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-neutral-900 leading-[1.1] tracking-tight"
                variants={itemVariants}
              >
                Onde seu filho{" "}
                <span className="text-gradient">
                  cresce feliz
                </span>
                {" "}e seguro
              </motion.h1>
              
              <motion.p 
                className="text-lg sm:text-xl text-neutral-500 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                variants={itemVariants}
              >
                Educação infantil com carinho, dedicação e excelência pedagógica. 
                Prepare seu pequeno para um futuro brilhante em um ambiente acolhedor.
              </motion.p>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={itemVariants}
            >
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all">
                Agende uma Visita
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg rounded-full hover:bg-neutral-50 gap-2 group"
                onClick={() => scrollToSection("sobre")}
              >
                Conheça a Escola
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="flex flex-wrap gap-x-8 gap-y-4 justify-center lg:justify-start pt-6 border-t border-neutral-200"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-neutral-900">Segurança Total</p>
                  <p className="text-neutral-500">Monitoramento 24h</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                  <Star className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-neutral-900">Ensino de Excelência</p>
                  <p className="text-neutral-500">Metodologia comprovada</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            className="relative perspective-1000"
            initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative z-10 aspect-[4/5] md:aspect-square lg:aspect-[4/5] xl:aspect-square">
              <Image 
                src="/images/hero.png" 
                alt="Criança feliz brincando na escola Essencia Feliz"
                fill
                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>

            {/* Decorative Elements around image */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-secondary opacity-20 rounded-[3.5rem] blur-2xl -z-10" />

            {/* Floating Badges */}
            <motion.div 
              className="absolute top-10 -right-6 md:-right-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-premium p-4 z-20 max-w-[200px]"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="font-bold text-neutral-900 leading-tight">Melhor Avaliada</p>
                  <p className="text-xs text-neutral-500">Pelos pais da região</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute bottom-10 -left-6 md:-left-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-premium p-4 z-20"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.4, type: "spring" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="font-bold text-neutral-900 text-lg">200+</p>
                  <p className="text-xs text-neutral-500">Alunos Felizes</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

