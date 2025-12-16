---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
inputDocuments:
  - "docs/prd.md"
  - "docs/analysis/product-brief-Essencia-2025-12-11.md"
  - "Pesquisa Digital Colégio Essência Feliz.pdf"
  - "Logo.jpeg"
workflowType: "ux-design"
lastStep: 13
status: "complete"
project_name: "Essencia"
user_name: "Renato"
date: "2025-12-12"
---

# UX Design Specification - Essencia

**Author:** Renato
**Date:** 2025-12-12

---

## Brand Identity (Colégio Essência Feliz)

### Color Palette

| Tipo           | Cor         | Hex       | Uso                                 |
| -------------- | ----------- | --------- | ----------------------------------- |
| **Primária**   | Verde Lima  | `#CEDE6C` | Destaque, CTAs, elementos positivos |
| **Primária**   | Laranja     | `#F29131` | Ação, energia, notificações         |
| **Secundária** | Cinza       | `#9FA1A4` | Texto secundário, bordas, fundos    |
| **Neutro**     | Branco      | `#FFFFFF` | Fundos, cards                       |
| **Neutro**     | Preto suave | `#333333` | Texto principal                     |

### Typography

| Elemento               | Fonte | Peso           | Tamanho        |
| ---------------------- | ----- | -------------- | -------------- |
| **Títulos**            | Inter | Bold (700)     | 24-32px        |
| **Subtítulos**         | Inter | SemiBold (600) | 18-20px        |
| **Corpo**              | Inter | Regular (400)  | 14-16px        |
| **Legendas**           | Inter | Regular (400)  | 12px           |
| **Acessível (idosos)** | Inter | Medium (500)   | 18-20px mínimo |

### Brand Voice & Tone

| Característica       | Descrição                                                        |
| -------------------- | ---------------------------------------------------------------- |
| **Acolhedor**        | Linguagem carinhosa: "amor", "acolhimento", "carinho", "sorriso" |
| **Valores Cristãos** | Ética, moral, "virtudes", "bondade", "respeito", "integridade"   |
| **Institucional**    | Segurança, profissionalismo, parceria escola-família             |

### Slogans & Taglines

| Tipo           | Texto                                            |
| -------------- | ------------------------------------------------ |
| **Principal**  | "Uma escola de valores e princípios Cristãos"    |
| **Descritivo** | "Berçário, Infantil e Fundamental em Uberlândia" |
| **Missão**     | "Guiar cada criança pelo caminho da bondade"     |

### Visual Elements

| Elemento        | Descrição                                                          |
| --------------- | ------------------------------------------------------------------ |
| **Logo**        | Logo oficial do Colégio Essência Feliz                             |
| **Iconografia** | Ícones numéricos e ilustrativos (Projeto Virtudes, Inglês, Ballet) |
| **Fotografia**  | Ambiente escolar, alunos em atividades, expressões de felicidade   |
| **Símbolos**    | Projeto Virtudes Cristãs, programa "O Líder em Mim"                |

---

## Executive Summary

### Project Vision

O Essencia é um aplicativo de comunicação escolar white-label para o Colégio Essência Feliz (Uberlândia/MG). O objetivo é substituir o AgendaEdu com um sistema 100% personalizado que reflita os valores da escola: acolhimento, princípios cristãos e parceria família-escola.

A experiência de usuário deve transmitir **calor humano através da tecnologia** - cada interação deve fazer pais e professores sentirem que estão mais conectados, não mais distantes.

### Target Users

**Usuário Primário: Responsáveis (Marina, Seu João)**

- Necessidade: Saber o que acontece na escola sem precisar ligar
- Contexto: Usa principalmente no celular, durante pausas no trabalho
- Expectativa: Ver informações em no máximo 3 toques
- Desafio: Seu João (68 anos) precisa de interface ultra-acessível

**Usuário Criador: Professores (Carla)**

- Necessidade: Registrar o dia a dia sem burocracia
- Contexto: Usa entre atividades, com turma presente
- Expectativa: Preencher diário em menos de 5 minutos
- Desafio: Celular às vezes antigo, precisa funcionar leve

**Usuário Admin: Direção e Secretaria (Daviane, Ana)**

- Necessidade: Visibilidade e controle total
- Contexto: Usa no computador durante horário comercial
- Expectativa: Saber quem está usando, métricas de engajamento
- Desafio: Cadastros em massa no início do ano

### Key Design Challenges

1. **Acessibilidade Universal**: Design que funcione para Seu João (68) e Marina (34) sem modos separados
2. **Velocidade de Interação**: Professores têm segundos entre atividades, não minutos
3. **Identidade Visual Forte**: App deve parecer "do colégio", não genérico
4. **Trust by Design**: Pais precisam sentir que a comunicação é segura e confiável
5. **Onboarding Diferenciado**: Usuários recebem credenciais da escola, não se cadastram

### Design Opportunities

1. **Conexão Emocional**: Usar o tom acolhedor da escola em toda comunicação do sistema
2. **Progressive Disclosure**: Mostrar apenas o essencial, revelar complexidade conforme necessário
3. **Celebração de Momentos**: Animações sutis quando há interação positiva (medalha, foto postada)
4. **Smart Defaults**: Prever o que o usuário quer fazer baseado em horário e perfil
5. **Zero Learning Curve**: Se Seu João consegue usar, todos conseguem

---

## Core User Experience

### Defining Experience

**Core Action:** Ver/Criar o Diário do Aluno

O diário é o coração do Essencia. É a ação que:

- Pais fazem diariamente (ver)
- Professores fazem diariamente (criar)
- Define o valor percebido do app
- Gera engajamento recorrente

Toda a UX deve convergir para tornar o diário a experiência mais fluida e satisfatória possível.

### Platform Strategy

| Plataforma            | Prioridade | Interação     |
| --------------------- | ---------- | ------------- |
| Android App (Nativo)  | 🔴 MVP     | Touch-first   |
| iOS App (Nativo)      | 🔴 MVP     | Touch-first   |
| Landing Page (Web)    | 🔴 MVP     | Responsivo    |
| Admin Dashboard (Web) | 🟡 Growth  | Mouse/teclado |

**Capacidades Nativas:**

- Push Notifications via FCM
- Acesso à câmera para fotos
- Biometria para login rápido
- Cache offline para leitura

### Effortless Interactions

**Regra dos 10 Segundos:** Toda tarefa crítica deve ser completável em 10 segundos ou menos.

| Tarefa            | Fluxo Ideal                                       |
| ----------------- | ------------------------------------------------- |
| Ver diário do dia | Home → Toque no card = 1 interação                |
| Preencher diário  | Turma → Aluno → Preencher → Enviar = 4 interações |
| Ler mensagem      | Notificação → Toque = 1 interação                 |
| Postar foto       | Mural → Câmera → Enviar = 3 interações            |

### Critical Success Moments

1. **Primeiro Login:** Troca de senha provisória + visualização dos dados do filho em menos de 2 minutos
2. **Primeira Push:** Notificação chega em < 5 segundos, usuário percebe que "funciona de verdade"
3. **Primeiro Diário:** Professor percebe que é mais rápido que a caderneta física
4. **Demo Daviane:** Identidade visual impecável, funcionalidades fluindo

### Experience Principles

