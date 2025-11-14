# Guia de Início Rápido - Econnect MVP

## 🚀 Setup Local (sem Docker)

### Pré-requisitos
- Node.js 18+
- PostgreSQL 15+
- Git

### 1. Clone e Configure

```bash
cd /workspaces/Econnect
npm install
```

### 2. Configure o Banco de Dados

```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar .env.local com suas credenciais PostgreSQL
# DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/econnect_db"
```

### 3. Executar Migrações

```bash
# Criar tabelas
npm run db:migrate:dev

# Semear dados de exemplo
npm run db:seed
```

### 4. Iniciar Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## 🐳 Setup com Docker Compose

### Pré-requisitos
- Docker & Docker Compose

### 1. Iniciar Containers

```bash
docker-compose up -d
```

### 2. Executar Migrações (primeira vez)

```bash
docker-compose exec app npm run db:migrate:deploy
docker-compose exec app npm run db:seed
```

### 3. Acessar Aplicação

- **Frontend**: http://localhost:3000
- **Database**: localhost:5432

---

## 👤 Usuários de Teste

Após seeding, use estas credenciais:

| Tipo | Email | Senha | Acesso |
|------|-------|-------|--------|
| Admin | admin@econnect.com | admin123456 | /dashboard/admin |
| Produtor | produtor@example.com | producer123456 | /dashboard/producer |
| Empresa | empresa@example.com | company123456 | /dashboard/company |

---

## 📚 Rotas Principais

### Públicas
- `GET /` - Landing page
- `GET /auth/login` - Página de login
- `GET /auth/register` - Página de registro

### Autenticadas
- `GET /dashboard/producer` - Dashboard do produtor
- `GET /dashboard/company` - Dashboard da empresa
- `GET /dashboard/admin` - Dashboard administrativo

---

## 🔌 API Endpoints

### Autenticação
```bash
# Registrar
POST /api/auth/register
Content-Type: application/json

{
  "email": "novo@user.com",
  "password": "senha123456",
  "name": "Novo Usuário",
  "type": "PRODUCER"
}

# Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "novo@user.com",
  "password": "senha123456"
}
```

### Áreas
```bash
# Listar minhas áreas
GET /api/areas
Authorization: Bearer {token}

# Criar nova área
POST /api/areas
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Minha Floresta",
  "description": "Descrição",
  "hectares": 50,
  "documentUrl": "https://...",
  "imageUrl": "https://..."
}
```

### Créditos
```bash
# Listar créditos disponíveis
GET /api/credits?status=AVAILABLE

# Listar créditos do usuário
GET /api/credits?userId={userId}

# Criar crédito (apenas admin)
POST /api/credits
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "areaId": "area_id",
  "quantity": 100,
  "price": 50
}
```

### Transações
```bash
# Comprar crédito
POST /api/transactions
Authorization: Bearer {token}
Content-Type: application/json

{
  "creditId": "credit_id",
  "quantity": 10,
  "price": 500
}

# Listar minhas transações
GET /api/transactions
Authorization: Bearer {token}
```

### Relatórios
```bash
# Gerar relatório ESG (PDF)
GET /api/reports/esg/{userId}?format=pdf
Authorization: Bearer {token}

# Gerar relatório ESG (CSV)
GET /api/reports/esg/{userId}?format=csv
Authorization: Bearer {token}

# Estatísticas gerais (admin)
GET /api/reports/stats
Authorization: Bearer {admin_token}
```

### Admin
```bash
# Listar todos os usuários
GET /api/admin/users
Authorization: Bearer {admin_token}

# Listar todas as áreas
GET /api/admin/areas
Authorization: Bearer {admin_token}

# Validar área
PATCH /api/admin/areas/{areaId}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "VALIDATED"
}
```

---

## 📋 Checklist MVP

- ✅ Cadastro de usuários (PRODUCER, COMPANY, ADMIN)
- ✅ Autenticação com JWT
- ✅ Registro de áreas preservadas
- ✅ Validação de áreas (admin)
- ✅ Geração de créditos de carbono
- ✅ Marketplace com carrinho
- ✅ Transações de compra
- ✅ Relatórios ESG (PDF/CSV)
- ✅ Dashboard administrativo
- ✅ API REST completa
- ✅ Banco de dados PostgreSQL + Prisma
- ✅ Frontend React + Next.js + TypeScript
- ✅ Docker & Docker Compose
- ⏳ OAuth 2.0 (próxima versão)
- ⏳ Blockchain integration (próxima versão)
- ⏳ Integração MapBiomas/INPE (próxima versão)

---

## 🔍 Troubleshooting

### Erro de conexão com banco
```bash
# Verificar se PostgreSQL está rodando
docker-compose logs postgres

# Recrear banco
docker-compose down -v
docker-compose up -d
docker-compose exec app npm run db:migrate:deploy
```

### Erro ao fazer build
```bash
# Limpar node_modules
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Limpar tudo
```bash
docker-compose down -v
rm -rf node_modules
npm install
docker-compose up -d
npm run db:migrate:dev
npm run db:seed
```

---

## 📞 Desenvolvimento

### Adicionar nova rota API
1. Criar arquivo em `app/api/[recurso]/route.ts`
2. Implementar handlers (GET, POST, PATCH, DELETE)
3. Usar middleware de autenticação
4. Validar com Zod schemas

### Adicionar nova página
1. Criar arquivo em `app/[rota]/page.tsx`
2. Importar componentes
3. Usar `'use client'` para client components
4. Conectar com API

### Adicionar modelo Prisma
1. Editar `prisma/schema.prisma`
2. Criar migration: `npm run db:migrate:dev`
3. Usar no código

---

## 🚢 Deployment

### Vercel (Frontend)
```bash
# Conectar repo e fazer deploy automático
vercel deploy
```

### AWS/GCP (Backend + DB)
```bash
# Build image Docker
docker build -t econnect:latest -f docker/Dockerfile .

# Push to registry
docker push your-registry/econnect:latest
```

---

## 📝 Licença & Contribuição

Desenvolvido com ❤️ para a sustentabilidade.

Para contribuir, faça fork, crie branch e envie pull request!
