# Docker Compose Guide

## Iniciar PostgreSQL

```bash
docker-compose up -d
```

## Verificar status

```bash
docker-compose ps
```

## Ver logs

```bash
docker-compose logs -f postgres
```

## Parar PostgreSQL

```bash
docker-compose down
```

## Remover tudo (dados inclusos)

```bash
docker-compose down -v
```

## Conectar ao banco manualmente

```bash
docker-compose exec postgres psql -U postgres -d fictional_disco
```

## Variáveis de Ambiente

As seguintes variáveis podem ser configuradas no `.env.local`:

- `DB_USER`: Usuário PostgreSQL (padrão: postgres)
- `DB_PASSWORD`: Senha PostgreSQL (padrão: postgres)
- `DB_NAME`: Nome do banco de dados (padrão: fictional_disco)
- `DB_HOST`: Host do banco (padrão: localhost)
- `DB_PORT`: Porta do banco (padrão: 5432)

## Database URL (Prisma)

```
postgresql://postgres:postgres@localhost:5432/fictional_disco?schema=public
```

## Exemplo com valores customizados

```bash
DB_USER=myuser DB_PASSWORD=mypass DB_NAME=mydb docker-compose up -d
```
