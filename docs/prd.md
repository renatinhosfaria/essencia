---
stepsCompleted: [1, 2, 3, 4, 7, 8, 9, 10, 11]
inputDocuments:
  - "docs/analysis/product-brief-Essencia-2025-12-11.md"
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 0
workflowType: "prd"
lastStep: 11
skippedSteps: [5, 6]
project_name: "Essencia"
user_name: "Renato"
date: "2025-12-12"
status: "complete"
completedAt: "2025-12-12"
---

# Product Requirements Document - Essencia

**Author:** Renato
**Date:** 2025-12-12

---

## Executive Summary

O **Essencia** é uma plataforma SaaS educacional desenvolvida exclusivamente para o Colégio Essência Feliz (Uberlândia/MG), projetada para substituir completamente o AgendaEdu - uma solução genérica que custa R$24.000/ano e não atende às necessidades específicas da escola.

### Visão do Produto

Criar uma plataforma de comunicação escola-família moderna, com identidade visual própria do colégio, que proporcione:

- **Comunicação em tempo real** entre escola e famílias
- **Diário do aluno** com registros diários de atividades
- **Independência tecnológica** - escola dona dos dados e do sistema
- **Experiência mobile-first** através de app nativo (Android/iOS)

### Proposta de Valor

| Para            | Valor Entregue                                                   |
| --------------- | ---------------------------------------------------------------- |
| **Escola**      | Economia de R$24.000/ano + sistema personalizado + independência |
| **Pais**        | Comunicação rápida + visibilidade do dia escolar em tempo real   |
| **Professores** | Interface simples e bonita + menos cliques para tarefas diárias  |
| **Diretoria**   | Dashboard com métricas + controle total do sistema               |

### Modelo de Negócio

Sistema desenvolvido em troca de bolsa de estudos 100% para 2 alunos. Win-win: escola economiza R$24k/ano e ganha sistema superior; desenvolvedor garante educação dos filhos.

### What Makes This Special

1. **Exclusividade Total** - Feito sob medida para o Colégio Essência Feliz, não é produto genérico
2. **Identidade Visual Própria** - Cores, logo e marca da escola em todo o sistema
3. **Dados Sob Controle** - Escola é dona de 100% dos dados, sem vendor lock-in
4. **Desenvolvedor Acessível** - Suporte local, não SAC distante que ignora sugestões
5. **Evolução Contínua** - Sistema cresce com as necessidades reais da escola
6. **Arquitetura Moderna** - Microserviços preparados para escala e futuras filiais

---

## Project Classification

| Aspecto             | Classificação                       |
| ------------------- | ----------------------------------- |
| **Technical Type**  | SaaS Platform + Mobile App (Native) |
| **Architecture**    | Multi-repo Microservices            |
| **Domain**          | EdTech (Educational Technology)     |
| **Complexity**      | High                                |
| **Project Context** | Greenfield - new project            |

### Technical Decisions

| Decisão         | Escolha                                                           |
| --------------- | ----------------------------------------------------------------- |
| **Arquitetura** | Multi-repo com microserviços independentes                        |
| **Mobile**      | App nativo (Android/iOS) desde o MVP                              |
| **Web**         | Landing page + SaaS dashboard responsivo                          |
| **URLs**        | `colegioessenciafeliz.com.br` + `app.colegioessenciafeliz.com.br` |

### Complexity Factors

- **12 microserviços** planejados (3 no MVP)
- **Multi-plataforma**: Web + Android + iOS
- **Real-time**: Chat e notificações push
- **Multi-tenant ready**: Preparado para filiais futuras

---

## Success Criteria

### User Success

#### Marina (Mãe/Responsável) - "Valeu a Pena" quando:

| Momento                   | Critério de Sucesso                                                |
| ------------------------- | ------------------------------------------------------------------ |
| **Comunicação rápida**    | Resposta da escola em no máximo 30 minutos                         |
| **Acompanhamento visual** | Ver fotos e vídeos de momentos e eventos da escola                 |
| **Visibilidade proativa** | Saber de qualquer ocorrência fora do comum antes de buscar o filho |
| **Informação completa**   | Diário do dia disponível antes do horário de saída                 |

**Frase de sucesso:** _"Sei tudo que acontece na escola dos meus filhos em tempo real, e quando preciso de algo, me respondem rápido!"_

#### Prof. Carla (Professora) - "Valeu a Pena" quando:

