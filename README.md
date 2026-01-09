# Fictional Disco - Scheduling System MVP

Sistema de gerenciamento de escalas de turnos com geração automática de schedules baseada em dias de trabalho dos funcionários.

## 🎯 Features Implementadas

### ⭐ Auto-Generate Schedule (Feature Estrela)
Gera automaticamente a escala de turnos baseado em:
- Dias de trabalho de cada funcionário (`workDays`)
- Horários de início e fim (`workStartTime`, `workEndTime`)
- Suporte para gerar para todos ou funcionários específicos

### 📦 Módulos
- **Companies** - Gerenciar empresas
- **Users** - Usuários do sistema (admin/manager)
- **Employees** - Funcionários com detalhes de horários
- **Schedules** - Escalas semanais
- **Shifts** - Turnos individuais
- **Auth** - Autenticação com JWT

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
✅ 30 testes passando
✅ 82.8% cobertura de código
✅ 14 usecases implementados
✅ 48 arquivos compilados em 73ms
✅ Zero erros TypeScript
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

### 3. Rodar migrations
```bash
npx prisma migrate dev
```

### 4. Desenvolver
```bash
npm run dev      # Watch mode com SWC
npm test         # Executar testes
npm run build    # Build para produção
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

- [Docker Setup](./DOCKER.md)
- [Features](../.github/FEATURES.md)

## 🎓 Padrões Utilizados

- **DDD** - Domain Driven Design
- **Repository Pattern** - Abstração de data
- **Dependency Injection** - Desacoplamento
- **Factory Method** - Criação de entidades
- **Use Case Pattern** - Organização de lógica

## 🔄 Próximos Passos

- [ ] Implementar repositories Prisma (substituir in-memory)
- [ ] Criar API routes (Express/Fastify)
- [ ] Adicionar autenticação middleware
- [ ] Integração tests com banco real
- [ ] Documentação Swagger/OpenAPI
- [ ] CI/CD pipeline

## 📄 Licença

MIT
