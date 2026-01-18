# ⚡ Solidify | Productivity Ecosystem & Knowledge Base

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6.1-2D3748?style=for-the-badge&logo=prisma)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)

O **Solidify** é uma plataforma avançada de gestão de conhecimento e produtividade, projetada para ser o "segundo cérebro" do usuário moderno. O projeto foca em três pilares principais: organização hierárquica de informações, automação inteligente via LLMs e um sistema de foco resiliente a ambientes de navegadores restritivos.

---

## Visão de Engenharia & Decisões de Arquitetura

Cada decisão foi tomada visando performance, tipagem estrita e escalabilidade.

### Infraestrutura de Dados: Supabase & Prisma

A persistência de dados foi um dos maiores desafios técnicos. Optei pelo **Supabase (PostgreSQL)** devido à complexidade relacional do sistema de notas recursivas.

- **Connection Pooling (PgBouncer):** Em ambientes serverless (Vercel), as conexões podem se esgotar rapidamente. Configurei a `DATABASE_URL` para utilizar o **Transaction Pooler** na porta `6543`. Isso garante que a aplicação suporte múltiplas requisições simultâneas sem derrubar a instância do banco de dados.
- **Prisma ORM:** Escolhido para garantir _Type-Safety_ de ponta a ponta. Toda a estrutura do banco é sincronizada com o TypeScript, garantindo que erros de schema sejam detectados em tempo de compilação.

### Autenticação: Clerk

Implementei o **Clerk** para gerenciar a identidade de forma robusta. Ele oferece proteção de rotas via Middleware e integração nativa com o Next.js, permitindo um fluxo de autenticação seguro e sem a necessidade de manter um backend dedicado para tokens e sessões.

### Heatmap estilo GitHub

Adicionei ao projeto um **Heatmap estilo GitHub**, em que o usuário consegue ter insights rápidos e visuais do seu desempenho no último ano, mês, semana e dias. Tudo aqui foi pensando para motivar ainda mais quem está atrás de "solidificar" os seus objetivos.

### Resiliência em Segundo Plano: O Sistema Pomodoro

Navegadores modernos aplicam _throttling_ em abas inativas, o que costuma "congelar" cronômetros baseados em `setInterval`.

- **Solução Técnica:** Implementei uma lógica de **Timestamp Synchronization**. O cronômetro não conta segundos de forma isolada; ele calcula o momento exato do término (`expectedEndTime`). Caso o usuário mude de aba e o navegador pause o JavaScript, ao retornar, o sistema recalcula o tempo restante baseado no relógio do sistema, mantendo a precisão atômica.

### Inteligência Artificial: Gemini IA Pro

Utilizei a API do **Google Generative AI** para transformar conteúdo estático em planos de ação. O sistema analisa notas e gera "Jornadas de Estudo" (Roadmaps) estruturadas, integrando inteligência artificial diretamente no fluxo de trabalho do usuário.

---

## Stack Tecnológica & Bibliotecas

| Tecnologia            | Finalidade    | Justificativa                                                                            |
| :-------------------- | :------------ | :--------------------------------------------------------------------------------------- |
| **Next.js 16.1**      | Framework     | Uso intensivo de _Server Actions_ e otimização via _Turbopack_.                          |
| **React 19**          | Library UI    | Implementação com o novo _React Compiler_ para memoização automática.                    |
| **BlockNote**         | Editor        | Editor baseado em blocos (JSON) que permite manipulação estruturada dos dados das notas. |
| **EdgeStore**         | File Storage  | Gerenciamento de imagens (capas/ícones) otimizado para latência ultra-baixa.             |
| **Shadcn/UI & Radix** | UI Primitives | Componentes acessíveis (WAI-ARIA) e customizáveis via Tailwind.                          |
| **Framer Motion**     | Animações     | Micro-interações táteis que melhoram a percepção de feedback do usuário.                 |
| **Zod**               | Validação     | Garantia de integridade de dados nas APIs e formulários.                                 |
| **Activity Calendar** | Visualização  | Heatmap (estilo GitHub) para visualização clara da constância do usuário.                |
| **Date-fns**          | Utilitários   | Manipulação de datas e fusos horários de forma leve e imutável.                          |

---

## Interface do Projeto

<table width="100%">
  <tr>
    <td width="50%">
      <p align="center"><b>Dashboard & Overview</b></p>
      <img src="/public/dashboard.png" width="100%" height="250px" style="object-fit: cover; border-radius: 8px;" />
    </td>
    <td width="50%">
      <p align="center"><b>Jornadas Ativas</b></p>
      <img src="/public/jornadas-ativas.png" width="100%" height="250px" style="object-fit: cover; border-radius: 8px;" />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <p align="center"><b>Pomodoro Timer</b></p>
      <img src="/public/pomodoro.png" width="100%" height="250px" style="object-fit: cover; border-radius: 8px;" />
    </td>
    <td width="50%">
      <p align="center"><b>Study Tracker & Heatmap</b></p>
      <img src="/public/study-tracker-heatmap.png" width="100%" height="250px" style="object-fit: cover; border-radius: 8px;" />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <p align="center"><b>Cadernos & Anotações</b></p>
      <img src="/public/cadernos.png" width="100%" height="250px" style="object-fit: cover; border-radius: 8px;" />
    </td>
    <td width="50%">
      <p align="center"><b>Lofi Player</b></p>
      <img src="/public/lofi-player.png" width="100%" height="250px" style="object-fit: cover; border-radius: 8px;" />
    </td>
  </tr>
  <tr>
     <td width="50%">
      <p align="center"><b>Mini Pomodoro Ativo durante navegação(Context)</b></p>
      <img src="/public/mini-pomodoro.png" width="100%" height="250px" style="object-fit: cover; border-radius: 8px;" />
    </td>
  </tr>
</table>

---

## Guia de Instalação e Execução

### 1. Pré-requisitos

- **Node.js 20+**
- Instância de banco de dados no **Supabase**.
- Chaves de API do **Clerk**, **EdgeStore** e **Google Gemini**.

### 2. Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
# Banco de Dados (Use a porta 6543 para Transaction Pooler)
DATABASE_URL="postgresql://postgres.[ID]:[SENHA]@[aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1](https://aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1)"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# EdgeStore
EDGE_STORE_ACCESS_KEY=...
EDGE_STORE_SECRET_KEY=...

# Gemini IA
GEMINI_API_KEY=...

``
# Instalar dependências
npm install

# Gerar o cliente Prisma e sincronizar schema
npx prisma generate
npx prisma db push

# Iniciar o servidor de desenvolvimento
npm run dev
```

---

## desenvolvido por Gabriel Tiziano.
