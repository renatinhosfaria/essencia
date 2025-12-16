---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - "Inspiração SaaS_ Funções AgendaEdu.pdf"
  - "Pesquisa Digital Colégio Essência Feliz.pdf"
  - "bmm-workflow-status.yaml (context captured)"
workflowType: "product-brief"
lastStep: 5
project_name: "Essencia"
user_name: "Renato"
date: "2025-12-11"
---

# Product Brief: Essencia

**Date:** 2025-12-11
**Author:** Renato

---

## Executive Summary

O **Essencia** é uma plataforma SaaS educacional desenvolvida exclusivamente para o Colégio Essência Feliz, substituindo a dependência do AgendaEdu por uma solução própria, moderna e totalmente personalizada com a identidade visual da escola.

**Proposta de Valor:** Eliminar o custo de R$24.000/ano com o AgendaEdu, oferecendo uma plataforma superior, exclusiva e sob controle total da escola - em troca de bolsa de estudos para os filhos do desenvolvedor.

**Diferencial Competitivo:** Ao contrário de soluções genéricas como AgendaEdu que cobram por aluno e não permitem customização, o Essencia é construído sob medida, com a identidade visual do colégio, dados sob controle da escola, e evolução baseada nas necessidades reais da instituição.

---

## Core Vision

### Problem Statement

O Colégio Essência Feliz, localizado em Uberlândia/MG, enfrenta uma dependência crítica do aplicativo AgendaEdu para comunicação com as famílias dos seus ~250 alunos. Esta dependência gera:

- **Custo elevado:** R$2.000/mês (R$8/aluno) totalizando R$24.000/ano
- **Risco operacional:** Se o AgendaEdu sair do ar, a escola fica completamente sem canal de comunicação com os pais
- **Dados cativos:** Informações de alunos e famílias ficam presas no sistema de terceiros
- **Zero customização:** O app não reflete a identidade visual do colégio (cores, marca)
- **Sem voz:** Sugestões de melhorias da escola são ignoradas pelo fornecedor

### Problem Impact

Quando a comunicação escola-família falha, as consequências são imediatas e sérias:

- **Para a escola:** Perda de credibilidade, reclamações de pais, retrabalho para contactar famílias por outros meios
- **Para os pais:** Informações críticas não chegam a tempo (ex: pai que vai buscar filho mais cedo e a escola não foi avisada)
- **Para os alunos:** Desorganização afeta a rotina escolar e o bem-estar das crianças

A comunicação entre escola e família é a base de confiança que sustenta toda a relação educacional.

### Why Existing Solutions Fall Short

O **AgendaEdu** (solução atual) apresenta limitações fundamentais:

| Limitação                    | Impacto                                                      |
| ---------------------------- | ------------------------------------------------------------ |
| Modelo de cobrança por aluno | Custo cresce com a escola, sem benefício proporcional        |
| Plataforma genérica          | Não reflete a identidade e valores cristãos do colégio       |
| Vendor lock-in               | Dados e histórico ficam presos se mudar de fornecedor        |
| Sem customização             | Escola não pode adaptar funcionalidades às suas necessidades |
| Suporte distante             | Sugestões de melhoria são ignoradas                          |
| Single point of failure      | Indisponibilidade = comunicação zero                         |

### Proposed Solution

O **Essencia** é uma plataforma SaaS educacional completa, construída com arquitetura de microserviços:

**URLs do Sistema:**

- Landing Page: `colegioessenciafeliz.com.br` (site institucional renovado)
- Plataforma SaaS: `app.colegioessenciafeliz.com.br`
- Apps Nativos: Play Store e Apple Store

**Microserviços Core (12 módulos):**

1. **Auth Service** - Login seguro com múltiplos métodos
2. **User Management** - Cadastro e gestão de usuários (pais, alunos, professores, staff)
3. **School-Core Service** - Gestão de turmas, matrículas, estrutura escolar (preparado para filiais)
4. **Comunicação Multicanal** - Mensagens, canais, grupos (inspirado AgendaEdu)
5. **Engajamento Escolar** - Diário, atividades, comunicados, mural de fotos
6. **Projetos Pedagógicos** - Virtudes Cristãs, Líder em Mim, projetos da escola
7. **Dashboard** - Visão consolidada para gestores
8. **Ouvidoria/SAC** - Canal para elogios, críticas, reclamações
9. **Suporte Técnico** - Atendimento a usuários da plataforma

