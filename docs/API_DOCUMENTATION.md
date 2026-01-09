# 📚 Documentação da API - Fictional Disco

**Base URL:** `http://localhost:3000`

---

## 🔐 Autenticação

A maioria das rotas requer autenticação via **JWT Token**.

### Headers Requeridos
```
Authorization: Bearer <seu_token_jwt>
```

O token é válido por **24 horas**.

---

## 📋 Endpoints

### 🏢 COMPANIES

#### 1. Registrar Nova Empresa com Admin
```
POST /companies/register
```
**Autenticação:** ❌ Não requerida

**Descrição:** Cria uma nova empresa junto com um usuário administrador e retorna um JWT token para autenticação imediata.

**Request Body:**
```json
{
  "companyName": "Tech Solutions",
  "segment": "Technology",
  "adminEmail": "admin@techsolutions.com",
  "adminPassword": "senha_segura_123"
}
```

**Response (201 Created):**
```json
{
  "company": {
    "id": "uuid",
    "name": "Tech Solutions",
    "segment": "Technology",
    "createdAt": "2026-01-09T02:00:00.000Z"
  },
  "user": {
    "id": "uuid",
    "email": "admin@techsolutions.com",
    "role": "admin",
    "companyId": "uuid"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erros:**
- `400` - Campo obrigatório ausente ou email já existe
- `500` - Erro interno do servidor

---

#### 2. Criar Empresa
```
POST /companies
```
**Autenticação:** ❌ Não requerida

**Request Body:**
```json
{
  "name": "Tech Solutions",
  "segment": "Technology"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "name": "Tech Solutions",
  "segment": "Technology",
  "createdAt": "2026-01-09T02:00:00.000Z"
}
```

**Erros:**
- `400` - Name and segment são obrigatórios
- `500` - Erro interno do servidor

---

#### 3. Obter Minha Empresa
```
GET /companies/me
```
**Autenticação:** ✅ Requerida

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Tech Solutions",
  "segment": "Technology",
  "createdAt": "2026-01-09T02:00:00.000Z"
}
```

**Erros:**
- `401` - Token inválido ou expirado
- `404` - Empresa não encontrada
- `500` - Erro interno do servidor

---

### 👥 USERS

#### 1. Criar Usuário
```
POST /users
```
**Autenticação:** ❌ Não requerida

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "senha_segura_123",
  "role": "ADMIN",
  "companyId": "uuid_da_empresa"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "email": "usuario@example.com",
  "role": "ADMIN",
  "companyId": "uuid_da_empresa",
  "createdAt": "2026-01-09T02:00:00.000Z"
}
```

**Erros:**
- `400` - Email, password, role ou companyId obrigatórios
- `500` - Email já cadastrado ou erro interno

---

#### 2. Obter Meus Dados
```
GET /users/me
```
**Autenticação:** ✅ Requerida

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "usuario@example.com",
  "role": "ADMIN",
  "companyId": "uuid_da_empresa",
  "createdAt": "2026-01-09T02:00:00.000Z"
}
```

**Erros:**
- `401` - Token inválido ou expirado
- `404` - Usuário não encontrado
- `500` - Erro interno do servidor

---

### 🔑 AUTH

#### 1. Autenticar Usuário (Login)
```
POST /auth/login
```
**Autenticação:** ❌ Não requerida

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "senha_segura_123"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "usuario@example.com",
  "role": "ADMIN",
  "companyId": "uuid_da_empresa",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erros:**
- `400` - Email e password são obrigatórios
- `401` - Credenciais inválidas
- `500` - Erro interno do servidor

---

### 👨‍💼 EMPLOYEES

#### 1. Criar Funcionário
```
POST /employees
```
**Autenticação:** ✅ Requerida

