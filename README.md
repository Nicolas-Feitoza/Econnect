# Econnect - MVP Platform de Créditos de Carbono Sustentáveis

Uma plataforma de marketplace para negociar créditos de carbono, conectando produtores, comunidades e empresas interessadas em compensação ambiental com transparência e rastreabilidade.

## 🌿 Visão Geral

Econnect é um MVP que permite:
- **Produtores/Comunidades**: Registrar áreas preservadas e gerar créditos de carbono
- **Empresas**: Visualizar, negociar e comprar créditos para compensação ESG
- **Plataforma**: Validar áreas, gerar relatórios auditáveis e manter transparência

## 🏗️ Arquitetura

```
Econnect/
├── frontend/                 # Next.js + React + TailwindCSS
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
├── backend/                  # Next.js API Routes + Node.js
│   ├── pages/api/
│   ├── lib/
│   └── middleware/
├── database/                 # PostgreSQL + Prisma ORM
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── docker/                   # Docker & Docker Compose
└── docs/                     # Documentação
```

## 🚀 Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 18, Next.js 14, TypeScript, TailwindCSS |
| **Backend** | Next.js API Routes, Express (opcional), Node.js |
| **Database** | PostgreSQL 15 + Prisma ORM |
| **Auth** | JWT + bcrypt |
| **Relatórios** | jsPDF, CSV export |
| **Infraestrutura** | Docker, Docker Compose |

## 📋 Funcionalidades do MVP

### MVP v1.0 (Core Features)
- ✅ Cadastro de usuários (Produtor, Empresa, Admin)
- ✅ Autenticação com email/senha + JWT
- ✅ Registro de áreas preservadas com upload de documentos
- ✅ Validação automática básica de áreas
- ✅ Geração de créditos de carbono (tokens digitais)
- ✅ Marketplace para visualizar e negociar créditos
- ✅ Relatórios básicos (PDF/CSV)
- ✅ Dashboard administrativo
- ✅ API REST completa

### Roadmap (v1.1+)
- [ ] OAuth 2.0 (Google, Gov.br)
- [ ] Integração com MapBiomas/INPE
- [ ] Blockchain (Hyperledger/Polygon)
- [ ] Pagamento via Pix
- [ ] Gráficos avançados (D3.js)
- [ ] Validação IA de imagens satélite

## 🛠️ Instalação & Setup

### Pré-requisitos
- Node.js 18+
- Docker & Docker Compose
- Git

### 1. Estrutura

```bash
npm install
```

### 2. Configure variáveis de ambiente

```bash
cp .env.example .env.local
```

### 3. Start com Docker Compose

```bash
docker-compose up -d
```

## 🔐 Segurança

- ✅ Senhas com bcrypt (salt rounds: 12)
- ✅ JWT com expiração configurável
- ✅ Validação de entrada (Zod)
- ✅ CORS configurado
- ✅ Logs de auditoria

---

**Desenvolvido com ❤️ para a sustentabilidade**