**Plataformas:**

- Web responsivo (desktop/tablet)
- App mobile nativo (Android/iOS)

### Key Differentiators

| Essencia                               | AgendaEdu             |
| -------------------------------------- | --------------------- |
| ✅ Gratuito (troca por bolsa)          | ❌ R$24.000/ano       |
| ✅ Identidade visual do colégio        | ❌ Genérico           |
| ✅ Escola dona dos dados               | ❌ Vendor lock-in     |
| ✅ Customização total                  | ❌ Zero flexibilidade |
| ✅ Evolui com a escola                 | ❌ Ignora sugestões   |
| ✅ Arquitetura moderna (microserviços) | ❌ Monolítico legado  |
| ✅ Preparado para filiais              | ❌ Estrutura fixa     |
| ✅ Desenvolvedor local e acessível     | ❌ Suporte distante   |

---

## Target Users

### Primary Users

#### 1. Pais/Responsáveis (~250 famílias)

**Persona: Marina, 34 anos - Mãe Atarefada**

- **Perfil:** Pais jovens (25-45 anos), classe média, média de 2 filhos por família
- **Dispositivo:** 90% mobile (smartphone)
- **Rotina:** Trabalham durante o dia, buscam filhos no fim da tarde
- **Uso atual:** Recebem comunicados, enviam mensagens, acompanham diário
- **Maior frustração:** Demora nas respostas - "Mandei mensagem às 10h e só responderam às 15h"
- **Necessidade core:** Comunicação rápida, visibilidade do dia-a-dia escolar em tempo real
- **Momento de valor:** Saber tudo que aconteceu na escola antes de buscar os filhos

#### 2. Professores (~10)

**Persona: Prof. Carla, 28 anos - Professora Dedicada**

- **Perfil:** Educadores comprometidos, nível técnico básico a intermediário
- **Necessidade:** Interface simples, bonita e funcional - "funcionar sem pensar"
- **Uso diário:** Enviar diário dos alunos, comunicados para pais, responder chat
- **Frustração:** Interfaces confusas, muitos cliques para tarefas simples
- **Necessidade core:** Fazer o essencial com poucos cliques, feedback visual de que funcionou

### Secondary Users

#### 3. Diretoria (Daviane)

**Persona: Daviane, 45 anos - Diretora Visionária**

- **Contexto:** Fundou a escola em 2013, conhece cada família pessoalmente
- **Acompanhamento atual:** Superficial, sem métricas reais
- **Frustração:** Falta visibilidade sobre engajamento de professores e pais
- **Necessidades do Dashboard:**
  - Professores que não estão usando o sistema
  - Pais que não estão acessando
  - Chats não respondidos (SLA de resposta)
  - Métricas de engajamento geral
- **Necessidade core:** Controle e visibilidade para tomar decisões proativas

#### 4. Staff de Apoio (~10)

**Persona: Seu João, 55 anos - Porteiro Atencioso**

- **Perfil:** Assistentes, administrativo, pátio, porteiro
- **Tech level:** Básico - precisam de interfaces extremamente simples
- **Necessidades específicas:**
  - Porteiro: Lista de autorizados para buscar, alertas de saída antecipada
  - Administrativo: Gestão de cadastros, suporte a pais
  - Pátio: Comunicação rápida com professores
- **Necessidade core:** Informação certa na hora certa, sem complexidade

### User Journey

**Jornada Principal: Pai/Mãe no dia-a-dia**

| Momento                 | Ação                  | Valor Entregue                                    |
| ----------------------- | --------------------- | ------------------------------------------------- |
| **Manhã (7h)**          | Deixa filho, abre app | Vê comunicados e agenda do dia                    |
| **Durante o dia**       | Recebe notificações   | Fotos, atividades, atualizações em tempo real     |
| **Necessidade urgente** | Envia mensagem        | Resposta rápida (<30min) da escola                |
| **Fim do dia**          | Busca filho           | Já sabe tudo pelo diário, conversa engajada       |
| **Momento AHA!**        | Percepção de valor    | "Sei tudo da escola antes de buscar meus filhos!" |