| Momento                 | Critério de Sucesso                              |
| ----------------------- | ------------------------------------------------ |
| **Facilidade de uso**   | Completar tarefas diárias com poucos cliques     |
| **Interface intuitiva** | Não precisar de treinamento para usar            |
| **Feedback visual**     | Saber que a mensagem foi enviada/lida            |
| **Eficiência**          | Preencher diário em menos de 5 minutos por turma |

**Frase de sucesso:** _"Consigo fazer tudo rápido e os pais adoram!"_

#### Daviane (Diretora) - "Valeu a Pena" quando:

| Momento                | Critério de Sucesso                             |
| ---------------------- | ----------------------------------------------- |
| **Identidade própria** | App com cores e marca do Colégio Essência Feliz |
| **Visibilidade**       | Saber quem está usando e quem não está          |
| **Independência**      | Dados sob controle, sem depender de terceiros   |
| **Economia**           | Eliminar custo de R$24.000/ano do AgendaEdu     |

**Frase de sucesso:** _"Temos nosso próprio sistema, com nossa cara, e não pagamos mais nada!"_

### Business Success

#### Validação do MVP (Demo para Daviane)

| Critério               | Métrica                      | Target                    |
| ---------------------- | ---------------------------- | ------------------------- |
| **Auth funcionando**   | Login de todos os perfis     | 100% operacional          |
| **Chat em tempo real** | Mensagens enviadas/recebidas | Latência < 2s             |
| **Diário completo**    | Preenchimento e visualização | Fluxo completo            |
| **Landing page**       | Site institucional           | Responsivo e profissional |
| **Identidade visual**  | Cores e marca do colégio     | 100% personalizado        |

#### Go/No-Go Decision

| Sinal          | Interpretação                         |
| -------------- | ------------------------------------- |
| ✅ **Go**      | Daviane aceita a proposta verbalmente |
| ⚠️ **Ajustes** | Daviane pede modificações específicas |
| ❌ **No-Go**   | Daviane recusa ou não se compromete   |

#### Métricas de Sucesso Pós-Lançamento

| Período      | Métrica                        | Target             |
| ------------ | ------------------------------ | ------------------ |
| **1 mês**    | Pais cadastrados               | > 80% das famílias |
| **1 mês**    | Professores usando diariamente | 100%               |
| **3 meses**  | Feedbacks positivos            | > 80%              |
| **3 meses**  | Engajamento de pais            | > 90% ativos/mês   |
| **6 meses**  | NPS                            | > 50               |
| **12 meses** | Economia validada              | R$24.000           |

### Technical Success

| Critério            | Métrica               | Target                   |
| ------------------- | --------------------- | ------------------------ |
| **Disponibilidade** | Uptime                | > 99.5%                  |
| **Performance**     | Tempo de resposta     | < 3 segundos             |
| **Mobile**          | App nativo funcional  | Android + iOS            |
| **Real-time**       | Latência de mensagens | < 2 segundos             |
| **Notificações**    | Push notifications    | Entrega > 95%            |
| **Segurança**       | Autenticação          | Tokens seguros + refresh |

### Measurable Outcomes

| Outcome                 | Baseline (AgendaEdu) | Target (Essencia)  |
| ----------------------- | -------------------- | ------------------ |
| **Custo anual**         | R$24.000             | R$0 (infra apenas) |
| **Tempo de resposta**   | Variável/lento       | < 30 minutos       |
| **Customização**        | 0%                   | 100%               |
| **Controle de dados**   | 0% (vendor lock-in)  | 100% (escola dona) |
| **Satisfação estimada** | Baixa                | > 80% positiva     |

---

## Product Scope

### MVP - Minimum Viable Product (1 semana)

**Objetivo:** Demo funcional para apresentar à Daviane e obter aprovação verbal.

**URLs:**

- Landing Page: `colegioessenciafeliz.com.br`
- Plataforma SaaS: `app.colegioessenciafeliz.com.br`

#### Microserviços do MVP

| #   | Microserviço               | Features Core                                                        |
| --- | -------------------------- | -------------------------------------------------------------------- |
| 1   | **Auth + User Management** | Login, cadastro, perfis (pai, professor, admin), permissões          |
| 2   | **Comunicação Multicanal** | Chat privado, canais por turma, notificações push, status de leitura |
| 3   | **Engajamento Escolar**    | Diário do aluno, comunicados, mural de fotos/vídeos, atividades      |

#### Landing Page (Site Institucional)

- Design moderno com identidade visual do colégio
- Seções: Quem Somos, Turmas, Diferenciais, Contato
- Integração com área de login do SaaS
- Mobile-first (responsivo)

#### Dados de Demonstração