1. **Diário First:** A navegação converge para o diário - é o centro gravitacional do app
2. **Touch de Avô:** Acessibilidade universal - se um idoso de 68 anos consegue usar, todos conseguem
3. **Identidade Escolar:** Verde Lima (#CEDE6C) + Laranja (#F29131) presentes em toda UI, tom acolhedor
4. **10 Segundos Rule:** Qualquer tarefa core deve ser completável em 10 segundos
5. **Celebrar Conexão:** Feedback visual positivo em cada interação que conecta escola e família

---

## Desired Emotional Response

### Primary Emotional Goals

**Emoção Central:** "Conexão através do cuidado"

| Usuário       | Emoção Primária         | Frase de Sucesso                                   |
| ------------- | ----------------------- | -------------------------------------------------- |
| Responsáveis  | Tranquilidade + Conexão | "Sei que meu filho está bem e me sinto perto dele" |
| Professores   | Realização              | "Meu trabalho de cuidado é visto e valorizado"     |
| Administração | Orgulho + Controle      | "Este sistema é a cara da nossa escola"            |

### Emotional Journey Mapping

| Momento             | Emoção Desejada                  |
| ------------------- | -------------------------------- |
| Primeiro acesso     | Surpresa positiva ("Que fácil!") |
| Receber notificação | Curiosidade acolhedora           |
| Ver diário          | Gratidão e alívio                |
| Ver foto            | Alegria e conexão                |
| Chat com escola     | Segurança e confiança            |
| Erro/problema       | Compreensão (não frustração)     |
| Retorno ao app      | Familiaridade                    |

### Micro-Emotions

**Cultivar:** Confiança, Pertencimento, Competência, Cuidado, Alegria

**Evitar:** Ansiedade, Isolamento, Frustração, Frieza, Indiferença

### Design Implications

| Emoção Desejada | Decisão de Design                       |
| --------------- | --------------------------------------- |
| Tranquilidade   | Cores suaves, espaço em branco generoso |
| Conexão         | Fotos grandes, previews em notificações |
| Realização      | Status de leitura visível (✓✓)          |
| Orgulho         | Branding escolar proeminente            |
| Eficiência      | Formulários mínimos, templates          |

### Emotional Design Principles

1. **Warmth First:** Tom acolhedor em toda comunicação do sistema
2. **No Anxiety:** Status sempre claro e visível
3. **Celebrate Connection:** Micro-animações em momentos de conexão
4. **Gentle Errors:** Mensagens de erro com empatia
5. **Visual Warmth:** Paleta que transmite calor (verde lima + laranja)

### UX Writing Guidelines

| Situação      | Tom Essencia                                |
| ------------- | ------------------------------------------- |
| Boas-vindas   | "Que bom ter você aqui! 💚"                 |
| Diário novo   | "📝 O dia do [nome] foi especial!"          |
| Erro de login | "Hmm, algo não bateu. Quer tentar de novo?" |
| Foto postada  | "📸 Momento capturado! Os pais vão adorar"  |
| Mensagem lida | "✓✓ Lido por [nome]"                        |

---

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

| App              | Categoria      | Pontos Fortes UX                                        |
| ---------------- | -------------- | ------------------------------------------------------- |
| **WhatsApp**     | Comunicação    | Padrão mental estabelecido, read receipts, simplicidade |
| **ClassDojo**    | Educacional    | Comunicação escola-família, fotos do dia, relatórios    |
| **Duolingo**     | Gamificação    | Micro-celebrações, streaks, notificações inteligentes   |
| **Notion**       | Produtividade  | UI limpa, gestos modernos, dark mode, blocks            |
| **Apple Health** | Dados Pessoais | Visualização elegante, privacidade, cards informativos  |

### Transferable UX Patterns

#### Navigation Patterns

- **Bottom Tab Navigation** (Instagram/WhatsApp) → Nav principal com máx 5 tabs
- **Floating Action Button** (Material 3) → Ação "Novo Post" sempre acessível
- **Pull-to-Refresh** (Twitter) → Atualizar feed do diário
- **Swipe Actions** (Apple Mail) → Arquivar/marcar notificações
- **Bottom Sheet Modals** (Apple Maps) → Detalhes e filtros

#### Interaction Patterns

- **Skeleton Loading** → Carregamento elegante de fotos
- **Haptic Feedback** → Confirmação tátil de ações
- **Lottie Animations** → Estados vazios, celebrações
- **Shared Element Transitions** → Abrir foto em tela cheia
- **Spring Animations** → Bounce natural em cards e botões

#### Visual Patterns

- **Glassmorphism sutil** → Headers com blur, cards transparentes
- **Avatar Stacks** → Mostrar quem visualizou posts
- **Progress Rings** → Conclusão de tarefas e leituras
- **Rich Notifications** → Notificações com foto do diário

#### Communication Patterns

- **Read Receipts** (WhatsApp) → ✓✓ azul quando lido
- **Reactions** (Slack) → ❤️ 👏 em posts do diário
- **Typing Indicator** → "Escola está digitando..."
- **Voice Notes** → Recados em áudio

### Anti-Patterns to Avoid

| Anti-Padrão            | Problema             | Solução Moderna                |
| ---------------------- | -------------------- | ------------------------------ |
| Splash Screen longo    | Frustração inicial   | Skeleton + lazy load           |
| Modais excessivos      | Interrompe fluxo     | Bottom sheets inline           |
| Formulários longos     | Abandono             | Progressive disclosure         |
| Loading spinners       | Lentidão percebida   | Optimistic UI                  |
| Notificações genéricas | São ignoradas        | Rich notifications com preview |
| Gamificação agressiva  | Conflita com valores | Celebrações sutis              |
| Dark patterns          | Quebra confiança     | Transparência total            |
| Excesso de configs     | Complexidade         | Defaults inteligentes          |

### Design Inspiration Strategy

#### Stack de UI/UX Recomendada

**Mobile (React Native)**

- **UI Framework:** Tamagui ou NativeWind (Tailwind)
- **Animações:** Reanimated 3 + Moti + Lottie
- **Gestos:** Gesture Handler + @gorhom/bottom-sheet
- **Listas:** @shopify/flash-list (performance)
- **Imagens:** expo-image (cache otimizado)

**Web Admin (React/Next.js)**

- **UI Components:** shadcn/ui (Radix + Tailwind)
- **Animações:** Framer Motion
- **Tabelas:** TanStack Table
- **Gráficos:** Tremor ou Recharts

#### Motion Design Guidelines

| Tipo              | Duração    | Easing      |
| ----------------- | ---------- | ----------- |
| Micro-interação   | 200-300ms  | ease-out    |
| Transição de tela | 300-400ms  | ease-in-out |
| Celebração        | 800-1200ms | spring      |
| Stagger em lista  | 50ms/item  | ease-out    |

#### O Que Adotar

- WhatsApp-like messaging (pais já dominam)
- Instagram Stories UX (consumo rápido de fotos)
- Duolingo celebrations (reforço positivo sutil)
- Apple-style blur headers (modernidade)
- Material 3 color system (temas dinâmicos)

#### O Que Adaptar

- ClassDojo points → "Conquistas" sem competição
- Notion blocks → Cards de conteúdo estruturado
- LinkedIn feed → Timeline mais visual

#### O Que Evitar

- Gamificação agressiva (foco é conexão)
- Dark patterns (valores cristãos = transparência)
- Complexidade de enterprise (simplicidade é chave)

---

## Design System Foundation

### Design System Choice

**Mobile:** Tamagui (React Native)
**Web Admin:** shadcn/ui (Next.js + Radix + Tailwind)
**Consistência:** Design tokens compartilhados via JSON

### Rationale for Selection

| Critério           | Tamagui + shadcn/ui                         |
| ------------------ | ------------------------------------------- |
| **Performance**    | Compilação estática, zero-runtime CSS       |
| **Customização**   | 100% controle sobre código dos componentes  |
| **Marca Essencia** | Tokens personalizados (verde lima, laranja) |
| **Animações**      | Reanimated 3 nativo, não JS bridge          |
| **Acessibilidade** | Radix (web) + WCAG compliance               |
| **Modernidade**    | Stack mais adotada 2024/2025                |
| **DX**             | TypeScript first, autocomplete de tokens    |

### Implementation Approach

#### Mobile Stack (React Native + Expo)

| Categoria    | Biblioteca                       |
| ------------ | -------------------------------- |
| UI Framework | Tamagui                          |
| Navegação    | expo-router (file-based)         |
| Animações    | react-native-reanimated 3 + moti |
| Gestos       | react-native-gesture-handler     |
| Bottom Sheet | @gorhom/bottom-sheet             |
| Listas       | @shopify/flash-list              |
| Imagens      | expo-image                       |
| Ícones       | lucide-react-native              |
| Forms        | react-hook-form + zod            |
| State        | Zustand + TanStack Query         |

#### Web Admin Stack (Next.js 14+)

| Categoria     | Biblioteca               |
| ------------- | ------------------------ |
| UI Components | shadcn/ui                |
| Styling       | Tailwind CSS             |
| Animações     | Framer Motion            |
| Tabelas       | TanStack Table           |
| Gráficos      | Tremor                   |
| Forms         | react-hook-form + zod    |
| State         | Zustand + TanStack Query |

### Customization Strategy

#### Design Tokens (compartilhados)

```json
{
  "colors": {
    "primary": {
      "verde": "#CEDE6C",
      "laranja": "#F29131"
    },
    "neutral": {
      "gray": "#9FA1A4",
      "white": "#FFFFFF",
      "black": "#333333"
    }
  },
  "typography": {
    "fontFamily": "Inter",
    "scale": [12, 14, 16, 18, 20, 24, 32, 40]
  },
  "spacing": [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64],
  "radii": {
    "sm": 4,
    "md": 8,
    "lg": 12,
    "xl": 16,
    "full": 9999
  }
}
```

#### Componentes Customizados Essencia

| Componente            | Descrição                                  |
| --------------------- | ------------------------------------------ |
| **DiaryCard**         | Card de post do diário com foto, reactions |
| **StudentAvatar**     | Avatar com indicador de status             |
| **NotificationBadge** | Badge com animação pulse                   |
| **ReadReceipt**       | ✓✓ com estados (enviado, lido)             |
| **EmptyState**        | Ilustração Lottie + CTA                    |
| **PhotoCarousel**     | Stories-like com gestos                    |
| **MessageBubble**     | Bolha de chat estilo WhatsApp              |

---

## Core User Experience (Defining Experience)

### Defining Experience Statement

> **"Ver o dia do meu filho em 10 segundos"**
>
> O pai abre o app → vê foto/momento do dia → sente conexão → fecha feliz

Esta é a interação central que define o Essencia. Se acertarmos isso, todo o resto segue naturalmente.

### User Mental Model

| Modelo Mental              | Expectativa do Usuário         |
| -------------------------- | ------------------------------ |
| "Quero saber do meu filho" | Abrir e ver foto imediatamente |
| "Aconteceu algo?"          | Notificação com preview        |
| "Está tudo bem?"           | Ver rosto sorrindo             |
| "Preciso responder?"       | Não obrigatório, só consumir   |

**Referências Mentais:**

- WhatsApp: Imediatismo, ✓✓ confirmação
- Instagram: Feed visual, Stories
- Fotos do iPhone: Galeria do dia

### Success Criteria

| Métrica             | Target         | Justificativa            |
| ------------------- | -------------- | ------------------------ |
| Time to First Photo | < 3 segundos   | Gratificação instantânea |
| Daily Open Rate     | > 70%          | Hábito formado           |
| Photo View Rate     | > 95%          | Conteúdo relevante       |
| Session Duration    | 30-90 segundos | Eficiente, não viciante  |
| Weekly Active Users | > 85%          | Engajamento sustentado   |

### Novel UX Patterns

| Padrão                | Tipo        | Descrição                              |
| --------------------- | ----------- | -------------------------------------- |
| **Diário First**      | Novel       | App abre direto no diário, não em menu |
| **Momento do Dia**    | Novel       | Destaque visual da melhor foto         |
| **10 Segundos Rule**  | Novel       | Toda ação principal < 10 segundos      |
| Bottom Tab Navigation | Established | Padrão iOS/Android                     |
| Pull-to-Refresh       | Established | Atualizar feed                         |
| Read Receipts (✓✓)    | Established | WhatsApp pattern                       |

### Experience Mechanics

#### Flow: "Ver o dia do meu filho"

**1. Initiation**

- Push notification com preview da foto
- Trigger: "📸 Novo momento de [João] no diário!"
- Ou: Abre app por hábito (mesmo horário)

**2. Interaction**

- Tap na notificação → abre direto na foto
- App sempre abre no Diário (Diário First)
- Swipe horizontal = próxima foto
- Pinch = zoom | Long press = menu

**3. Feedback**

- Skeleton → foto (< 1 segundo)
- Haptic feedback no swipe
- ❤️ anima ao reagir (Lottie)
- "Visto" marca para escola

**4. Completion**

- Badge some do ícone Diário
- Micro-celebração: "Dia completo! 💚"
- Sugestão: "Enviar para vovó?"
- Usuário fecha satisfeito

#### Micro-Interações

| Momento      | Ação       | Feedback              |
| ------------ | ---------- | --------------------- |
| Abrir app    | Launch     | Splash → diário < 1s  |
| Ver foto     | Tap        | Shared element expand |
| Reagir       | Double tap | ❤️ center animation   |
| Compartilhar | Long press | Bottom sheet          |
| Fechar       | Swipe down | Spring dismiss        |

---

## Visual Design Foundation

### Color System

#### Brand Colors

| Função    | Nome       | Hex       | Uso                      |
| --------- | ---------- | --------- | ------------------------ |
| Primary   | Verde Lima | `#CEDE6C` | CTAs, sucesso, positivo  |
| Secondary | Laranja    | `#F29131` | Alertas, ação, energia   |
| Neutral   | Cinza      | `#9FA1A4` | Texto secundário, bordas |

#### Semantic Colors (Light Theme)

| Token           | Hex       | Uso                  |
| --------------- | --------- | -------------------- |
| background      | `#FFFFFF` | Cards, surfaces      |
| backgroundAlt   | `#F8F9FA` | Page background      |
| foreground      | `#333333` | Primary text         |
| foregroundMuted | `#6B7280` | Secondary text       |
| success         | `#22C55E` | Confirmações         |
| warning         | `#F29131` | Usa laranja da marca |
| error           | `#EF4444` | Erros                |
| info            | `#3B82F6` | Informativo          |

#### Dark Theme Adjustments

| Token         | Hex       | Nota                 |
| ------------- | --------- | -------------------- |
| background    | `#1A1A1A` | Cards dark           |
| backgroundAlt | `#0F0F0F` | Page dark            |
| foreground    | `#F9FAFB` | Text light           |
| primary       | `#D4E67A` | Verde mais brilhante |
| secondary     | `#F9A352` | Laranja mais suave   |

### Typography System

#### Font Stack

```css
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
--font-display: "Inter Display", var(--font-sans);
```

#### Type Scale

| Token     | Size | Weight | Uso                 |
| --------- | ---- | ------ | ------------------- |
| display   | 40px | 700    | Hero, splash        |
| h1        | 32px | 700    | Títulos principais  |
| h2        | 24px | 600    | Seções              |
| h3        | 20px | 600    | Subtítulos          |
| body      | 16px | 400    | Texto padrão        |
| bodyLarge | 18px | 400    | Modo acessibilidade |
| small     | 14px | 400    | Legendas            |
| tiny      | 12px | 400    | Timestamps          |

### Spacing & Layout Foundation

#### Spacing Scale (Base: 4px)

| Token   | Value | Uso           |
| ------- | ----- | ------------- |
| space-1 | 4px   | Micro gaps    |
| space-2 | 8px   | Tight spacing |
| space-4 | 16px  | Default ⭐    |
| space-6 | 24px  | Relaxed       |
| space-8 | 32px  | Section gaps  |

#### Border Radius

| Token       | Value  | Uso            |
| ----------- | ------ | -------------- |
| radius-sm   | 4px    | Inputs, badges |
| radius-md   | 8px    | Cards, buttons |
| radius-lg   | 12px   | Photos, modals |
| radius-full | 9999px | Avatares       |

#### Grid System

| Breakpoint | Columns | Gutter | Margin |
| ---------- | ------- | ------ | ------ |
| Mobile     | 4       | 16px   | 16px   |
| Tablet     | 8       | 24px   | 32px   |
| Desktop    | 12      | 24px   | auto   |

### Accessibility Considerations

#### Contrast Ratios (WCAG AA)

| Combinação       | Ratio  | Status        |
| ---------------- | ------ | ------------- |
| Text on white    | 12.6:1 | ✅ AAA        |
| Verde on dark    | 8.2:1  | ✅ AAA        |
| Laranja on white | 3.1:1  | ⚠️ Large only |

#### Accessibility Features

- **Modo Avós:** Font size 20px mínimo (toggle)
- **Touch Targets:** Mínimo 44x44px
- **Focus Indicators:** Ring verde lima 2px
- **Motion:** Respeitar prefers-reduced-motion
- **Screen Readers:** Labels em todos os elementos interativos

---

## Design Direction Decision

### Design Directions Explored

| Direction | Nome            | Características                                    |
| --------- | --------------- | -------------------------------------------------- |
| 1         | Clean Minimal   | Espaço branco, tipografia leve, foco no conteúdo   |
| 2         | Warm & Cozy     | Gradientes quentes, bordas arredondadas, acolhedor |
| 3         | Bold & Modern   | Dark mode, tipografia bold, alto contraste         |
| 4         | Playful Family  | Emojis, cores vibrantes, lúdico                    |
| 5         | Premium Elegant | Minimalismo sofisticado, tipografia refinada       |
| 6         | Friendly Social | Stories, feed Instagram-like, familiar             |

**Arquivo de referência:** [ux-design-directions.html](ux-design-directions.html)

### Chosen Direction

**Direção Principal:** 2 - Warm & Cozy
**Elementos Adicionais:** Stories do Direction 6

#### Características da Direção Escolhida

- Gradientes suaves usando Verde Lima (#CEDE6C) e Laranja (#F29131)
- Bordas muito arredondadas (radius-2xl: 24px)
- Sombras suaves e difusas
- Cards com destaque para foto/conteúdo
- Header com gradiente acolhedor
- Bottom navigation padrão iOS/Android
- Stories horizontais para filhos/turmas

### Design Rationale

| Decisão             | Razão                                       |
| ------------------- | ------------------------------------------- |
| Warm & Cozy base    | Alinha com valores acolhedores da escola    |
| Gradientes quentes  | Transmite calor e carinho (não frieza tech) |
| Bordas arredondadas | Suavidade, adequado para contexto infantil  |
| Stories             | Padrão familiar (Instagram/WhatsApp)        |
| Cards grandes       | Fotos em destaque = "Diário First"          |
| Cores da marca      | Verde Lima + Laranja em destaque            |

### Implementation Approach

#### Visual Tokens Específicos

```css
/* Warm & Cozy Tokens */
--gradient-header: linear-gradient(180deg, var(--laranja) 0%, #fff9f5 100%);
--gradient-card: linear-gradient(135deg, #ffe5d0 0%, #ffecd8 100%);
--shadow-warm: 0 8px 24px rgba(242, 145, 49, 0.15);
--radius-card: 24px;
--radius-button: 9999px;
--background-warm: #fff9f5;
```

#### Componentes Chave

| Componente | Estilo                            |
| ---------- | --------------------------------- |
| Header     | Gradiente laranja → fundo quente  |
| Cards      | Bordas 24px, sombra quente        |
| Avatares   | Borda verde lima 3px              |
| Botões     | Pills arredondados (radius-full)  |
| Stories    | Ring gradiente verde→laranja      |
| Tags       | Background verde lima 20% opacity |

#### Animações

| Elemento     | Animação                         |
| ------------ | -------------------------------- |
| Cards        | Scale 0.98 no press, spring back |
| Heart        | Lottie pulse + haptic            |
| Stories ring | Subtle rotation gradient         |
| Transitions  | 300ms ease-out                   |
| Page enter   | Fade + slide up 20px             |

---

## User Journey Flows

### Journey 1: Marina (Mãe) - Ver Diário do Filho

**Contexto:** Core Experience - "Ver o dia do meu filho em 10 segundos"

```mermaid
flowchart TD
    subgraph TRIGGER["🔔 Trigger"]
        A[Push Notification<br/>"João tem 2 novidades!"]
        B[App Icon Badge]
    end

    subgraph ENTRY["📱 Entry"]
        C[Toca na notificação]
        D[Abre o app]
    end

    subgraph HOME["🏠 Home - Diário First"]
        E[Feed do Diário<br/>Cards ordenados por horário]
        F[Stories de filhos<br/>Ring verde = novidade]
    end

    subgraph CONTENT["📸 Conteúdo"]
        G[Card do Post<br/>Foto + Texto + Professor]
        H[Toca no Card]
        I[Modal Fullscreen<br/>Foto grande + detalhes]
    end

    subgraph REACTION["❤️ Interação"]
        J[Double-tap = ❤️<br/>Haptic + Lottie pulse]
        K[Botão Comentar]
        L[Input de comentário<br/>Emoji picker]
    end

    subgraph COMPLETION["✅ Completado"]
        M[Badge cleared]
        N[Card marcado como visto]
        O[Satisfação: ★★★★★]
    end

    A --> C
    B --> D
    C --> E
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
    L --> M
    M --> N
    N --> O

    style A fill:#F29131,color:#fff
    style O fill:#CEDE6C,color:#333
    style J fill:#ff6b6b,color:#fff
```

**Tempo Alvo:** < 10 segundos até ver primeira foto
**Métrica de Sucesso:** Badge cleared + reação enviada

---

### Journey 2: Carla (Coordenadora) - Publicar Post no Diário

**Contexto:** Criar registro diário rápido durante rotina escolar

```mermaid
flowchart TD
    subgraph TRIGGER["📸 Trigger"]
        A[Momento especial<br/>acontecendo na sala]
    end

    subgraph CAPTURE["🎯 FAB Action"]
        B[FAB Verde Lima<br/>Posição: bottom-right]
        C[Menu radial<br/>📷 Foto | 📝 Texto | 🎥 Vídeo]
        D[Abre câmera nativa]
    end

    subgraph PHOTO["📱 Captura"]
        E[Tira foto]
        F[Preview + Retry]
        G[Confirma foto]
    end

    subgraph COMPOSE["✍️ Composição"]
        H[Tela de composição]
        I[Seleciona turma<br/>Dropdown pré-selecionado]
        J[Seleciona alunos<br/>Multi-select com avatares]
        K[Escreve legenda<br/>Sugestões rápidas]
        L[Tags opcionais<br/>🎨 Artes | 📚 Leitura | 🎵 Música]
    end

    subgraph PUBLISH["🚀 Publicação"]
        M[Preview do post]
        N[Botão Publicar<br/>Loading state]
        O[Optimistic UI<br/>Post aparece imediatamente]
        P[Confirmação<br/>Toast + haptic success]
    end

    subgraph NOTIFICATION["🔔 Distribuição"]
        Q[Push para pais<br/>dos alunos selecionados]
    end

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F -->|Retry| E
    F -->|OK| G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
    L --> M
    M --> N
    N --> O
    O --> P
    P --> Q

    style B fill:#CEDE6C,color:#333
    style N fill:#F29131,color:#fff
    style P fill:#22c55e,color:#fff
```

**Tempo Alvo:** < 60 segundos foto → publicado
**Métrica de Sucesso:** Post publicado + notificações enviadas

---

### Journey 3: Daviane (Diretora) - Enviar Comunicado Geral

**Contexto:** Comunicação importante para toda a escola

```mermaid
flowchart TD
    subgraph TRIGGER["📢 Trigger"]
        A[Comunicado importante<br/>Ex: Reunião de pais]
    end

    subgraph ACCESS["🔐 Acesso Diretoria"]
        B[Menu lateral<br/>ou Tab Comunicados]
        C[Seção Comunicados<br/>Área administrativa]
    end

    subgraph COMPOSE["✍️ Composição"]
        D[Novo Comunicado]
        E[Tipo de comunicado<br/>📢 Geral | ⚠️ Urgente | 📅 Evento]
        F[Título do comunicado]
        G[Corpo do texto<br/>Rich text editor]
        H[Anexos opcionais<br/>PDF, imagem]
    end

    subgraph TARGET["🎯 Segmentação"]
        I[Seleciona destinatários]
        J{Toda escola?}
        K[Seleciona turmas<br/>Multi-select]
        L[Preview de alcance<br/>"250 famílias receberão"]
    end

    subgraph SCHEDULE["⏰ Agendamento"]
        M{Enviar agora?}
        N[Seleciona data/hora]
        O[Preview final]
    end

    subgraph SEND["🚀 Envio"]
        P[Confirma envio]
        Q[Loading + Progress]
        R[Sucesso<br/>"Comunicado enviado!"]
        S[Dashboard de leitura<br/>Taxa de visualização]
    end

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J -->|Sim| L
    J -->|Não| K
    K --> L
    L --> M
    M -->|Sim| O
    M -->|Não| N
    N --> O
    O --> P
    P --> Q
    Q --> R
    R --> S

    style E fill:#F29131,color:#fff
    style R fill:#22c55e,color:#fff
    style S fill:#CEDE6C,color:#333
```

**Tempo Alvo:** < 3 minutos para comunicado simples
**Métrica de Sucesso:** Taxa de leitura > 80% em 24h

---

### Journey 4: João (Pai) - Ver Financeiro e Pagar

**Contexto:** Consultar situação financeira e realizar pagamento

```mermaid
flowchart TD
    subgraph TRIGGER["💰 Trigger"]
        A[Push: Boleto disponível<br/>ou vencimento próximo]
        B[Consulta espontânea]
    end

    subgraph ACCESS["📱 Acesso"]
        C[Tab Financeiro<br/>ou Menu lateral]
        D[Tela Financeiro<br/>Resumo da situação]
    end

    subgraph OVERVIEW["📊 Visão Geral"]
        E[Card de Status<br/>✅ Em dia | ⚠️ Pendente]
        F[Próximo vencimento<br/>Data + Valor]
        G[Histórico de pagamentos<br/>Lista scrollable]
    end

    subgraph DETAIL["📄 Detalhes"]
        H[Toca no boleto]
        I[Detalhes do boleto<br/>Valor, vencimento, descrição]
        J[Código de barras<br/>Copiável com 1 toque]
    end

    subgraph PAYMENT["💳 Pagamento"]
        K[Opções de pagamento]
        L[Copiar código<br/>Toast: "Copiado!"]
        M[Abrir no banco<br/>Deep link opcional]
        N[Gerar PIX<br/>QR Code + código]
    end

    subgraph CONFIRMATION["✅ Confirmação"]
        O[Pagamento registrado<br/>Pode levar até 48h]
        P[Status atualizado<br/>Card fica verde]
    end

    A --> C
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
    K --> M
    K --> N
    L --> O
    M --> O
    N --> O
    O --> P

    style A fill:#F29131,color:#fff
    style E fill:#CEDE6C,color:#333
    style P fill:#22c55e,color:#fff
```

**Tempo Alvo:** < 30 segundos até código copiado
**Métrica de Sucesso:** Código copiado ou PIX gerado

---

### Journey 5: Ana (Secretária) - Cadastrar Novo Aluno

**Contexto:** Matricular novo aluno no sistema (Web Admin)

```mermaid
flowchart TD
    subgraph TRIGGER["📝 Trigger"]
        A[Nova matrícula<br/>Documentos recebidos]
    end

    subgraph ACCESS["🖥️ Acesso Web"]
        B[Login Web Admin<br/>Portal administrativo]
        C[Menu: Alunos<br/>Sidebar navigation]
        D[Botão: Novo Aluno<br/>Primary CTA]
    end

    subgraph WIZARD["📋 Wizard de Cadastro"]
        E[Step 1: Dados Básicos<br/>Nome, data nasc., foto]
        F[Step 2: Responsáveis<br/>Busca ou cadastra novos]
        G[Step 3: Turma<br/>Seleciona turma/período]
        H[Step 4: Documentos<br/>Upload de certidões]
        I[Step 5: Financeiro<br/>Plano de mensalidade]
    end

    subgraph VALIDATION["✔️ Validação"]
        J[Revisão dos dados<br/>Todos os campos]
        K{Dados OK?}
        L[Corrige campos<br/>Volta ao step]
    end

    subgraph COMPLETION["✅ Conclusão"]
        M[Confirma cadastro]
        N[Aluno criado<br/>Success toast]
        O[Convites enviados<br/>Email para responsáveis]
        P[Aluno na lista<br/>Card verde "Novo"]
    end

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K -->|Não| L
    L --> J
    K -->|Sim| M
    M --> N
    N --> O
    O --> P

    style D fill:#CEDE6C,color:#333
    style N fill:#22c55e,color:#fff
    style O fill:#F29131,color:#fff
```

**Tempo Alvo:** < 5 minutos cadastro completo
**Métrica de Sucesso:** Aluno ativo + convites enviados aos pais

---

### Journey Patterns

| Pattern                    | Aplicação                              | Benefício                       |
| -------------------------- | -------------------------------------- | ------------------------------- |
| **Progressive Disclosure** | Wizard de cadastro, composição de post | Reduz cognitive load            |
| **Optimistic UI**          | Publicar post, enviar reação           | Sensação de velocidade          |
| **FAB Primary Action**     | Novo post (coordenadora)               | Ação principal sempre acessível |
| **Badge Clearing**         | Notificações de diário                 | Satisfação de "tarefa completa" |
| **Preview Before Commit**  | Comunicados, cadastros                 | Reduz erros                     |
| **Deep Links**             | Notificações → conteúdo específico     | Navegação direta                |

### Flow Optimization Principles

1. **3-Tap Rule**: Qualquer ação primária em no máximo 3 toques
2. **10 Segundos Rule**: Conteúdo principal visível em < 10s
3. **Zero Input Default**: Pré-selecionar quando possível (turma, data)
4. **Feedback Imediato**: Haptic + visual em toda interação
5. **Recovery Paths**: Sempre permitir voltar e corrigir

---

## Component Strategy

### Design System Components

#### Mobile (Tamagui)

| Categoria        | Componentes Usados                |
| ---------------- | --------------------------------- |
| **Layout**       | Stack, XStack, YStack, ScrollView |
| **Forms**        | Input, TextArea, Select, Switch   |
| **Feedback**     | Toast, Sheet, Dialog              |
| **Data Display** | Card, Avatar, Badge, Separator    |
| **Navigation**   | Tabs (bottom nav)                 |

#### Web Admin (shadcn/ui)

| Categoria        | Componentes Usados                                  |
| ---------------- | --------------------------------------------------- |
| **Layout**       | Card, Separator, Tabs                               |
| **Forms**        | Input, Textarea, Select, Checkbox, DatePicker, Form |
| **Feedback**     | Toast, Alert, Dialog, Sheet                         |
| **Data Display** | Table, DataTable, Avatar, Badge                     |
| **Navigation**   | Sidebar, Breadcrumb, Pagination                     |

### Custom Components

#### 1. DiaryCard

| Aspecto           | Especificação                                                            |
| ----------------- | ------------------------------------------------------------------------ |
| **Purpose**       | Exibir post do diário com foto, professor, aluno e reações               |
| **Content**       | Foto/vídeo, avatar professor, nome aluno, turma, horário, texto, reações |
| **States**        | default, loading (skeleton), pressed (scale 0.98), new (ring verde)      |
| **Variants**      | compact (feed), expanded (modal fullscreen)                              |
| **Accessibility** | Image alt text, tap target 44px mínimo                                   |

#### 2. StoryRing

| Aspecto           | Especificação                                             |
| ----------------- | --------------------------------------------------------- |
| **Purpose**       | Indicador visual de conteúdo não visto (estilo Instagram) |
| **Content**       | Avatar do filho/turma + ring gradiente                    |
| **States**        | unseen (ring verde→laranja), seen (ring cinza), loading   |
| **Animation**     | Subtle gradient rotation, scale on press                  |
| **Accessibility** | "Nova atualização de [nome]" label                        |

#### 3. ReactionButton

| Aspecto         | Especificação                        |
| --------------- | ------------------------------------ |
| **Purpose**     | Botão de reação com feedback rico    |
| **Content**     | Emoji (❤️ default) + contador        |
| **States**      | inactive, active (filled), animating |
| **Animation**   | Lottie heart pulse + haptic feedback |
| **Interaction** | Single tap ou double-tap no card pai |

#### 4. FABMenu

| Aspecto       | Especificação                          |
| ------------- | -------------------------------------- |
| **Purpose**   | Floating Action Button com menu radial |
| **Content**   | Ícone + (📷 Foto, 📝 Texto, 🎥 Vídeo)  |
| **States**    | collapsed, expanded, disabled          |
| **Animation** | Spring expand, backdrop blur           |
| **Position**  | Bottom-right, safe area aware          |

#### 5. StudentPicker

| Aspecto           | Especificação                              |
| ----------------- | ------------------------------------------ |
| **Purpose**       | Seleção múltipla de alunos com avatares    |
| **Content**       | Grid de avatares, checkmarks, busca        |
| **States**        | none selected, some selected, all selected |
| **Features**      | "Selecionar todos", busca por nome         |
| **Accessibility** | Checkbox semantics, keyboard nav (web)     |

#### 6. BillCard

| Aspecto      | Especificação                                       |
| ------------ | --------------------------------------------------- |
| **Purpose**  | Exibir boleto com status visual claro               |
| **Content**  | Valor, vencimento, status, ações                    |
| **States**   | pending (amarelo), paid (verde), overdue (vermelho) |
| **Actions**  | Copiar código, ver detalhes, gerar PIX              |
| **Variants** | compact (lista), detailed (modal)                   |

#### 7. PIXModal

| Aspecto           | Especificação                                 |
| ----------------- | --------------------------------------------- |
| **Purpose**       | Exibir QR Code PIX e código copiável          |
| **Content**       | QR Code, código copia-cola, valor, vencimento |
| **States**        | loading, ready, copied, expired               |
| **Animation**     | QR code fade-in, copy feedback                |
| **Accessibility** | "Código PIX copiado" announcement             |

#### 8. CommunicationCard

| Aspecto      | Especificação                                             |
| ------------ | --------------------------------------------------------- |
| **Purpose**  | Exibir comunicado da escola                               |
| **Content**  | Tipo (badge), título, preview texto, data, status leitura |
| **States**   | unread (badge), read, urgent (borda vermelha)             |
| **Actions**  | Expandir, marcar como lido                                |
| **Variants** | feed item, full view                                      |

#### 9. ChildSelector

| Aspecto       | Especificação                                 |
| ------------- | --------------------------------------------- |
| **Purpose**   | Trocar entre filhos (para pais com múltiplos) |
| **Content**   | Avatares dos filhos, nome, turma              |
| **States**    | single child (hidden), multiple (visible)     |
| **Animation** | Horizontal scroll snap                        |
| **Position**  | Header ou below stories                       |

#### 10. NotificationBell

| Aspecto       | Especificação                               |
| ------------- | ------------------------------------------- |
| **Purpose**   | Ícone de notificações com badge count       |
| **Content**   | Ícone sino, badge número                    |
| **States**    | empty, has notifications (badge), animating |
| **Animation** | Subtle shake quando nova notificação        |
| **Badge**     | Vermelho, max "9+" para 10+                 |

### Component Implementation Strategy

#### Tokens Compartilhados

Todos os custom components usam os tokens do design system:

```css
/* Cores */
$verdeLima: #CEDE6C
$laranja: #F29131
$cinza: #9FA1A4

/* Spacing */
$space.1: 4px
$space.2: 8px
$space.3: 12px
$space.4: 16px
$space.6: 24px
$space.8: 32px

/* Radius */
$radius.lg: 12px
$radius.2xl: 24px
$radius.full: 9999px

/* Shadows */
$shadow.warm: 0 8px 24px rgba(242, 145, 49, 0.15)
```

#### Composition Pattern

Componentes compostos usando primitivos do design system:

```tsx
// Exemplo: DiaryCard usando Tamagui primitives
<Card elevate bordered radius="$radius.2xl" padding="$space.4">
  <XStack gap="$space.3">
    <Avatar size="$4" />
    <YStack>
      <Text fontWeight="600">{title}</Text>
      <Text color="$cinza">{meta}</Text>
    </YStack>
  </XStack>
  <Image source={photo} />
  <ReactionButton emoji="❤️" count={likes} />
</Card>
```

#### Animation Stack

| Biblioteca        | Uso                                          |
| ----------------- | -------------------------------------------- |
| **Reanimated 3**  | Gestos, transições, shared element           |
| **Moti**          | Animações declarativas, entrada/saída        |
| **Lottie**        | Micro-interactions (heart, success, loading) |
| **Framer Motion** | Web admin animations                         |

### Implementation Roadmap

#### Phase 1 - Core (MVP Week 1)

| Componente       | Prioridade | Necessário para       |
| ---------------- | ---------- | --------------------- |
| DiaryCard        | P0         | J1 - Core Experience  |
| StoryRing        | P0         | J1 - Navigation       |
| ReactionButton   | P0         | J1 - Engagement       |
| FABMenu          | P0         | J2 - Content creation |
| NotificationBell | P0         | Todos - Feedback loop |

#### Phase 2 - Financial (Week 2)

| Componente | Prioridade | Necessário para |
| ---------- | ---------- | --------------- |
| BillCard   | P1         | J4 - Financeiro |
| PIXModal   | P1         | J4 - Pagamento  |

#### Phase 3 - Communication (Week 2-3)

| Componente        | Prioridade | Necessário para      |
| ----------------- | ---------- | -------------------- |
| CommunicationCard | P1         | J3 - Comunicados     |
| StudentPicker     | P1         | J2, J3 - Segmentação |

#### Phase 4 - Polish (Week 3+)

| Componente       | Prioridade | Necessário para |
| ---------------- | ---------- | --------------- |
| ChildSelector    | P2         | Multi-filho UX  |
| EnrollmentWizard | P2         | J5 - Web Admin  |

---

## UX Consistency Patterns

### Button Hierarchy

#### Primary Actions (Verde Lima)

| Estado       | Estilo                                          |
| ------------ | ----------------------------------------------- |
| **Default**  | Background `#CEDE6C`, texto `#333`, radius full |
| **Pressed**  | Scale 0.96, background `#B8C85A`                |
| **Disabled** | Opacity 0.5, sem interação                      |
| **Loading**  | Spinner branco, texto hidden                    |

**Uso:** CTAs principais - "Publicar", "Enviar", "Confirmar"

#### Secondary Actions (Laranja)

| Estado      | Estilo                            |
| ----------- | --------------------------------- |
| **Default** | Background `#F29131`, texto white |
| **Pressed** | Scale 0.96, background `#E07B1A`  |

**Uso:** Ações de destaque - "Ver mais", "Pagar agora"

#### Tertiary Actions (Ghost)

| Estado      | Estilo                               |
| ----------- | ------------------------------------ |
| **Default** | Background transparent, texto `#333` |
| **Pressed** | Background `rgba(0,0,0,0.05)`        |

**Uso:** Ações secundárias - "Cancelar", "Voltar"

#### Destructive Actions

| Estado          | Estilo                              |
| --------------- | ----------------------------------- |
| **Default**     | Background `#EF4444`, texto white   |
| **Confirmação** | Sempre exige confirmação via Dialog |

**Uso:** "Excluir", "Remover" (sempre com confirmação)

---

### Feedback Patterns

#### Success Feedback

| Elemento    | Comportamento                                     |
| ----------- | ------------------------------------------------- |
| **Toast**   | Verde `#22C55E`, ícone ✓, 3s auto-dismiss         |
| **Haptic**  | Success pattern (iOS) / light vibration (Android) |
| **Visual**  | Lottie checkmark animation                        |
| **Exemplo** | "Post publicado com sucesso!"                     |

#### Error Feedback

| Elemento     | Comportamento                                |
| ------------ | -------------------------------------------- |
| **Toast**    | Vermelho `#EF4444`, ícone ✕, 5s (mais tempo) |
| **Haptic**   | Error pattern / double vibration             |
| **Recovery** | Sempre incluir ação de retry ou correção     |
| **Exemplo**  | "Erro ao enviar. [Tentar novamente]"         |

#### Warning Feedback

| Elemento    | Comportamento                    |
| ----------- | -------------------------------- |
| **Toast**   | Laranja `#F29131`, ícone ⚠️, 4s  |
| **Uso**     | Ações irreversíveis, vencimentos |
| **Exemplo** | "Boleto vence amanhã!"           |

#### Info Feedback

| Elemento    | Comportamento                               |
| ----------- | ------------------------------------------- |
| **Toast**   | Cinza `#9FA1A4`, ícone ℹ️, 3s               |
| **Uso**     | Informações neutras                         |
| **Exemplo** | "Código copiado para área de transferência" |

#### Loading States

| Tipo           | Uso                           | Visual                    |
| -------------- | ----------------------------- | ------------------------- |
| **Skeleton**   | Carregamento inicial de cards | Shimmer cinza claro       |
| **Spinner**    | Ações em andamento            | Spinner verde lima        |
| **Progress**   | Uploads, downloads            | Barra de progresso        |
| **Optimistic** | Ações rápidas                 | Mostra resultado imediato |

---

### Form Patterns

#### Input Fields

| Estado       | Estilo                             |
| ------------ | ---------------------------------- |
| **Default**  | Border `#E5E7EB`, radius 12px      |
| **Focus**    | Border `#CEDE6C` 2px, shadow suave |
| **Error**    | Border `#EF4444`, mensagem abaixo  |
| **Disabled** | Background `#F3F4F6`, opacity 0.7  |

#### Validation

| Tipo          | Comportamento                        |
| ------------- | ------------------------------------ |
| **Real-time** | Valida ao sair do campo (onBlur)     |
| **Submit**    | Valida todos e foca no primeiro erro |
| **Mensagens** | Abaixo do campo, texto vermelho 13px |
| **Sucesso**   | Checkmark verde ao lado do campo     |

#### Form Layout

| Regra           | Aplicação                                     |
| --------------- | --------------------------------------------- |
| **Labels**      | Sempre acima do campo, nunca placeholder-only |
| **Espaçamento** | 16px entre campos                             |
| **Botões**      | Primary à direita, Secondary à esquerda       |
| **Required**    | Asterisco vermelho após label                 |

---

### Navigation Patterns

#### Bottom Tab Bar (Mobile)

| Elemento     | Especificação                         |
| ------------ | ------------------------------------- |
| **Tabs**     | 4-5 items máximo                      |
| **Active**   | Ícone + label verde lima              |
| **Inactive** | Ícone cinza, sem label ou label sutil |
| **Badge**    | Número vermelho no ícone              |
| **Height**   | 83px (inclui safe area)               |

#### Header (Mobile)

| Elemento    | Especificação                   |
| ----------- | ------------------------------- |
| **Height**  | 44px + status bar               |
| **Back**    | Chevron left, sempre disponível |
| **Title**   | Centralizado, 17px semibold     |
| **Actions** | Máximo 2 ícones à direita       |

#### Sidebar (Web Admin)

| Elemento        | Especificação                             |
| --------------- | ----------------------------------------- |
| **Width**       | 240px expanded, 64px collapsed            |
| **Active item** | Background verde lima 10%, borda esquerda |
| **Hover**       | Background `#F3F4F6`                      |
| **Groups**      | Separador + label uppercase 12px          |

---

### Modal & Sheet Patterns

#### Bottom Sheet (Mobile)

| Tipo       | Uso                          |
| ---------- | ---------------------------- |
| **Peek**   | 30% altura, ações rápidas    |
| **Half**   | 50% altura, forms curtos     |
| **Full**   | 90% altura, conteúdo extenso |
| **Handle** | Barra cinza 40x4px no topo   |

#### Dialog (Confirmação)

| Elemento     | Especificação                     |
| ------------ | --------------------------------- |
| **Backdrop** | Preto 50% opacity, blur 4px       |
| **Card**     | Branco, radius 24px, padding 24px |
| **Título**   | 18px semibold, centralizado       |
| **Botões**   | Stack vertical em mobile          |

---

### Empty States

| Cenário              | Conteúdo                                                     |
| -------------------- | ------------------------------------------------------------ |
| **Sem posts**        | Ilustração + "Nenhum momento ainda hoje" + CTA opcional      |
| **Sem notificações** | "Tudo tranquilo por aqui 💚"                                 |
| **Busca vazia**      | "Nenhum resultado para '[termo]'" + sugestões                |
| **Erro de conexão**  | Ícone offline + "Verifique sua conexão" + [Tentar novamente] |

---

### Search & Filter Patterns

#### Search Bar

| Elemento        | Especificação             |
| --------------- | ------------------------- |
| **Ícone**       | Lupa cinza à esquerda     |
| **Placeholder** | "Buscar..." em cinza      |
| **Clear**       | X aparece quando há texto |
| **Results**     | Dropdown ou tela dedicada |

#### Filters

| Tipo                 | Uso                                   |
| -------------------- | ------------------------------------- |
| **Chips**            | Filtros pré-definidos (turmas, datas) |
| **Sheet**            | Filtros avançados                     |
| **Active indicator** | Badge no botão de filtro              |

---

## Responsive Design & Accessibility

### Responsive Strategy

#### Mobile App (React Native)

| Aspecto              | Estratégia                        |
| -------------------- | --------------------------------- |
| **Primary Platform** | iOS e Android nativos via Expo    |
| **Screen Sizes**     | 320px (SE) até 430px (Pro Max)    |
| **Orientation**      | Portrait only (simplifica UX)     |
| **Safe Areas**       | Notch, home indicator, status bar |

#### Web Admin (Next.js)

| Aspecto              | Estratégia                        |
| -------------------- | --------------------------------- |
| **Primary Platform** | Desktop Chrome/Edge               |
| **Secondary**        | Tablet para coordenadores em sala |
| **Approach**         | Desktop-first, responsive down    |

### Breakpoint Strategy

#### Mobile App

| Breakpoint | Dispositivos         | Adaptação                                 |
| ---------- | -------------------- | ----------------------------------------- |
| **Small**  | < 375px (SE)         | Cards compactos, fonte 14px base          |
| **Medium** | 375-414px (Standard) | Layout padrão                             |
| **Large**  | > 414px (Plus/Max)   | Mais conteúdo visível, 2 colunas em grids |

#### Web Admin

| Breakpoint | Uso         | Layout                              |
| ---------- | ----------- | ----------------------------------- |
| **sm**     | < 640px     | Sidebar hidden, menu hamburger      |
| **md**     | 640-1024px  | Sidebar collapsed (64px)            |
| **lg**     | 1024-1280px | Sidebar expanded (240px)            |
| **xl**     | > 1280px    | Extra padding, max-width containers |

### Accessibility Strategy

#### WCAG Compliance Target: **Level AA**

| Critério             | Implementação                        |
| -------------------- | ------------------------------------ |
| **Contrast**         | 4.5:1 mínimo para texto normal       |
| **Touch Targets**    | 44x44px mínimo                       |
| **Focus Indicators** | Ring verde lima 2px                  |
| **Screen Reader**    | VoiceOver (iOS) + TalkBack (Android) |
| **Motion**           | Respeitar `prefers-reduced-motion`   |

#### Color Accessibility

| Cor                       | Contrast Ratio (vs white) | Uso                                 |
| ------------------------- | ------------------------- | ----------------------------------- |
| Verde Lima `#CEDE6C`      | 1.5:1 ❌                  | Não usar para texto em fundo branco |
| Verde Lima Dark `#7A8A2E` | 4.8:1 ✅                  | Texto em fundo branco               |
| Laranja `#F29131`         | 2.4:1 ❌                  | Não usar para texto pequeno         |
| Laranja Dark `#C46A0A`    | 4.6:1 ✅                  | Texto em fundo branco               |
| Cinza `#6B7280`           | 5.0:1 ✅                  | Texto secundário OK                 |

#### Idosos & Baixa Visão

| Adaptação          | Implementação                  |
| ------------------ | ------------------------------ |
| **Fonte Mínima**   | 16px corpo, 14px legendas      |
| **Escalabilidade** | Suportar Dynamic Type (iOS)    |
| **Contraste Alto** | Modo alto contraste disponível |
| **Toque Generoso** | Botões 48px altura mínimo      |

### Testing Strategy

#### Automated Testing

| Ferramenta                 | Uso                        |
| -------------------------- | -------------------------- |
| **axe-core**               | CI/CD accessibility checks |
| **eslint-plugin-jsx-a11y** | React lint rules           |
| **Lighthouse**             | Web admin audits           |

#### Manual Testing

| Teste             | Frequência         |
| ----------------- | ------------------ |
| **VoiceOver**     | Cada nova tela     |
| **TalkBack**      | Cada nova tela     |
| **Keyboard only** | Web admin features |
| **Zoom 200%**     | Web admin          |

#### Device Testing

| Dispositivo        | Motivo                 |
| ------------------ | ---------------------- |
| iPhone SE          | Menor tela iOS         |
| iPhone 15 Pro      | Notch + Dynamic Island |
| Samsung Galaxy A13 | Android budget popular |
| iPad               | Coordenadores em sala  |

### Implementation Guidelines

#### Mobile (React Native)

```tsx
// Accessibility props pattern
<Pressable
  accessible={true}
  accessibilityLabel="Reagir com coração"
  accessibilityRole="button"
  accessibilityState={{ selected: isLiked }}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
>
  <HeartIcon />
</Pressable>
```

#### Responsive Hooks

```tsx
// useResponsive hook
const { isSmall, isMedium, isLarge } = useResponsive();

// Uso
<Text fontSize={isSmall ? 14 : 16}>{content}</Text>;
```

#### Web Admin (Next.js)

```tsx
// Tailwind responsive
<div
  className="
  grid grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4
"
>
  {cards}
</div>
```

#### Semantic HTML

```html
<!-- Web Admin structure -->
<main role="main" aria-label="Painel administrativo">
  <nav aria-label="Menu principal">...</nav>
  <section aria-labelledby="students-heading">
    <h1 id="students-heading">Alunos</h1>
    ...
  </section>
</main>
```

---

## Document Summary

| Seção             | Conteúdo                                   |
| ----------------- | ------------------------------------------ |
| Brand Identity    | Cores, tipografia, voz da marca            |
| Core UX           | Definição da experiência, princípios       |
| UX Patterns       | Análise de padrões e inspirações           |
| Design System     | Tamagui (mobile) + shadcn/ui (web)         |
| Visual Foundation | Sistema de cores, espaçamento, sombras     |
| Design Direction  | Warm & Cozy + Stories                      |
| User Journeys     | 5 fluxos detalhados com Mermaid            |
| Components        | 10 custom components especificados         |
| UX Patterns       | Hierarquia de botões, feedback, forms, nav |
| Responsive & A11y | Breakpoints, WCAG AA, testing strategy     |

---

**Document Status:** ✅ Complete
**Last Updated:** 2025-12-12
**Ready for:** Architecture, Wireframes, Implementation