**Jornada do Professor: Rotina diária**

| Momento          | Ação               | Valor Entregue                                |
| ---------------- | ------------------ | --------------------------------------------- |
| **Início aula**  | Abre app           | Vê mensagens pendentes de pais                |
| **Durante aula** | Registra no diário | Poucos cliques, interface intuitiva           |
| **Intervalo**    | Responde chats     | Comunicação rápida com pais                   |
| **Fim do dia**   | Envia resumo       | Pais recebem antes da busca                   |
| **Momento AHA!** | Percepção de valor | "Consigo fazer tudo rápido e os pais adoram!" |

---

## Success Metrics

### Sucesso do Projeto (Desenvolvedor)

| Métrica | Target | Medição |
|---------|--------|---------||
| **Aceitação da proposta** | Sim | Acordo formal com a escola |
| **Bolsa concedida** | 100% | 2 alunos com mensalidade zerada |
| **Entrega do MVP** | Funcional | Sistema em produção com features core |

**Valor da Troca:**

- Escola economiza: R$24.000/ano (custo AgendaEdu)
- Desenvolvedor recebe: Bolsa 100% para 2 filhos
- **Win-Win:** Escola economiza E ganha sistema superior

### Sucesso para a Escola (Business Objectives)

| Objetivo                    | Métrica                  | Target                     |
| --------------------------- | ------------------------ | -------------------------- |
| **Satisfação dos usuários** | Feedbacks positivos      | > 80% positivos            |
| **Adoção do sistema**       | % usuários ativos        | > 90% dos pais usando      |
| **Identidade própria**      | App com marca do colégio | 100% personalizado         |
| **Independência**           | Dados sob controle       | 100% propriedade da escola |
| **Economia**                | Custo vs AgendaEdu       | R$24.000/ano economizados  |

### Sucesso para os Usuários

**Pais/Responsáveis:**

| Métrica                      | Target                       | Como Medir                  |
| ---------------------------- | ---------------------------- | --------------------------- |
| **Engajamento**              | > 90% ativos/mês             | Dashboard de acessos        |
| **Satisfação**               | Feedbacks positivos          | Sistema de avaliação in-app |
| **Tempo de resposta**        | < 30 min (horário comercial) | SLA de mensagens            |
| **Informação em tempo real** | Diário disponível até 17h    | Timestamp de publicação     |

**Professores:**

| Métrica               | Target            | Como Medir             |
| --------------------- | ----------------- | ---------------------- |
| **Uso diário**        | 100% professores  | Dashboard de atividade |
| **Diário preenchido** | Todo dia letivo   | Alertas de pendência   |
| **Chats respondidos** | < 30 min          | SLA tracking           |
| **Facilidade de uso** | Feedback positivo | Pesquisa de satisfação |

**Diretoria:**

| Métrica                | Target             | Como Medir                 |
| ---------------------- | ------------------ | -------------------------- |
| **Visibilidade total** | Dashboard completo | Todas métricas disponíveis |
| **Alertas proativos**  | Automático         | Notificações de problemas  |
| **Relatórios**         | Mensal             | Export de dados            |

### Key Performance Indicators (KPIs)

**KPIs de Engajamento:**

- Taxa de adoção de pais: > 90%
- Taxa de uso diário de professores: 100%
- Mensagens respondidas no SLA: > 95%
- NPS (Net Promoter Score): > 50

**KPIs Técnicos:**

- Uptime: > 99.5% (máximo ~1.8 dias down/ano)
- Tempo de resposta do app: < 3 segundos
- Disponibilidade mobile: 24/7
- Tempo de carregamento inicial: < 5 segundos

**KPIs de Negócio:**

- Economia anual vs AgendaEdu: R$24.000
- Custo operacional: Apenas infraestrutura cloud
- Satisfação geral: > 80% feedbacks positivos

---

## MVP Scope

