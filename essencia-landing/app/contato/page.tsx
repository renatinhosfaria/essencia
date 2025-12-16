"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContatoPage() {
  return (
    <main>
      <PageHeader 
        title="Fale Conosco" 
        description="Estamos prontos para atender você e tirar todas as suas dúvidas."
      />

      <section className="py-16 lg:py-24 bg-white relative">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h3 className="font-display text-2xl font-bold text-neutral-900 mb-6">
                  Informações de Contato
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-neutral-50 border border-neutral-100 transition-colors hover:bg-neutral-100">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary-dark shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900 mb-1">Telefone</p>
                      <p className="text-neutral-600">(34) 3292-7388</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-neutral-50 border border-neutral-100 transition-colors hover:bg-neutral-100">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary-dark shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900 mb-1">Endereço</p>
                      <p className="text-neutral-600">
                        R Lourdes De Carvalho, 1212 <br />
                        Santa Mônica, Uberlândia - MG
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-neutral-50 border border-neutral-100 transition-colors hover:bg-neutral-100">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent-dark shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900 mb-1">E-mail</p>
                      <p className="text-neutral-600">espacofelizuberlandia@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Embed or Placeholder */}
              <div className="aspect-video rounded-3xl overflow-hidden bg-neutral-200 shadow-inner">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.249272378945!2d-48.261299923968605!3d-18.917154982255677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94a445a4916a0c5b%3A0xe6555c4d2923f7d6!2sR.%20Lourdes%20de%20Carvalho%2C%201212%20-%20Santa%20M%C3%B4nica%2C%20Uberl%C3%A2ndia%20-%20MG%2C%2038408-274!5e0!3m2!1spt-BR!2sbr!4v1709123456789!5m2!1spt-BR!2sbr" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-card border border-neutral-100 relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-display text-2xl font-bold text-neutral-900 mb-2">
                Envie uma mensagem
              </h3>
              <p className="text-neutral-600 mb-8">
                Preencha o formulário abaixo e entraremos em contato o mais breve possível.
              </p>

              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">Nome Completo</label>
                  <input 
                    type="text" 
                    id="name"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">E-mail</label>
                  <input 
                    type="email" 
                    id="email"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">Telefone</label>
                  <input 
                    type="tel" 
                    id="phone"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    placeholder="(34) 99999-9999"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">Mensagem</label>
                  <textarea 
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none"
                    placeholder="Como podemos ajudar?"
                  />
                </div>
                
                <Button className="w-full py-6 text-lg rounded-xl mt-4 shadow-lg shadow-primary/20">
                  Enviar Mensagem
                </Button>
              </form>
            </motion.div>
          </div>
        </Container>
      </section>
    </main>
  );
}
