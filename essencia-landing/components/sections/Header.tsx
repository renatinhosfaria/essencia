"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LoginModal } from "@/components/ui/LoginModal";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { label: "Quem Somos", href: "/quem-somos" },
    { label: "Turmas", href: "/turmas" },
    { label: "Projetos", href: "/projetos" },
    { label: "Contato", href: "/contato" },
  ];

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "glass-panel py-3 shadow-premium"
            : "bg-transparent py-6"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Container>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group relative z-10">
              <Image 
                src="/images/logo.png" 
                alt="Essencia Feliz" 
                width={240} 
                height={80} 
                className="h-16 md:h-20 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 bg-white/50 px-6 py-2 rounded-full border border-white/50 backdrop-blur-sm shadow-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors relative group"
                >
                   {link.label}
                   <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Button 
                size="sm" 
                onClick={() => setIsLoginModalOpen(true)}
                className="shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 rounded-full px-6"
              >
                Portal do Aluno
              </Button>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center text-neutral-800 rounded-full hover:bg-neutral-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </Container>
      </motion.header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={scrollToSection}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />
    </>
  );
}