- Usuários fictícios: 5 pais, 3 professores, 1 admin (Daviane)
- Turmas fictícias: 3º ano, 4º ano, 5º ano
- Conversas e diários de exemplo

### Growth Features (Post-MVP) - Fase 2

| #   | Microserviço             | Prioridade |
| --- | ------------------------ | ---------- |
| 4   | **School-Core Service**  | Alta       |
| 5   | **Dashboard**            | Alta       |
| 6   | **Projetos Pedagógicos** | Média      |
| 7   | **Ouvidoria/SAC**        | Média      |
| 8   | **Suporte Técnico**      | Baixa      |

**Timeline estimado:** 1-2 meses após aprovação

### Vision (Future) - Fase 3+

| Feature                              | Timeline       |
| ------------------------------------ | -------------- |
| Migração de dados do AgendaEdu       | Após aprovação |
| Dashboard completo para Daviane      | 1-2 meses      |
| Relatórios avançados                 | 3 meses        |
| Expansão para filiais (multi-tenant) | 6+ meses       |
| Potencial SaaS para outras escolas   | 1+ ano         |

---

## User Journeys

### Journey 1: Marina Santos - O Alívio de Uma Mãe Conectada

Marina acorda às 6h30 para preparar os filhos para a escola. Às 7h45, deixa Pedro (10) e Lucas (8) no Colégio Essência Feliz e corre para o trabalho. Durante anos, ela passou o dia inteiro sem saber nada do que acontecia - só descobria se algo importante aconteceu quando buscava as crianças às 18h30.

Um dia, ao deixar Lucas na escola, a recepcionista menciona: "Dona Marina, agora temos um app próprio - o Essencia. Baixe e cadastre-se!" Marina baixa na hora do almoço e fica surpresa com a simplicidade. Em 2 minutos está cadastrada e vê a foto de perfil dos dois filhos com suas turmas.

A mágica acontece às 15h. Enquanto está em uma reunião chata, seu celular vibra: uma notificação discreta. "📸 Lucas compartilhou um momento no Mural". Ela abre rapidamente e vê uma foto de Lucas sorrindo com uma medalha de matemática. Seus olhos enchem de lágrimas de orgulho.

Às 17h, outra notificação: "📝 Diário do dia disponível". Ela abre e vê: Lucas comeu todo o lanche, brincou no parquinho, e a professora anotou "comportamento exemplar". Quando busca os filhos às 18h30, em vez de "como foi o dia?", ela pergunta "filho, você ganhou medalha de matemática!?" - e Lucas fica surpreso: "Mãe, como você sabe!?"

Marina agora busca os filhos já sabendo de tudo. Ela se sente conectada à vida escolar deles mesmo trabalhando longe. Isso era tudo que ela precisava.

**Capabilities Reveladas:** Notificações push, Mural de fotos, Diário do aluno, Status de leitura, Cadastro simplificado

---

### Journey 2: Prof. Carla - Da Burocracia à Conexão Real

Carla chega às 7h para preparar a sala do 3º ano. Antigamente, ela guardava um caderno físico onde anotava observações de cada aluno - mas nunca tinha tempo de mostrar aos pais. Com o AgendaEdu, ela até tentou usar, mas era lento e travava no celular antigo dela.

No primeiro dia com o Essencia, a coordenadora mostra: "Carla, olha como é simples". Ela abre o app, seleciona "Diário da Turma", e vê a lista dos 25 alunos com fotos. Um toque em "Lucas Silva" e ela escreve: "Participou muito na aula de matemática, ganhou medalha de destaque!" - e toca em "Enviar". Pronto. 30 segundos.

Durante o recreio, uma mãe mandou mensagem: "Oi professora, Lucas está tomando o remédio da gripe?". Carla vê a notificação, toca, responde "Sim, dei às 10h como combinado!" e volta para supervisionar o recreio. A mãe recebe na hora e fica tranquila.

No fim do dia, Carla olha o painel: 100% dos diários enviados, 3 mensagens respondidas, tempo total gasto: 12 minutos. Antes, ela gastava 40 minutos só preenchendo caderneta. Agora sobra tempo para o que importa: ensinar.

Ela comenta com as colegas: "Gente, isso aqui funciona de verdade. E é nosso!"

**Capabilities Reveladas:** Diário rápido por turma, Chat privado professor-responsável, Lista de alunos com fotos, Métricas de tempo, Status de envio

---

### Journey 3: Daviane - A Vitória da Dona do Negócio

Daviane está em sua sala revisando as contas do colégio. R$2.000 por mês para o AgendaEdu. R$24.000 por ano. E quando precisa de algo específico? "Não é possível personalizar, senhora." Quando um pai reclama do app? "Vou abrir um chamado." Ela se sente refém de um sistema que nem tem a cara da escola dela.