### Estratégia de Entrega

**Abordagem:** Demo funcional com usuários fictícios para apresentação à diretora Daviane
**Timeline:** 1 semana (full-time development)
**Objetivo:** Convencer a escola com sistema funcionando, não apenas apresentação

### Core Features - Fase 1 (MVP)

**URLs do Sistema:**

- Landing Page: `colegioessenciafeliz.com.br`
- Plataforma SaaS: `app.colegioessenciafeliz.com.br`

#### 1. Auth + User Management

- Login seguro (email/senha)
- Cadastro de usuários
- Perfis: Pai/Responsável, Professor, Coordenação, Admin
- Gestão de permissões por perfil
- Dados de demonstração (usuários fictícios)

#### 2. Comunicação Multicanal

- Chat privado (escola ↔ família)
- Canais por turma
- Notificações push
- Histórico de conversas
- Status de leitura

#### 3. Engajamento Escolar

- Diário do aluno (registro diário)
- Comunicados gerais e por turma
- Mural de fotos/atividades
- Envio de atividades/lições

#### 4. Landing Page (Site Institucional)

- Design moderno com identidade visual do colégio
- Seções: Quem Somos, Turmas, Diferenciais, Contato
- Integração com área de login do SaaS
- Mobile-first (responsivo)

### Out of Scope for MVP

**Fase 2 - Pós-aprovação da escola:**

| Microserviço         | Descrição                                            | Prioridade |
| -------------------- | ---------------------------------------------------- | ---------- |
| School-Core Service  | Gestão de turmas, matrículas, estrutura multi-filial | Alta       |
| Dashboard            | Métricas de engajamento, relatórios, alertas         | Alta       |
| Projetos Pedagógicos | Virtudes Cristãs, Líder em Mim, projetos             | Média      |
| Ouvidoria/SAC        | Canal de feedbacks, elogios, reclamações             | Média      |
| Suporte Técnico      | Atendimento a usuários, FAQ, tickets                 | Baixa      |

**Também fora do MVP:**

- Apps nativos (Play Store/Apple Store) - usar PWA inicialmente
- Integração com sistemas externos
- Pagamentos/financeiro
- Relatórios avançados

### MVP Success Criteria

**Para considerar o MVP bem-sucedido:**

| Critério                     | Validação                                    |
| ---------------------------- | -------------------------------------------- |
| **Demo funcional**           | Sistema rodando com dados fictícios          |
| **Apresentação convincente** | Daviane entende o valor e quer usar          |
| **Acordo fechado**           | Proposta de troca (sistema por bolsa) aceita |
| **Feedback positivo**        | "Isso é melhor que o AgendaEdu"              |

**Métricas de validação técnica:**

- Login funcionando para todos os perfis
- Chat enviando e recebendo mensagens em tempo real
- Diário sendo preenchido e visualizado pelos pais
- Site institucional responsivo e profissional

### Cronograma MVP (7 dias)

| Dia | Foco                      | Entregáveis                               |
| --- | ------------------------- | ----------------------------------------- |
| D1  | Setup + Auth              | Projeto base, autenticação funcionando    |
| D2  | User Management           | Perfis, permissões, seed de dados         |
| D3  | Comunicação - Base        | Chat privado operacional                  |
| D4  | Comunicação - Canais      | Canais por turma, notificações            |
| D5  | Engajamento - Diário      | Registro e visualização do diário         |
| D6  | Engajamento - Comunicados | Comunicados, mural de fotos               |
| D7  | Landing + Deploy          | Site institucional, deploy, testes finais |

### Future Vision

**Fase 2 (1-2 meses após aprovação):**

- Implementação dos microserviços restantes
- Dashboard completo para Daviane
- Migração de dados do AgendaEdu (se disponível)

**Fase 3 (3-6 meses):**

- Apps nativos (React Native/Flutter)
- Publicação na Play Store e Apple Store
- Features avançadas baseadas em feedback real

**Visão de longo prazo (1+ ano):**

- Sistema totalmente independente do AgendaEdu
- Possibilidade de expansão para filiais
- Potencial de oferecer para outras escolas (modelo SaaS)
