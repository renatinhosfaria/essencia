import { About } from "@/components/sections/About";
import { Classes } from "@/components/sections/Classes";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Testimonials } from "@/components/sections/Testimonials";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Classes />
      <Testimonials />
      <Contact />
    </main>
  );
}