Um dia, um pai de aluno - desenvolvedor de software - faz uma proposta: "Daviane, posso criar um sistema completo, com a marca do Colégio Essência Feliz, em troca de bolsa para meus dois filhos." Daviane fica interessada, mas cautelosa. "Me mostre funcionando primeiro."

Uma semana depois, o desenvolvedor agenda uma demonstração. Daviane abre o app no celular e seus olhos brilham: o logo do colégio está lá. As cores são as dela. O nome é "Essencia" - simples, elegante, seu.

Ela testa: cria uma conta de professora, manda uma mensagem, vê chegando em tempo real na conta de pai. Abre o diário, preenche, vê aparecer na tela do pai. Tudo funciona. E o melhor: ela tem acesso a tudo. Ela vê quantos pais abriram as mensagens. Ela pode personalizar os comunicados. Os dados são dela.

Daviane fecha o notebook do AgendaEdu e liga para cancelar o contrato. R$24.000 por ano economizados - o equivalente a uma bolsa completa. E agora ela tem controle total.

"Renato, você fechou o deal. Pode matricular seus filhos."

**Capabilities Reveladas:** Dashboard admin, Métricas de engajamento, Personalização de marca (white-label), Gestão de dados próprios, Controle de acesso

---

### Journey 4: Seu João - Tecnologia Que Até o Avô Entende

Seu João tem 68 anos e cuida do neto Miguel (9) todas as tardes. Ele não tem WhatsApp - a filha instalou, mas ele "apertou um botão e sumiu tudo". Celular para ele é só para ligações.

Quando a filha menciona o novo app da escola, Seu João fica preocupado. "Mais um negócio complicado..." Mas a filha insiste: "Pai, é diferente. Vem que eu te mostro."

Ela pega o celular do pai, baixa o Essencia, e cadastra com o email dele. Na tela inicial, só aparecem duas coisas grandes: "DIÁRIO DO MIGUEL" e "MENSAGENS". Letras grandes, ícones claros.

"Pai, quando esse ícone ficar vermelho, significa que tem novidade. Você toca uma vez e lê."

Dois dias depois, o celular do Seu João vibra. Ele pega desconfiado, vê o ícone vermelho no app da escola. Toca. Aparece: "Miguel teve um ótimo dia! Almoçou bem, fez a lição com atenção." E uma foto do Miguel sorrindo no refeitório.

Seu João sorri pela primeira vez para o celular. "Ó, o menino aí!" Ele chama a esposa: "Vem ver, Maria! O Miguel na escola!"

Agora, toda tarde às 16h, Seu João já espera a notificação. Quando o neto chega, ele já sabe de tudo. "Miguel, comeu todo o almoço hoje, hein? Assim que eu gosto!"

Para Seu João, não é tecnologia - é conexão com o neto.

**Capabilities Reveladas:** Interface simplificada, Fontes grandes/modo acessível, Notificações claras, Navegação minimalista, Perfil de responsável secundário

---

### Journey 5: Secretaria Ana - O Cadastro Sem Dor de Cabeça

Ana trabalha na secretaria do Colégio Essência Feliz há 5 anos. No início de cada ano letivo, ela passa semanas cadastrando alunos, responsáveis, turmas. No AgendaEdu, era um formulário extenso com campos obrigatórios que não faziam sentido. Errou o CPF? Começa de novo.

Com o Essencia, Daviane a chama: "Ana, olha o novo sistema. O desenvolvedor fez especial para a gente."

Ana abre o painel administrativo. Seleciona "Novo Aluno", e o formulário é simples: Nome, Data de Nascimento, Turma, Responsáveis. Ela digita "Pedro Silva Lima", seleciona "4º ano", e aparece: "Vincular responsáveis". Ela busca "Marina Silva" (já cadastrada) e vincula com um clique.

O diferencial: ela pode cadastrar múltiplos responsáveis (pai, mãe, avô, babá) com diferentes níveis de permissão. A babá pode ver o diário, mas não pode autorizar saídas antecipadas. O avô recebe notificações simplificadas.

No fim do dia, Ana cadastrou 12 novos alunos. Tempo médio: 3 minutos cada. No AgendaEdu, eram 10 minutos. Ela ainda teve tempo de tomar café.

"Dona Daviane, esse sistema é uma beleza!"

**Capabilities Reveladas:** Cadastro de alunos simplificado, Vínculo de múltiplos responsáveis, Permissões por perfil, Gestão de turmas, Painel administrativo

