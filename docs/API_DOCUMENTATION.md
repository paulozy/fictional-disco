# 📚 Documentação da API - Fictional Disco

**Base URL:** `http://localhost:3000`

---

## � CORS Configuration

A API implementa CORS (Cross-Origin Resource Sharing) adaptativo baseado no ambiente:

- **Development** (`NODE_ENV != "production"`): Permite todas as origens
- **Production** (`NODE_ENV = "production"`): Restringe apenas às origens configuradas

**Variáveis de Ambiente:**
```bash
NODE_ENV=production
FRONTEND_URL=https://myapp.com
ALLOWED_ORIGINS=https://app.myapp.com,https://staging.myapp.com
```

Para mais detalhes, veja [CORS_CONFIGURATION.md](./CORS_CONFIGURATION.md)

---

## �🔐 Autenticação

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
    "paymentGatewayCustomerId": "cus_abc123",
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

**Descrição:** Cria um link de pagamento para upgrade para o plano PRO via Stripe. Retorna um link de checkout que o cliente deve acessar para completar o pagamento.

**Request Body:**
```json
{
  "plan": "PRO"
}
```

**Response (200 OK):**
```json
{
  "checkoutUrl": "https://checkout.stripe.com/pay/cs_...",
  "subscriptionId": "sub-1234567890"
}
```

**Erros:**
- `400` - Plano inválido ou ausente
- `401` - Token não fornecido ou inválido
- `500` - Erro ao gerar checkout

---

#### 2. Webhook do Stripe
```
POST /billing/webhook
```
**Autenticação:** ❌ Não requerida (validada por signature do Stripe)

**Descrição:** Endpoint para receber notificações do Stripe sobre mudanças de status de subscriptions. O Stripe envia automaticamente webhooks quando há mudanças no status da subscription.