**Request Body:**
```json
{
  "name": "João Silva",
  "role": "Developer",
  "phone": "11999999999",
  "workStartTime": "08:00",
  "workEndTime": "17:00",
  "workDays": [1, 2, 3, 4, 5],
  "companyId": "uuid_da_empresa"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "name": "João Silva",
  "role": "Developer",
  "phone": "11999999999",
  "active": true,
  "workStartTime": "08:00",
  "workEndTime": "17:00",
  "workDays": [1, 2, 3, 4, 5],
  "companyId": "uuid_da_empresa",
  "createdAt": "2026-01-09T02:00:00.000Z"
}
```

**Erros:**
- `400` - Campos obrigatórios faltando
- `401` - Token inválido
- `500` - Erro interno do servidor

---

#### 2. Listar Funcionários
```
GET /employees
```
**Autenticação:** ✅ Requerida

**Response (200 OK):**
```json
{
  "employees": [
    {
      "id": "uuid",
      "name": "João Silva",
      "role": "Developer",
      "phone": "11999999999",
      "active": true,
      "workStartTime": "08:00",
      "workEndTime": "17:00",
      "workDays": [1, 2, 3, 4, 5],
      "createdAt": "2026-01-09T02:00:00.000Z"
    }
  ]
}
```

**Erros:**
- `401` - Token inválido ou expirado
- `500` - Erro interno do servidor

---

#### 3. Atualizar Funcionário
```
PUT /employees/:employeeId
```
**Autenticação:** ✅ Requerida

**Path Parameters:**
- `employeeId` (string, required) - ID do funcionário

**Request Body:**
```json
{
  "name": "João Silva Updated",
  "role": "Senior Developer",
  "phone": "11988888888",
  "workStartTime": "07:00",
  "workEndTime": "16:00",
  "workDays": [1, 2, 3, 4, 5]
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "João Silva Updated",
  "role": "Senior Developer",
  "phone": "11988888888",
  "active": true,
  "workStartTime": "07:00",
  "workEndTime": "16:00",
  "workDays": [1, 2, 3, 4, 5],
  "companyId": "uuid_da_empresa",
  "createdAt": "2026-01-09T02:00:00.000Z"
}
```

**Erros:**
- `400` - Validação de campos falhou
- `401` - Token inválido
- `404` - Funcionário não encontrado
- `500` - Erro interno do servidor

---

#### 4. Desativar Funcionário
```
PATCH /employees/:employeeId/deactivate
```
**Autenticação:** ✅ Requerida

