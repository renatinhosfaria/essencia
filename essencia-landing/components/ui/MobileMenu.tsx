"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
  onOpenLogin: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  onNavigate,
  onOpenLogin,
}: MobileMenuProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavClick = (id: string) => {
    onNavigate(id);
    onClose();
  };

  const handleLoginClick = () => {
    onOpenLogin();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-text/10">
            <Link href="/" onClick={onClose}>
              <span className="font-heading font-bold text-2xl text-primary">
                Essencia Feliz
              </span>
            </Link>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-text/5 flex items-center justify-center transition-colors"
              aria-label="Fechar menu"
            >
              <svg
                className="w-6 h-6 text-text/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            <button
              onClick={() => handleNavClick("sobre")}
              className="w-full text-left px-4 py-3 rounded-lg text-text hover:bg-primary/5 hover:text-primary transition-colors font-medium"
            >
              Sobre
            </button>
            <button
              onClick={() => handleNavClick("turmas")}
              className="w-full text-left px-4 py-3 rounded-lg text-text hover:bg-primary/5 hover:text-primary transition-colors font-medium"
            >
              Turmas
            </button>
            <button
              onClick={() => handleNavClick("contato")}
              className="w-full text-left px-4 py-3 rounded-lg text-text hover:bg-primary/5 hover:text-primary transition-colors font-medium"
            >
              Contato
            </button>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-text/10">
            <Button className="w-full" onClick={handleLoginClick}>
              Portal do Aluno
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
