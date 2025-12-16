import { Container } from "@/components/ui/Container";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-100 pt-16 pb-8 mt-auto">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Col 1: Logo */}
          <div className="flex flex-col items-start">
            <div className="relative h-24 w-48 mb-4">
              <Image
                src="/logo.png"
                alt="Colégio Essência Feliz"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-secondary font-bold tracking-widest text-xs ml-1 uppercase">
              Colégio Essência Feliz
            </p>
          </div>

          {/* Col 2: Atendimento */}
          <div>
            <h3 className="text-secondary font-bold text-xl mb-6">Atendimento</h3>
            <div className="flex items-center gap-2 text-neutral-500 text-sm mb-6">
              <Clock className="h-4 w-4 shrink-0" />
              <span>09h às 17h Segunda à Sexta</span>
            </div>
            
            {/* Progress Bar styled element */}
            <div className="h-1.5 w-full bg-neutral-200 rounded-full mb-8 max-w-[200px]">
              <div className="h-full w-1/2 bg-success rounded-full" />
            </div>

            <h3 className="text-secondary font-bold text-xl mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <Link href="#" className="bg-neutral-800 text-white p-2 rounded-md hover:bg-secondary transition-colors">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="bg-neutral-800 text-white p-2 rounded-md hover:bg-secondary transition-colors">
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Col 3: Institucional */}
          <div>
            <h3 className="text-secondary font-bold text-xl mb-6">Institucional</h3>
            <ul className="space-y-3 text-neutral-500 text-sm">
              <li><Link href="/" className="hover:text-secondary transition-colors">Home</Link></li>
              <li><Link href="/quem-somos" className="hover:text-secondary transition-colors">Quem Somos</Link></li>
              <li><Link href="/turmas" className="hover:text-secondary transition-colors">Turmas</Link></li>
              <li><Link href="/projetos" className="hover:text-secondary transition-colors">Projetos</Link></li>
              <li><Link href="/politica-privacidade" className="hover:text-secondary transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>

          {/* Col 4: Contato */}
          <div>
            <h3 className="text-secondary font-bold text-xl mb-6">Contato</h3>
            <ul className="space-y-4 text-neutral-500 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>(34) 3292-7388</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-1" />
                <span>R Lourdes De Carvalho, 1212 - Santa Mônica, Uberlândia - MG</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>espacofelizuberlandia@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
          <p>
            © {new Date().getFullYear()} Colégio Essência Feliz. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-secondary transition-colors">Privacidade</Link>
            <Link href="#" className="hover:text-secondary transition-colors">Termos</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