**Path Parameters:**
- `employeeId` (string, required) - ID do funcionário

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "João Silva",
  "role": "Developer",
  "phone": "11999999999",
  "active": false,
  "workStartTime": "08:00",
  "workEndTime": "17:00",
  "workDays": [1, 2, 3, 4, 5],
  "companyId": "uuid_da_empresa",
  "createdAt": "2026-01-09T02:00:00.000Z"
}
```

**Erros:**
- `401` - Token inválido
- `404` - Funcionário não encontrado
- `500` - Erro interno do servidor

---

### 📅 SCHEDULES

#### 1. Criar Escala
```
POST /schedules
```
**Autenticação:** ✅ Requerida

**Request Body:**
```json
{
  "weekStart": "2026-01-13",
  "companyId": "uuid_da_empresa"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "weekStart": "2026-01-13T00:00:00.000Z",
  "companyId": "uuid_da_empresa",
  "createdAt": "2026-01-09T02:00:00.000Z"
}
```

**Erros:**
- `400` - Campos obrigatórios faltando
- `401` - Token inválido
- `500` - Erro interno do servidor

---

#### 2. Obter Escala por Semana
```
GET /schedules/:weekStart
```
**Autenticação:** ✅ Requerida

**Descrição:** Obtém a escala de uma semana com todos os turnos e funcionários. Se a escala não existir, é criada automaticamente.

**Path Parameters:**
- `weekStart` (string, required) - Data de início da semana (YYYY-MM-DD)

**Response (200 OK):**
```json
{
  "schedule": {
    "id": "uuid",
    "weekStart": "2026-01-13T00:00:00.000Z",
    "weekEnd": "2026-01-19T00:00:00.000Z"
  },
  "shifts": [
    {
      "id": "uuid",
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "17:00",
      "employee": {
        "id": "uuid",
        "name": "João Silva",
        "role": "Garçom"
      }
    }
  ]
}
```

**Erros:**
- `401` - Token inválido
- `500` - Erro interno do servidor

---

#### 3. Auto-Gerar Turnos na Escala ⭐
```
POST /schedules/:scheduleId/auto-generate
```
**Autenticação:** ✅ Requerida

**Path Parameters:**
- `scheduleId` (string, required) - ID da escala

**Request Body:**
```json
{
  "employeeIds": ["uuid_funcionario_1", "uuid_funcionario_2"]
}
```

**Response (200 OK):**
```json
{
  "scheduleId": "uuid",
  "generatedShifts": 10,
  "message": "Shifts auto-generated successfully"
}
```

**Erros:**
- `400` - Schedule ID obrigatório
- `401` - Token inválido
- `404` - Escala ou funcionários não encontrados
- `500` - Erro ao gerar turnos

---

### ⏰ SHIFTS

#### 1. Criar Turno
```
POST /shifts
```
**Autenticação:** ✅ Requerida

**Request Body:**
```json
{
  "dayOfWeek": 1,
  "startTime": "08:00",
  "endTime": "17:00",
  "scheduleId": "uuid_escala",
  "employeeId": "uuid_funcionario"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "dayOfWeek": 1,
  "startTime": "08:00",
  "endTime": "17:00",
  "scheduleId": "uuid_escala",
  "employeeId": "uuid_funcionario",
  "createdAt": "2026-01-09T02:00:00.000Z"
}
```

**Erros:**
- `400` - Campos obrigatórios faltando
- `401` - Token inválido
- `500` - Erro interno do servidor

---

#### 2. Deletar Turno
```
DELETE /shifts/:shiftId
```
**Autenticação:** ✅ Requerida

**Path Parameters:**
- `shiftId` (string, required) - ID do turno

**Response (204 No Content)**

**Erros:**
- `401` - Token inválido
- `404` - Turno não encontrado
- `500` - Erro interno do servidor

---

## 🛠️ Health Check

```
GET /health
```
**Autenticação:** ❌ Não requerida

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-01-09T02:00:00.000Z"
}
```

---

## 📊 Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| `200` | OK - Requisição bem-sucedida |
| `201` | Created - Recurso criado com sucesso |
| `204` | No Content - Sucesso sem corpo de resposta |
| `400` | Bad Request - Erro de validação |
| `401` | Unauthorized - Token ausente ou inválido |
| `404` | Not Found - Recurso não encontrado |
| `500` | Internal Server Error - Erro do servidor |

---

## 🔑 Roles de Usuário

- `ADMIN` - Acesso total
- `MANAGER` - Gerenciar funcionários e escalas
- `EMPLOYEE` - Visualizar próprios dados

---

## 📝 Formato de Data

Todas as datas são retornadas em ISO 8601:
```
2026-01-09T02:00:00.000Z
```

Para enviar datas, use o formato:
```
2026-01-09 ou 2026-01-09T00:00:00.000Z
```

---

## 🚀 Exemplos de Uso

### Login e Obter Token
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "senha_segura_123"
  }'
```

### Usar Token em Requisições Protegidas
```bash
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer seu_token_jwt"
```

### Criar Funcionário
```bash
curl -X POST http://localhost:3000/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token_jwt" \
  -d '{
    "name": "João Silva",
    "role": "Developer",
    "phone": "11999999999",
    "workStartTime": "08:00",
    "workEndTime": "17:00",
    "workDays": [1, 2, 3, 4, 5],
    "companyId": "uuid_da_empresa"
  }'