---

### Journey Requirements Summary

| Jornada         | User Type           | Capabilities Core                                                         |
| --------------- | ------------------- | ------------------------------------------------------------------------- |
| **Marina**      | Mãe/Responsável     | Push notifications, Mural de fotos, Diário do aluno, Status de leitura    |
| **Prof. Carla** | Professora          | Diário rápido, Chat privado, Lista de alunos, Métricas de tempo           |
| **Daviane**     | Admin/Diretora      | Dashboard, Métricas de engajamento, White-label, Gestão de dados          |
| **Seu João**    | Responsável (idoso) | Interface acessível, Fontes grandes, Navegação simples                    |
| **Ana**         | Secretaria          | Cadastro de alunos, Vínculo de responsáveis, Permissões, Gestão de turmas |

### User Types Coverage

| Tipo                           | Persona          | Status           |
| ------------------------------ | ---------------- | ---------------- |
| ✅ Primary User (Responsável)  | Marina, Seu João | Coberto          |
| ✅ Content Creator (Professor) | Prof. Carla      | Coberto          |
| ✅ Admin/Owner                 | Daviane          | Coberto          |
| ✅ Operations/Support          | Ana (Secretaria) | Coberto          |
| ⏳ API Consumer                | Sistema externo  | Future (não MVP) |

---

## SaaS B2B Specific Requirements

### Project-Type Overview

O Essencia é uma plataforma SaaS de comunicação escolar, inicialmente single-tenant para o Colégio Essência Feliz, com arquitetura preparada para multi-tenancy futura.

**Características SaaS:**

- Web dashboard responsivo para administração
- App nativo (Android/iOS) para usuários finais
- Real-time messaging via WebSockets
- Push notifications para engagement

### Tenant Model

| Fase       | Modelo             | Escopo                                |
| ---------- | ------------------ | ------------------------------------- |
| **MVP**    | Single-tenant      | Colégio Essência Feliz apenas         |
| **Growth** | Multi-tenant ready | Estrutura de dados isolada por escola |
| **Vision** | Full multi-tenant  | SaaS para múltiplas escolas           |

**Isolamento de Dados:**

- Cada escola terá schema/database separado
- Identificador de tenant em todas as requests
- Admin super-user para gerenciar tenants (future)

### RBAC Matrix (Role-Based Access Control)

| Recurso         | Admin | Secretaria | Professor     | Resp. Principal | Resp. Secundário |
| --------------- | ----- | ---------- | ------------- | --------------- | ---------------- |
| **Alunos**      | CRUD  | CRUD       | Read          | Read (próprios) | Read (próprios)  |
| **Turmas**      | CRUD  | CRUD       | Read          | Read            | Read             |
| **Diário**      | CRUD  | Read       | CRUD (turma)  | Read            | Read             |
| **Chat**        | CRUD  | CRUD       | CRUD (alunos) | CRUD            | Read             |
| **Mural**       | CRUD  | CRUD       | CRUD (turma)  | Read            | Read             |
| **Comunicados** | CRUD  | CRUD       | Read          | Read            | Read             |
| **Usuários**    | CRUD  | CRUD       | Read          | Read            | Read             |
| **Config**      | CRUD  | Read       | -             | -               | -                |
| **Relatórios**  | CRUD  | Read       | Read (turma)  | -               | -                |

### Subscription Tiers

| Tier           | Status MVP | Future                                     |
| -------------- | ---------- | ------------------------------------------ |
| **Free**       | N/A        | Até 50 alunos, features básicas            |
| **Pro**        | N/A        | R$5/aluno/mês, todas as features           |
| **Enterprise** | N/A        | Customizado, white-label, suporte dedicado |

**MVP:** Sem sistema de billing - modelo de troca (desenvolvimento por bolsa escolar).

### Integration List

| Integração           | MVP | Future | Prioridade |
| -------------------- | --- | ------ | ---------- |
| Sistema de Matrícula | ❌  | ✅     | Média      |
| WhatsApp Business    | ❌  | ✅     | Alta       |
| Google Sign-In       | ❌  | ✅     | Baixa      |
| Apple Sign-In        | ❌  | ✅     | Baixa      |
| Calendário Google    | ❌  | ✅     | Baixa      |

**MVP:** Autenticação própria (email/senha) sem dependências externas.

### Compliance Requirements

