"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description?: string;
  imageSrc?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section className="relative pt-32 pb-12 lg:pt-48 lg:pb-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] opacity-40 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[60px] opacity-40 -translate-x-1/3 translate-y-1/3" />
      </div>

      <Container>
        <motion.div 
          className="text-center max-w-3xl mx-auto space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900">
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-neutral-600 leading-relaxed font-medium">
              {description}
            </p>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