```

---

## 💳 BILLING

#### 1. Criar Checkout para Upgrade PRO
```
POST /billing/checkout
```
**Autenticação:** ✅ Requerida

**Descrição:** Cria um checkout para upgrade para o plano PRO. Retorna um link de pagamento do AbacatePay.

**Request Body:**
```json
{
  "plan": "PRO"
}
```

**Response (200 OK):**
```json
{
  "checkoutUrl": "https://checkout.abacatepay.com/subscription-uuid",
  "subscriptionId": "sub-uuid"
}
```

**Erros:**
- `400` - Plano inválido ou ausente
- `401` - Token não fornecido ou inválido
- `500` - Erro ao gerar checkout

---

#### 2. Webhook de Pagamento
```
POST /billing/webhook
```
**Autenticação:** ❌ Não requerida (validada por signature)

**Descrição:** Endpoint para receber notificações do AbacatePay sobre mudanças de status de subscriptions.

**Request Body (enviado pelo AbacatePay):**
```json
{
  "customerId": "customer-abc123",
  "subscriptionId": "sub-def456",
  "status": "ACTIVE"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription updated to ACTIVE"
}
```

**Status possíveis:**
- `ACTIVE` - Pagamento confirmado, subscription ativa
- `CANCELLED` - Subscription cancelada
- `FAILED` - Falha no pagamento

---

#### 3. Verificar Status da Subscription
```
GET /billing/status
```
**Autenticação:** ✅ Requerida

**Descrição:** Retorna o status atual da subscription da empresa autenticada.

**Response (200 OK):**
```json
{
  "id": "sub-uuid",
  "companyId": "company-uuid",
  "plan": "PRO",
  "status": "ACTIVE",
  "paymentGatewayCustomerId": "customer-abc123",
  "paymentGatewaySubscriptionId": "sub-def456",
  "createdAt": "2026-01-09T02:00:00.000Z"
}
```

Se a empresa não tem subscription:
```json
{
  "id": "",
  "companyId": "company-uuid",
  "plan": "FREE",
  "status": "ACTIVE",
  "createdAt": "2026-01-09T02:00:00.000Z"
}
```

**Erros:**
- `401` - Token não fornecido ou inválido
- `500` - Erro interno do servidor

---

### Planos Disponíveis

#### FREE (Padrão)
- Funcionalidades básicas
- Sem custo
- Sem pagamento requerido

#### PRO
- Funcionalidades avançadas
- Relatórios detalhados
- Suporte prioritário
- Requer pagamento mensal via AbacatePay

---

### Fluxo de Pagamento
1. Empresa faz login
2. Acessa `POST /billing/checkout` com `plan: "PRO"`
3. Recebe `checkoutUrl` e abre no navegador
4. Completa pagamento no AbacatePay
5. AbacatePay envia webhook para `POST /billing/webhook`
6. Sistema atualiza status para `ACTIVE`
7. Empresa pode verificar status em `GET /billing/status`

---

## ⚠️ Notas Importantes

1. **Token JWT**: Válido por 24 horas
2. **Workdays**: Array de números 0-6 (0=domingo, 1=segunda, etc)
3. **Horários**: Formato HH:MM em 24h
4. **Email**: Deve ser único no sistema
5. **Senhas**: Mínimo recomendado de 8 caracteres
6. **CompanyId**: Obrigatório para criar usuários e funcionários
7. **Soft Delete**: Funcionários são desativados, não deletados

---

## 🐛 Troubleshooting

### Erro 401: Token Inválido
- Verifique se o token está correto
- Token expirou? Faça login novamente
- Incluiu "Bearer " antes do token?

### Erro 400: Campos Obrigatórios
- Verifique a documentação acima para ver quais campos são obrigatórios
- Valide o formato dos dados (datas, números, etc)

### Erro 404: Recurso Não Encontrado
- Verifique se o ID é válido
- O recurso pode ter sido deletado

---

**Versão**: 1.0.0  
**Última Atualização**: 09/01/2026  
**Status**: ✅ Em Produção
