'use client';

import { Deck } from '@/components/presentation/Deck';
import { IntroSlide } from '@/components/slides/01-Intro';
import { MotivacaoPessoalSlide } from '@/components/slides/02-MotivacaoPessoal';
import { MotivacaoEssenciaSlide } from '@/components/slides/03-MotivacaoEssencia';
import { SolutionSlide } from '@/components/slides/04-Solution';
import { ModelSlide } from '@/components/slides/05-Model';
import { PlanoImplementacaoSlide } from '@/components/slides/06-PlanoImplementacao';
import { CTASlide } from '@/components/slides/07-CTA';

export default function Home() {
  return (
    <Deck>
      <IntroSlide />
      <MotivacaoPessoalSlide />
      <MotivacaoEssenciaSlide />
      <SolutionSlide />
      <ModelSlide />
      <PlanoImplementacaoSlide />
      <CTASlide />
    </Deck>
  );
}