| Requisito                   | Status      | Implementação                                      |
| --------------------------- | ----------- | -------------------------------------------------- |
| **LGPD**                    | Obrigatório | Consentimento no cadastro, direito ao esquecimento |
| **Dados de Menores**        | Obrigatório | Apenas responsáveis cadastrados acessam dados      |
| **Termos de Uso**           | Obrigatório | Aceite obrigatório no primeiro acesso              |
| **Política de Privacidade** | Obrigatório | Link no app e site                                 |
| **Backup de Dados**         | Recomendado | Backup diário automático                           |
| **Criptografia**            | Obrigatório | HTTPS, senhas hasheadas, tokens JWT                |

### Implementation Considerations

**Arquitetura Multi-Repo:**

- Cada microserviço em repositório separado
- Deploy independente por serviço
- API Gateway centralizado

**Stack Tecnológica (sugestão):**

- Backend: Node.js + TypeScript ou Python + FastAPI
- Database: PostgreSQL (relacional) + Redis (cache/realtime)
- Mobile: React Native ou Flutter
- Web: Next.js ou React + Vite
- Infra: AWS/GCP/Azure ou self-hosted

**Real-time:**

- WebSockets para chat e notificações
- Push notifications via Firebase Cloud Messaging

---

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**Abordagem:** Experience MVP com Arquitetura Escalável
**Objetivo:** Demo funcional multi-tenant em 1 semana
**Filosofia:** Fazer menos features, mas com arquitetura correta

**Decisão Arquitetural Chave:**

> Multi-tenant desde o MVP - cada escola será um tenant isolado, mesmo que inicialmente só exista o Colégio Essência Feliz.

**Resource Requirements:**

- 1 desenvolvedor full-stack (Renato)
- 7 dias de desenvolvimento full-time
- Stack: Frameworks com suporte nativo a multi-tenancy

### MVP Feature Set (Phase 1)

**Core User Journeys Suportadas:**

1. Marina - Ver diário, receber notificações, chat com professora
2. Prof. Carla - Preencher diário, responder chat
3. Daviane - Ver o sistema funcionando com a marca dela
4. Ana - Cadastrar alunos e responsáveis

**Must-Have Capabilities:**

| #   | Capability                      | Microserviço           |
| --- | ------------------------------- | ---------------------- |
| 1   | Login/Logout com tenant context | Auth + User Management |
| 2   | Cadastro de usuários por tenant | Auth + User Management |
| 3   | Perfis e permissões (RBAC)      | Auth + User Management |
| 4   | **Multi-tenant isolation**      | Auth + User Management |
| 5   | Chat privado                    | Comunicação Multicanal |
| 6   | Push notifications              | Comunicação Multicanal |
| 7   | Status de leitura               | Comunicação Multicanal |
| 8   | Diário do aluno                 | Engajamento Escolar    |
| 9   | Mural de fotos                  | Engajamento Escolar    |
| 10  | Comunicados                     | Engajamento Escolar    |
| 11  | Landing page                    | Frontend Web           |

**Arquitetura Multi-Tenant MVP:**

| Componente    | Estratégia                                                |
| ------------- | --------------------------------------------------------- |
| **Database**  | Schema compartilhado com `tenant_id` em todas as tabelas  |
| **Auth**      | JWT com `tenant_id` no payload                            |
| **API**       | Middleware de tenant validation em todas as rotas         |
| **Storage**   | Pastas separadas por tenant (fotos/arquivos)              |
| **Subdomain** | `{escola}.app.colegioessenciafeliz.com.br` (future-ready) |

**Dados de Demo:**

- **Tenant 1:** Colégio Essência Feliz (dados reais)
- 5 responsáveis fictícios
- 3 professores
- 1 admin (Daviane)
- 3 turmas (3º, 4º, 5º ano)

### Post-MVP Features

**Phase 2 (Growth - 1-2 meses):**

- School-Core Service (gestão de turmas/calendário)
- Dashboard administrativo para Daviane
- Migração de dados do AgendaEdu
- Projetos Pedagógicos
- **Super-admin panel** (gerenciar múltiplos tenants)

**Phase 3 (Expansion - 6+ meses):**

- Ouvidoria/SAC
- Suporte Técnico
- Relatórios avançados
- Onboarding self-service para novos tenants
- Potencial comercialização como SaaS

### Risk Mitigation Strategy

| Risco                                | Mitigação                                                         | Fallback                                              |
| ------------------------------------ | ----------------------------------------------------------------- | ----------------------------------------------------- |
| **Timeline apertada + Multi-tenant** | Usar Supabase (RLS nativo) ou framework com multi-tenant built-in | Entregar multi-tenant parcial (tenant_id nas tabelas) |
| **Complexidade de isolamento**       | RLS (Row Level Security) no PostgreSQL                            | Criar tenant fictício para validar isolamento         |
| **Daviane não aprovar**              | Demo polida com identidade visual dela                            | Iterar com feedback dela                              |
| **Desenvolvedor solo**               | MVP minimalista em features, robusto em arquitetura               | Priorizar multi-tenant + auth + diário                |

