# API Documentation - Econnect

## Base URL

```
http://localhost:3000/api
```

## Autenticação

Todas as rotas protegidas requerem o header:

```
Authorization: Bearer {JWT_TOKEN}
```

Obtém o token fazendo login em `POST /auth/login`.

## Endpoints

---

## 🔑 Autenticação

### Register
**POST** `/auth/register`

Registra um novo usuário.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "minhassenha123",
  "name": "João Silva",
  "type": "PRODUCER"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "cuid123",
    "email": "user@example.com",
    "name": "João Silva",
    "type": "PRODUCER",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Validações:**
- Email deve ser válido e único
- Senha mínimo 8 caracteres
- Name mínimo 3 caracteres
- Type deve ser: PRODUCER, COMPANY ou ADMIN

---

### Login
**POST** `/auth/login`

Faz login e retorna token JWT.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "minhassenha123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "cuid123",
    "email": "user@example.com",
    "name": "João Silva",
    "type": "PRODUCER"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "Login realizado com sucesso"
}
```

**Errors:**
- `401`: Email ou senha incorretos

---

## 🌍 Áreas Preservadas

### Listar Áreas
**GET** `/areas`

Lista as áreas do usuário autenticado. Admins veem todas as áreas.

**Query Parameters:**
- Nenhum obrigatório

**Response:** `200 OK`
```json
[
  {
    "id": "area123",
    "userId": "user123",
    "name": "Reserva Mata Atlântica",
    "description": "Floresta preservada",
    "hectares": 100,
    "location": "{\"lat\": -25.5, \"lng\": -54.5}",
    "status": "VALIDATED",
    "documentUrl": "https://...",
    "imageUrl": "https://...",
    "createdAt": "2024-01-15T10:30:00Z",
    "credits": [
      {
        "id": "credit123",
        "tokenId": "ECON-123456-001",
        "quantity": 1000,
        "status": "AVAILABLE",
        "price": 50
      }
    ]
  }
]
```

**Errors:**
- `401`: Token inválido ou não fornecido

---

### Criar Área
**POST** `/areas`

Registra uma nova área preservada. Status inicial é `PENDING`.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Nova Floresta",
  "description": "Área preservada no Pantanal",
  "hectares": 50,
  "location": "{\"lat\": -16.5, \"lng\": -56.5}",
  "documentUrl": "https://example.com/doc.pdf",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:** `201 Created`
```json
{
  "id": "area123",
  "userId": "user123",
  "name": "Nova Floresta",
  "hectares": 50,
  "status": "PENDING",
  "createdAt": "2024-01-15T10:30:00Z",
  "credits": []
}
```

**Validações:**
- Name: mínimo 3 caracteres
- Hectares: maior que 0
- Todos os campos opcionais

**Errors:**
- `400`: Dados inválidos
- `401`: Não autenticado

---

### Get Área
**GET** `/areas/{id}`

Retorna detalhes de uma área específica.

**Response:** `200 OK`
```json
{
  "id": "area123",
  "userId": "user123",
  "name": "Reserva Mata Atlântica",
  "hectares": 100,
  "status": "VALIDATED",
  "credits": [...]
}
```

**Errors:**
- `404`: Área não encontrada
- `401`: Não autenticado

---

### Update Área
**PATCH** `/areas/{id}`

Atualiza dados de uma área. Apenas o proprietário ou admin podem atualizar.

**Request:**
```json
{
  "name": "Novo Nome",
  "description": "Nova descrição"
}
```

**Response:** `200 OK` (área atualizada)

**Errors:**
- `403`: Sem permissão
- `404`: Área não encontrada

---

### Delete Área
**DELETE** `/areas/{id}`

Deleta uma área. Apenas o proprietário ou admin podem deletar.

**Response:** `200 OK`
```json
{
  "message": "Area deleted successfully"
}
```

---

## 💚 Créditos de Carbono

### Listar Créditos
**GET** `/credits`

Lista créditos disponíveis para compra.

**Query Parameters:**
- `status`: AVAILABLE, SOLD, RETIRED (opcional)
- `userId`: Filtrar por produtor (opcional)

**Response:** `200 OK`
```json
[
  {
    "id": "credit123",
    "areaId": "area123",
    "tokenId": "ECON-1234567-001",
    "quantity": 1000,
    "price": 50,
    "status": "AVAILABLE",
    "area": {
      "name": "Reserva Mata Atlântica",
      "user": {
        "id": "user123",
        "name": "João Silva"
      }
    }
  }
]
```

---

### Criar Crédito (Admin)
**POST** `/credits`

Cria créditos manualmente. Apenas admins.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request:**
```json
{
  "areaId": "area123",
  "quantity": 1000,
  "price": 50
}
```

**Response:** `201 Created`

---

## 💳 Transações

### Comprar Crédito
**POST** `/transactions`

Realiza compra de créditos.

**Headers:**
```
Authorization: Bearer {company_token}
```

**Request:**
```json
{
  "creditId": "credit123",
  "quantity": 100,
  "price": 5000
}
```

**Response:** `201 Created`
```json
{
  "id": "tx123",
  "creditId": "credit123",
  "buyerId": "company123",
  "sellerId": "producer123",
  "quantity": 100,
  "price": 5000,
  "status": "COMPLETED",
  "buyer": { "id": "company123", "name": "Tech Corp" },
  "seller": { "id": "producer123", "name": "João Silva" },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Validações:**
- Crédito deve existir
- Crédito deve estar com status AVAILABLE
- Quantidade deve ser positiva

**Errors:**
- `404`: Crédito não encontrado
- `409`: Crédito não está disponível
- `401`: Não autenticado

---

### Listar Transações
**GET** `/transactions`

Lista transações do usuário (como comprador ou vendedor).

**Response:** `200 OK`
```json
[
  {
    "id": "tx123",
    "creditId": "credit123",
    "quantity": 100,
    "price": 5000,
    "status": "COMPLETED",
    "buyer": { "id": "...", "name": "..." },
    "seller": { "id": "...", "name": "..." },
    "credit": { "tokenId": "ECON-..." },
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

## 📊 Relatórios

### Gerar Relatório ESG
**GET** `/reports/esg/{userId}?format=pdf`

Gera relatório de impacto ambiental em PDF ou CSV.

**Query Parameters:**
- `format`: pdf ou csv (default: pdf)

**Response:** `200 OK` (arquivo binário)

**Headers:**
```
Content-Type: text/pdf ou text/csv
Content-Disposition: attachment; filename=relatorio-esg.pdf
```

---

### Estatísticas Gerais (Admin)
**GET** `/reports/stats`

Retorna estatísticas gerais da plataforma. Apenas admin.

**Response:** `200 OK`
```json
{
  "platform": {
    "totalUsers": 150,
    "totalAreas": 42,
    "validatedAreas": 38,
    "pendingAreas": 4
  },
  "credits": {
    "total": 45000,
    "unit": "ton CO2"
  },
  "marketplace": {
    "totalTransactions": 256,
    "completedTransactions": 250,
    "pendingTransactions": 6
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🛡️ Admin

### Listar Usuários
**GET** `/admin/users`

Lista todos os usuários da plataforma. Apenas admin.

**Response:** `200 OK`
```json
[
  {
    "id": "user123",
    "email": "producer@example.com",
    "name": "João Silva",
    "type": "PRODUCER",
    "createdAt": "2024-01-15T10:30:00Z",
    "_count": {
      "areas": 3,
      "transactions": 12
    }
  }
]
```

---

### Listar Todas as Áreas
**GET** `/admin/areas`

Lista todas as áreas registradas. Apenas admin.

**Response:** `200 OK`
```json
[
  {
    "id": "area123",
    "name": "Reserva Mata Atlântica",
    "hectares": 100,
    "status": "PENDING",
    "user": { "name": "João Silva" },
    "credits": [...]
  }
]
```

---

### Validar Área
**PATCH** `/admin/areas/{id}`

Valida ou rejeita uma área. Se validada, créditos são gerados automaticamente.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request:**
```json
{
  "status": "VALIDATED"
}
```

**Status válidos:** VALIDATED, REJECTED

**Response:** `200 OK` (área atualizada)

**Side Effects:**
- Se status = VALIDATED: Cria créditos automaticamente (10 ton CO2/hectare)

---

## 🔍 Codes de Erro

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (dados inválidos) |
| 401 | Unauthorized (sem token ou token inválido) |
| 403 | Forbidden (sem permissão) |
| 404 | Not Found (recurso não encontrado) |
| 409 | Conflict (estado inconsistente) |
| 500 | Internal Server Error |

---

## 📝 Exemplo Completo

### 1. Registrar como Produtor
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "produtor@example.com",
    "password": "senha123456",
    "name": "João Silva",
    "type": "PRODUCER"
  }'
```

### 2. Fazer Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "produtor@example.com",
    "password": "senha123456"
  }'
# Retorna token
```

### 3. Registrar Área
```bash
curl -X POST http://localhost:3000/api/areas \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Minha Floresta",
    "hectares": 100,
    "description": "Área preservada"
  }'
```

### 4. Admin Valida Área
```bash
curl -X PATCH http://localhost:3000/api/admin/areas/{AREA_ID} \
  -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"status": "VALIDATED"}'
```

### 5. Empresa Compra Crédito
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer {COMPANY_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "creditId": "{CREDIT_ID}",
    "quantity": 100,
    "price": 5000
  }'
```

---

**Última atualização**: Novembro 2024