**Request Body (enviado pelo Stripe):**
```json
{
  "customerId": "cus_abc123",
  "subscriptionId": "sub_def456",
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
- `CANCELLED` - Subscription cancelada pelo cliente
- `FAILED` - Falha no pagamento

---

#### 3. Verificar Status da Subscription
```
GET /billing/status
```
**Autenticação:** ✅ Requerida

**Descrição:** Retorna o status atual da subscription da empresa autenticada. Se a empresa não tem uma subscription, retorna o plano FREE padrão.

**Response (200 OK):**
```json
{
  "id": "sub-uuid",
  "companyId": "company-uuid",
  "plan": "PRO",
  "status": "ACTIVE",
  "paymentGatewayCustomerId": "cus_abc123",
  "paymentGatewaySubscriptionId": "sub_def456",
  "createdAt": "2026-01-09T02:00:00.000Z"
}
```

Se a empresa não tem subscription (plano FREE):
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

#### 4. Cancelar Subscription
```
DELETE /billing/subscription
```
**Autenticação:** ✅ Requerida

**Descrição:** Cancela a subscription PRO ativa da empresa autenticada. Após o cancelamento, a empresa volta para o plano FREE. O cancelamento é imediato e irrevogável.

**Response (200 OK):**
```json
{
  "id": "sub-uuid",
  "companyId": "company-uuid",
  "status": "CANCELLED",
  "message": "Subscription cancelled successfully"
}
```

**Erros:**
- `400` - Subscription não encontrada ou já cancelada
  ```json
  {
    "error": "Subscription not found for this company"
  }
  ```
  ou
  ```json
  {
    "error": "Subscription is already cancelled"
  }
  ```
- `401` - Token não fornecido ou inválido
- `500` - Erro ao cancelar subscription no Stripe

---

### Planos Disponíveis

#### FREE (Padrão)
- ✅ Gerenciamento de escalas básico
- ✅ Até 10 funcionários
- ✅ Suporte comunitário
- 💰 Sem custo

#### PRO
- ✅ Todos os recursos do FREE
- ✅ Funcionários ilimitados
- ✅ Relatórios avançados
- ✅ API completa
- ✅ Suporte prioritário
- ✅ Integrações customizadas
- 💰 R$ 99/mês (faturamento automático via Stripe)

---

### Fluxo de Pagamento com Stripe
1. Empresa autenticada acessa `POST /billing/checkout` com `plan: "PRO"`
2. Recebe `checkoutUrl` que aponta para a página de checkout do Stripe
3. Cliente é redirecionado para o Stripe para completar o pagamento
4. Após pagamento bem-sucedido, Stripe envia webhook para `POST /billing/webhook`
5. Sistema atualiza o status da subscription para `ACTIVE`
6. Cliente pode verificar seu plano em `GET /billing/status`
7. Renovação automática acontece mensalmente (gerenciada pelo Stripe)

### Integração com Stripe
- **Chave necessária:** `BILLING_API_KEY` (Secret Key do Stripe)
- **Variáveis de ambiente:**
  - `BILLING_API_KEY` - Secret key do Stripe
  - `BILLING_WEBHOOK_SECRET` - Webhook Signing Secret
  - `BILLING_PRO_PLAN_PRICE_ID` - ID do plano PRO no Stripe
  - `BILLING_SUCCESS_URL` - URL de redirecionamento após sucesso
  - `BILLING_CANCEL_URL` - URL de redirecionamento após cancelamento
- **Webhook:** Configure o Stripe para enviar eventos para `{seu_dominio}/billing/webhook`

---

## 💳 Planos e Paywall

O sistema implementa validação de planos através do middleware **Paywall**. Todos os usuários começam com o plano **FREE** e podem fazer upgrade para **PRO**.

### Planos Disponíveis

#### 📦 FREE
- **Máximo de Funcionários:** 5
- **Auto-generate Schedule:** ❌ Não disponível
- **Suporte:** Basic
- **Preço:** R$ 0,00/mês

#### ⭐ PRO
- **Máximo de Funcionários:** Ilimitado
- **Auto-generate Schedule:** ✅ Disponível
- **Suporte:** Priority
- **Preço:** R$ 29,00/mês

### Rotas Protegidas por Paywall

#### 1. Auto-generate Schedule (Requer PRO)
```
POST /schedules/:scheduleId/auto-generate
Authorization: Bearer <token>
```
**Proteção:** Requer plano **PRO**

**Erro de Paywall (403):**
```json
{
  "error": "FEATURE_NOT_AVAILABLE",
  "message": "This feature requires PRO plan. Current plan: FREE",
  "currentPlan": "FREE",
  "requiredPlan": "PRO"
}
```

#### 2. Criar Funcionário (Valida Limite)
```
POST /employees
Authorization: Bearer <token>
```
**Proteção:** Valida limite de funcionários conforme plano

- **FREE:** Máximo 5 funcionários
- **PRO:** Ilimitado

**Erro de Paywall (403):**
```json
{
  "error": "FEATURE_NOT_AVAILABLE",
  "message": "Feature \"maxEmployees\" is not available in FREE plan",
  "currentPlan": "FREE",
  "requiredPlan": "PRO"
}
```

### Erros de Paywall

O middleware retorna erros padronizados para o frontend:

| Erro | Código HTTP | Descrição |
|------|-------------|-----------|
| `FEATURE_NOT_AVAILABLE` | 403 | Feature não está disponível no plano atual |
| `PLAN_LIMIT_EXCEEDED` | 403 | Limite de recursos do plano foi atingido |
| `INVALID_SUBSCRIPTION` | 403 | Subscription não está ativa |
| `UNAUTHORIZED` | 401 | Usuário não autenticado |

---

## ⚠️ Notas Importantes

- **Token JWT**: Válido por 24 horas
- **Workdays**: Array de números 0-6 (0=domingo, 1=segunda, etc)
- **Horários**: Formato HH:MM em 24h
- **Email**: Deve ser único no sistema
- **Senhas**: Mínimo recomendado de 8 caracteres
- **CompanyId**: Obrigatório para criar usuários e funcionários
- **Soft Delete**: Funcionários são desativados, não deletados
- **Planos**: Todos os usuários iniciam com plano FREE
- **Paywall**: Algumas rotas validam o plano do usuário e retornam 403 se não permitido

---

## 🐛 Troubleshooting

### Erro 401: Token Inválido
- Verifique se o token está correto
- Token expirou? Faça login novamente
- Incluiu "Bearer " antes do token?

### Erro 403: FEATURE_NOT_AVAILABLE
- Seu plano não permite essa ação
- Faça upgrade para o plano PRO em `/billing/checkout`
- Verifique qual plano é necessário na documentação acima

### Erro 400: Campos Obrigatórios
- Verifique a documentação acima para ver quais campos são obrigatórios
- Valide o formato dos dados (datas, números, etc)

### Erro 404: Recurso Não Encontrado
- Verifique se o ID é válido
- O recurso pode ter sido deletado

---

**Versão**: 1.0.0  
**Última Atualização**: 10/01/2026  
**Status**: ✅ Em Produção