---

## Functional Requirements

### 1. Multi-Tenancy & Platform

- **FR1:** Sistema pode hospedar múltiplos tenants (escolas/filiais) com isolamento completo de dados
- **FR2:** Filiais herdam a identidade visual da matriz (logo, cores, nome)
- **FR3:** Configurações de escola são gerenciadas apenas pela matriz
- **FR4:** Sistema pode identificar o tenant correto através de subdomain ou parâmetro

### 2. Autenticação & Gerenciamento de Usuários

- **FR5:** Matriz (Colégio Essência Feliz) cadastra todos os usuários do sistema
- **FR6:** Usuários fazem login com usuário e senha provisória fornecida pela escola, sendo obrigatória a troca por senha definitiva no primeiro acesso
- **FR7:** Usuários solicitam nova senha diretamente à escola (sem self-service de recuperação)
- **FR8:** Escola define quais campos do perfil cada usuário pode atualizar manualmente
- **FR9:** Cada usuário possui apenas um perfil; se pessoa for pai e professor, terá dois cadastros separados
- **FR10:** Administradores podem criar, editar e desativar contas de usuários
- **FR11:** Secretaria pode cadastrar novos alunos no sistema
- **FR12:** Secretaria pode vincular múltiplos responsáveis a um aluno
- **FR13:** Secretaria pode definir níveis de permissão por responsável (principal/secundário)

### 3. Controle de Acesso (RBAC)

- **FR14:** Sistema pode restringir acesso a recursos baseado no perfil do usuário
- **FR15:** Administradores podem acessar todos os recursos do tenant
- **FR16:** Professores podem acessar apenas recursos de suas turmas
- **FR17:** Responsáveis podem acessar apenas dados de seus filhos vinculados
- **FR18:** Responsáveis secundários têm acesso somente leitura

### 4. Comunicação & Chat

- **FR19:** Responsáveis podem iniciar conversas privadas com professores de seus filhos
- **FR20:** Professores podem responder mensagens de responsáveis
- **FR21:** Administradores podem enviar comunicados para todos os responsáveis
- **FR22:** Administradores podem enviar comunicados segmentados por turma
- **FR23:** Sistema pode indicar status de entrega e leitura de mensagens
- **FR24:** Usuários podem receber notificações push de novas mensagens

### 5. Engajamento Escolar - Diário

- **FR25:** Professores podem criar registros diários para cada aluno
- **FR26:** Professores podem incluir observações de comportamento, alimentação e atividades
- **FR27:** Responsáveis podem visualizar o diário do dia de seus filhos
- **FR28:** Sistema pode notificar responsáveis quando novo diário é publicado
- **FR29:** Professores podem preencher diário por turma (aplicar a múltiplos alunos)

### 6. Engajamento Escolar - Mural & Mídia

- **FR30:** Professores podem publicar fotos no mural da turma
- **FR31:** Professores podem publicar vídeos no mural da turma
- **FR32:** Responsáveis podem visualizar mídia no mural das turmas de seus filhos
- **FR33:** Sistema pode notificar responsáveis sobre novas publicações no mural
- **FR34:** Sistema pode armazenar mídia de forma organizada por tenant e turma

### 7. Gestão Escolar Básica

- **FR35:** Administradores podem criar e gerenciar turmas
- **FR36:** Administradores podem vincular professores a turmas
- **FR37:** Administradores podem vincular alunos a turmas
- **FR38:** Sistema pode exibir lista de alunos por turma para professores

### 8. Notificações

- **FR39:** Sistema pode enviar push notifications para dispositivos móveis
- **FR40:** Configurações de notificação são definidas pela escola (usuários não configuram)
- **FR41:** Sistema pode agrupar notificações para evitar spam
- **FR42:** Administradores podem visualizar métricas de entrega de notificações

### 9. Landing Page & Presença Web

- **FR43:** Visitantes podem acessar página institucional da escola
- **FR44:** Landing page pode exibir informações sobre a escola (quem somos, turmas, diferenciais)
- **FR45:** Visitantes podem acessar área de login através da landing page
- **FR46:** Landing page pode se adaptar a diferentes tamanhos de tela (responsivo)

### 10. Acessibilidade & Usabilidade

