"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Ana Silva",
    role: "Mãe do Pedro (3 anos)",
    content: "A Essencia Feliz transformou a adaptação do Pedro. Ele ama ir para a escola e volta todos os dias contando novidades! A equipe é simplesmente maravilhosa.",
    avatar: "👩",
    rating: 5
  },
  {
    id: 2,
    name: "Carlos Santos",
    role: "Pai da Julia (5 anos)",
    content: "Estrutura impecável e metodologia que realmente funciona. Minha filha desenvolveu muito a autonomia e a criatividade. Recomendo de olhos fechados!",
    avatar: "👨",
    rating: 5
  },
  {
    id: 3,
    name: "Mariana Costa",
    role: "Mãe do Lucas (1 ano)",
    content: "O cuidado com os bebês no berçário é tocante. Sinto uma segurança enorme em deixar meu filho com as professoras. O app de comunicação também ajuda muito!",
    avatar: "👱‍♀️",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <Container>
        <motion.div 
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block py-1 px-3 rounded-full bg-yellow-100 text-yellow-700 font-medium text-sm">
             Depoimentos
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text">
            O que dizem os <span className="text-primary">Pais</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white rounded-3xl p-8 border border-neutral/5 shadow-sm hover:shadow-lg transition-all relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-8 text-6xl text-primary/10 font-serif leading-none">
                "
              </div>

              <div className="flex gap-1 mb-6 text-yellow-400">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>

              <p className="text-text/70 mb-8 leading-relaxed italic relative z-10">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-2xl border-2 border-white shadow-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-text">{testimonial.name}</h4>
                  <p className="text-sm text-text/50">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
