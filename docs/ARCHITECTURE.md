# Arquitetura - Econnect MVP

## 📐 Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js + React)                   │
│  Landing Page | Auth | Produtor | Empresa | Admin Dashboards   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST ↓
┌─────────────────────────────────────────────────────────────────┐
│            API Layer (Next.js API Routes + Middleware)          │
│  /api/auth | /api/areas | /api/credits | /api/transactions    │
└─────────────────────────────────────────────────────────────────┘
                              ↓ SQL ↓
┌─────────────────────────────────────────────────────────────────┐
│           Database Layer (PostgreSQL + Prisma ORM)              │
│  Users | Areas | Credits | Transactions | AuditLogs            │
└─────────────────────────────────────────────────────────────────┘
```

## 🏗️ Stack Técnico

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State**: React Hooks (useState, useEffect)
- **HTTP Client**: Fetch API
- **Validação**: Zod (client-side)

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Autenticação**: JWT + bcrypt
- **Validação**: Zod
- **Middleware**: Custom auth middleware

### Database
- **Engine**: PostgreSQL 15
- **ORM**: Prisma
- **Migrations**: Prisma Migrate
- **Seed**: Prisma Seed

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Development**: Local / Dev Container

## 📊 Schema do Banco de Dados

```
┌──────────────────┐
│     USERS        │
├──────────────────┤
│ id (PK)          │
│ email (UNIQUE)   │
│ password (hash)  │
│ name             │
│ type (ENUM)      │ ─────────┐
│ avatar           │          │
│ bio              │          │
│ createdAt        │          │
└──────────────────┘          │
                              │
                    ┌─────────┴──────────┬──────────────┐
                    │                    │              │
        ┌───────────▼──────────┐  ┌──────▼────────┐  ┌─▼────────────┐
        │      AREAS           │  │   CREDITS    │  │ TRANSACTIONS │
        ├──────────────────────┤  ├──────────────┤  ├──────────────┤
        │ id (PK)              │  │ id (PK)      │  │ id (PK)      │
        │ userId (FK) ◄────────┤──┤ areaId (FK)  │  │ creditId (FK)│
        │ name                 │  │ tokenId      │  │ buyerId (FK) │
        │ description          │  │ quantity     │  │ sellerId (FK)│
        │ hectares             │  │ status       │  │ quantity     │
        │ location (JSON)      │  │ price        │  │ price        │
        │ status (ENUM)        │  │ createdAt    │  │ status       │
        │ documentUrl          │  └──────────────┘  │ createdAt    │
        │ imageUrl             │                    └──────────────┘
        │ createdAt            │
        └──────────────────────┘

┌────────────────────┐
│   AUDIT_LOGS       │
├────────────────────┤
│ id (PK)            │
│ action             │
│ entity             │
│ entityId           │
│ changes (JSON)     │
│ createdAt          │
└────────────────────┘
```

## 🔄 Fluxos Principais

### 1. Registro de Usuário
```
Frontend (Register Form)
    ↓
POST /api/auth/register
    ↓
Validar entrada (Zod)
    ↓
Hashear senha (bcrypt)
    ↓
Criar usuário no DB
    ↓
Gerar JWT token
    ↓
Salvar token no localStorage
    ↓
Redirect para dashboard
```

### 2. Registro de Área (Produtor)
```
Frontend (Area Form)
    ↓
POST /api/areas (com JWT)
    ↓
Autenticar usuario
    ↓
Validar dados (Zod)
    ↓
Criar área com status PENDING
    ↓
Admin valida manualmente
    ↓
Se VALIDATED → Gerar créditos automaticamente
```

### 3. Marketplace - Compra de Créditos
```
Frontend (Marketplace)
    ↓
Visualizar créditos disponíveis (GET /api/credits)
    ↓
Adicionar ao carrinho
    ↓
POST /api/transactions (com JWT)
    ↓
Validar crédito está disponível
    ↓
Criar transaction
    ↓
Atualizar status do crédito para SOLD
    ↓
Retornar confirmação
```

### 4. Geração de Relatório ESG
```
Frontend (Report Page)
    ↓
