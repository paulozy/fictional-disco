# Fictional Disco - Scheduling System MVP

Sistema de gerenciamento de escalas de turnos com geração automática de schedules baseada em dias de trabalho dos funcionários.

## 🎯 Features Implementadas

### ⭐ Get Schedule by Week (Auto-Create)
Obtém schedules semanais com auto-criação:
- Retorna schedule + shifts com employee details
- Cria automaticamente a schedule se não existir
- Calcula automaticamente weekEnd (weekStart + 6 dias)
- Endpoint: `GET /schedules/:weekStart`

### � Billing & Payment Gateway
Sistema de billing integrado com Stripe:
- Criação automática de customer no Stripe ao criar empresa
- Planos: FREE (padrão) e PRO (pago)
- Webhook para atualizar status de pagamento
- Endpoint de checkout para upgrade
- Rollback automático se criação de customer falhar

### 📦 Módulos
- **Companies** - Gerenciar empresas com integração de pagamento
- **Users** - Usuários do sistema (admin/manager)
- **Employees** - Funcionários com detalhes de horários
- **Schedules** - Escalas semanais
- **Shifts** - Turnos individuais
- **Auth** - Autenticação com JWT
- **Billing** - Sistema de pagamento e subscriptions

## 🛠 Stack Tecnológico

- **Runtime:** Node.js
- **Linguagem:** TypeScript
- **Compilador:** SWC (ultra-rápido)
- **Testes:** Jest
- **ORM:** Prisma
- **Banco:** PostgreSQL
- **Autenticação:** JWT + bcrypt
- **Container:** Docker

## 📊 Estatísticas

```
✅ 34 testes passando (8 suites)
✅ 17 usecases implementados
✅ 100 arquivos compilados em ~90ms
✅ Zero erros TypeScript
✅ API HTTP completa (7 módulos)
✅ Integração com Stripe
✅ CORS habilitado (ngrok ready)
```

## 🚀 Quick Start

### 1. Clonar e instalar
```bash
git clone <repo>
cd fictional-disco
npm install
```

### 2. Subir banco de dados
```bash
docker compose up -d
```

### 3. Configurar .env
```bash
cp .env.example .env
# Editar DATABASE_URL se necessário
```

### 4. Rodar migrations
```bash
npx prisma migrate dev
```

### 5. Desenvolver
```bash
npm run dev      # Watch mode com SWC + Express
npm test         # Executar testes
npm run build    # Build para produção
```

### 6. Publicar com ngrok (opcional)
```bash
ngrok http --url=<seu-dominio> 3000
```

## 📁 Estrutura de Pastas

```
src/
├── modules/
│   ├── companies/      # Empresas (entities, repositories, usecases)
│   ├── users/          # Usuários
│   ├── employees/      # Funcionários
│   ├── schedules/      # Escalas (com AutoGenerateScheduleUseCase)
│   ├── shifts/         # Turnos
│   └── auth/           # Autenticação
├── shared/
│   ├── entities/       # BaseEntity com UUID v4
│   ├── repositories/   # Interfaces de Repository
│   ├── usecases/       # Interfaces de UseCase
│   ├── cryptography/   # Encripção e JWT
│   └── testing/        # In-memory repositories para testes
```

## 🔐 Segurança

- **Senhas:** bcrypt com 10 salt rounds
- **Tokens:** JWT HS256 com expiração de 24h
- **Banco:** Foreign keys com cascade delete
- **Índices:** Otimizados para queries comuns

## 📝 Prisma Schema

```typescript
Company ─┬─→ User
         ├─→ Employee
         ├─→ Schedule ─→ Shift ←─ Employee
```

## 🧪 Testes

```bash
npm test                 # Rodar todos
npm run test:watch     # Watch mode
npm run test:coverage  # Cobertura detalhada
```

## 📚 Documentação

- [API Documentation](./API_DOCUMENTATION.md) - Detalhes de todos os endpoints
- [OpenAPI/Swagger](./openapi.json) - Especificação completa
- [Prisma Schema](./prisma/schema.prisma) - Modelo de dados

## 🎓 Padrões Utilizados

- **DDD** - Domain Driven Design
- **Repository Pattern** - Abstração de data
- **Dependency Injection** - Desacoplamento
- **Factory Method** - Criação de entidades
- **Use Case Pattern** - Organização de lógica

## 📡 Endpoints Principais

### Auth
- `POST /auth/login` - Login de usuário

### Companies
- `POST /companies/register` - Registrar nova empresa + admin user
- `GET /companies` - Listar empresas

### Employees
- `GET /employees` - Listar funcionários
- `POST /employees` - Criar funcionário

### Schedules
- `GET /schedules/:weekStart` - Get schedule com shifts + employees (auto-cria se não existir)

### Shifts
- `POST /shifts` - Criar shift
- `GET /shifts` - Listar shifts

## 🔄 Próximos Passos

- [ ] Implementar filtros e paginação em endpoints
- [ ] Adicionar validações mais rigorosas
- [ ] Integração tests com banco real
- [ ] Sistema de permissões (RBAC)
- [ ] CI/CD pipeline
- [ ] Testes de performance

## 📄 Licença

MIT