- **FR47:** Interface pode exibir fontes em tamanho aumentado para usuários idosos
- **FR48:** Interface pode usar ícones claros e navegação simplificada
- **FR49:** Sistema pode funcionar em dispositivos Android (app nativo)
- **FR50:** Sistema pode funcionar em dispositivos iOS (app nativo)

---

## Non-Functional Requirements

### Performance

| Requisito                                         | Métrica                | Target                    |
| ------------------------------------------------- | ---------------------- | ------------------------- |
| **NFR1:** Tempo de resposta da API                | Response time          | < 500ms (95th percentile) |
| **NFR2:** Tempo de carregamento inicial do app    | First contentful paint | < 3 segundos              |
| **NFR3:** Latência de mensagens em tempo real     | WebSocket delivery     | < 2 segundos              |
| **NFR4:** Tempo de entrega de push notifications  | Push delivery          | < 5 segundos              |
| **NFR5:** Tempo de upload de mídia (fotos/vídeos) | Upload completion      | < 10 segundos para 5MB    |

### Security

| Requisito                                                      | Implementação                           |
| -------------------------------------------------------------- | --------------------------------------- |
| **NFR6:** Dados sensíveis são criptografados em repouso        | AES-256 ou equivalente                  |
| **NFR7:** Todas as comunicações são criptografadas em trânsito | TLS 1.2+ obrigatório                    |
| **NFR8:** Senhas são armazenadas com hash seguro               | bcrypt ou Argon2                        |
| **NFR9:** Tokens de autenticação expiram periodicamente        | JWT com refresh token (24h/7d)          |
| **NFR10:** Isolamento completo de dados entre tenants          | RLS ou schema separation                |
| **NFR11:** Logs de auditoria para ações administrativas        | Registro de quem/quando/o que           |
| **NFR12:** Conformidade com LGPD para dados de menores         | Consentimento + direito ao esquecimento |

### Scalability

| Requisito                                | Métrica          | Target MVP       | Target Future |
| ---------------------------------------- | ---------------- | ---------------- | ------------- |
| **NFR13:** Usuários simultâneos          | Concurrent users | 100              | 10.000        |
| **NFR14:** Mensagens por minuto          | Throughput       | 500              | 50.000        |
| **NFR15:** Armazenamento de mídia        | Storage capacity | 50GB             | 5TB           |
| **NFR16:** Número de tenants             | Tenant count     | 1                | 100+          |
| **NFR17:** Degradação graceful sob carga | Performance drop | < 20% em 2x load |

### Reliability

| Requisito                             | Métrica       | Target                           |
| ------------------------------------- | ------------- | -------------------------------- |
| **NFR18:** Disponibilidade do sistema | Uptime        | > 99.5% (mensal)                 |
| **NFR19:** Recovery Time Objective    | RTO           | < 4 horas                        |
| **NFR20:** Recovery Point Objective   | RPO           | < 1 hora (perda máxima de dados) |
| **NFR21:** Backup automático          | Frequency     | Diário, retenção 30 dias         |
| **NFR22:** Monitoramento de saúde     | Health checks | A cada 1 minuto                  |

### Accessibility

| Requisito                                | Implementação                           |
| ---------------------------------------- | --------------------------------------- |
| **NFR23:** Suporte a fontes aumentadas   | Configuração de tamanho de fonte no app |
| **NFR24:** Contraste adequado            | WCAG AA (4.5:1 para texto normal)       |
| **NFR25:** Navegação simplificada        | Máximo 3 níveis de profundidade         |
| **NFR26:** Ícones com labels descritivos | Texto alternativo em todos os ícones    |
| **NFR27:** Touch targets adequados       | Mínimo 44x44 pixels                     |

### Compatibility

| Requisito                                  | Versão Mínima                                 |
| ------------------------------------------ | --------------------------------------------- |
| **NFR28:** Android                         | Android 8.0 (API 26)                          |
| **NFR29:** iOS                             | iOS 13+                                       |
| **NFR30:** Navegadores web (landing/admin) | Chrome 90+, Safari 14+, Firefox 88+, Edge 90+ |
| **NFR31:** Responsividade                  | Mobile-first, suporte 320px a 1920px          |

### Maintainability

| Requisito                      | Implementação                           |
| ------------------------------ | --------------------------------------- |
| **NFR32:** Cobertura de testes | > 70% para código crítico (auth, RBAC)  |
| **NFR33:** Documentação de API | OpenAPI/Swagger para todos os endpoints |
| **NFR34:** Logs estruturados   | JSON format com correlation ID          |
| **NFR35:** Deploy automatizado | CI/CD pipeline para todos os ambientes  |