GET /api/reports/esg/{userId}?format=pdf
    ↓
Autenticar usuario
    ↓
Coletar dados (áreas, créditos, transações)
    ↓
Calcular métricas
    ↓
Gerar HTML/PDF/CSV
    ↓
Download no browser
```

## 🔐 Segurança

### Autenticação
- **JWT Token**: Gerado no login, incluso em header `Authorization: Bearer <token>`
- **Expiração**: Configurável (default: 7 dias)
- **Verificação**: A cada request autenticado

### Senhas
- **Hash**: bcrypt com 12 salt rounds
- **Nunca armazenado** em plain text
- **Validação**: Mínimo 8 caracteres

### Autorização
- **Middleware**: Verifica token a cada rota protegida
- **RBAC**: User type (PRODUCER, COMPANY, ADMIN) determina acesso
- **Validação**: Zod schema para todas as entradas

### CORS & Headers
- **CORS**: Configurado via Next.js
- **HTTPS**: Recomendado em produção
- **Content-Type**: Validado em requests

## 📁 Estrutura de Arquivos

```
Econnect/
├── app/                           # Next.js App Router
│   ├── api/
│   │   ├── auth/[action]/         # Login, Register
│   │   ├── areas/                 # CRUD de áreas
│   │   ├── credits/               # CRUD de créditos
│   │   ├── transactions/          # Compra de créditos
│   │   ├── reports/               # Geração de relatórios
│   │   └── admin/                 # Funções administrativas
│   ├── auth/                      # Páginas de auth
│   ├── dashboard/                 # Dashboards
│   ├── layout.tsx                 # Layout raiz
│   ├── page.tsx                   # Landing page
│   └── globals.css                # Estilos globais
├── components/                    # Componentes React reutilizáveis
├── lib/
│   ├── jwt.ts                     # Geração/Verificação JWT
│   ├── password.ts                # Hash de senhas
│   ├── auth.ts                    # Middleware de auth
│   ├── validations.ts             # Schemas Zod
│   └── prisma.ts                  # Cliente Prisma
├── middleware/                    # Middlewares customizados
├── prisma/
│   ├── schema.prisma              # Definição do banco
│   └── seed.ts                    # Seed de dados
├── docker/
│   └── Dockerfile                 # Configuração Docker
├── docker-compose.yml             # Orquestração de containers
├── docs/                          # Documentação
├── .env.example                   # Variáveis de exemplo
├── package.json                   # Dependências
├── next.config.js                 # Configuração Next.js
└── tailwind.config.js             # Configuração Tailwind
```

## 🔌 Integrações Futuras

### OAuth 2.0
- Google Sign-In
- Gov.br (ID federado brasileiro)
- Será implementado com `next-auth`

### Blockchain
- Hyperledger Fabric (consórcio privado)
- Polygon (rede pública)
- Smart contracts para tokens rastreáveis

### APIs Externas
- MapBiomas: Validação de áreas preservadas
- INPE: Dados de satélite
- Open Finance: Pagamento via Pix

### IA/ML
- Validação automática de imagens satélite
- Detecção de desmatamento
- Recomendações de compra

## 🚀 Performance & Scalability

### Otimizações Atuais
- **SSR via Next.js**: Melhor SEO e performance
- **Image Optimization**: Imagens otimizadas automaticamente
- **Database Indexes**: Índices em userId, creditId
- **Pagination**: Implementável nas listagens

### Para Produção
- **CDN**: Cloudflare para assets estáticos
- **Caching**: Redis para sessões e dados frequentes
- **Database Replication**: Múltiplas réplicas PostgreSQL
- **Load Balancer**: Nginx/HAProxy
- **Horizontal Scaling**: Containers em Kubernetes
- **API Rate Limiting**: Implementar no API Gateway

## 📈 Monitoramento

### Logs
- PostgreSQL logs
- Next.js server logs
- Application error tracking (Sentry)

### Métricas
- Response time de API
- Taxa de erro
- Número de usuários ativos
- Volume de transações

### Alerts
- Downtime da aplicação
- Erros 5xx
- Latência elevada
- Espaço em disco PostgreSQL

---

**Última atualização**: Novembro 2024
