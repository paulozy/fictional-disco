# Arquitetura do Fictional Disco

## Diagrama de Fluxo de Criação de Empresa

```
┌─────────────────────────────────────────────────────────────────┐
│                  POST /companies/register                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. CreateCompanyRequest (name, segment, email, password)      │
│                          ↓                                      │
│  2. RegisterCompanyUseCase.execute()                           │
│        ├─ Validate email uniqueness                             │
│        ├─ Hash password (bcrypt)                                │
│        ├─ Create Company in Database                            │
│        │  └─ CompaniesRepository.create()                       │
│        │                                                         │
│        ├─ Create Stripe Customer                                │
│        │  └─ StripeBillingClient.createCustomer()              │
│        │     └─ Stripe API: POST /customers                     │
│        │                                                         │
│        ├─ Update Company with Stripe Customer ID                │
│        │  └─ CompaniesRepository.update()                       │
│        │                                                         │
│        ├─ Create Admin User                                     │
│        │  └─ UsersRepository.create()                           │
│        │                                                         │
│        └─ Generate JWT Token                                    │
│           └─ JwtTokenGenerator.generate()                       │
│                          ↓                                      │
│  3. RegisterCompanyResponse (company, user, token)             │
│                                                                 │
│  ⚠️  ROLLBACK: Se qualquer etapa falhar                        │
│     └─ CompaniesRepository.delete() (clean up)                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Relacionamento: Company ↔ Stripe Customer

```
┌──────────────┐                          ┌──────────────────┐
│   Company    │                          │ Stripe Customer  │
├──────────────┤                          ├──────────────────┤
│ id           │◄─────────────────────────│ id (cus_*)       │
│ name         │  paymentGateway          │ name             │
│ segment      │  CustomerId              │ metadata:        │
│ created_at   │                          │   companyId      │
│              │                          │                  │
└──────────────┘                          └──────────────────┘
     ↓                                            ↑
     └─────────────────────────────────────────┘
         Criado ao registrar company
         Usado para checkout de subscriptions
```

## Fluxo de Billing

```
1. Company Registration
   ├─ Company created
   ├─ Stripe customer created
   └─ Company updated with paymentGatewayCustomerId

2. GET /billing/status
   └─ Check subscription status (FREE by default)

3. POST /billing/checkout (upgrade to PRO)
   ├─ Company has paymentGatewayCustomerId
   ├─ Stripe checkout session created
   └─ Return checkoutUrl to frontend

4. Customer pays in Stripe
   └─ Stripe webhook sent to POST /billing/webhook

5. Webhook Processing
   ├─ Payment status updated (ACTIVE/INACTIVE)
   └─ Database updated with subscription details
```

## Stack Completo

```
┌─────────────────────────────────────────┐
│         Frontend / Mobile App            │
│       (Uses ngrok tunneled API)          │
└────────────────┬────────────────────────┘
                 │ HTTPS
                 ↓
┌─────────────────────────────────────────────────────┐
│      Express.js HTTP Server (Port 3000)             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Routes → Controllers → UseCases → Repositories    │
│                          ↓                          │
│                   Domain Logic                      │
│                      (DDD)                          │
│                                                     │
└────────┬─────────────────────────┬─────────────────┘
         │                         │
         ↓                         ↓
┌─────────────────┐    ┌──────────────────────┐
│   PostgreSQL    │    │   Stripe API         │
│   (Railway)     │    │   (Payment Gateway)  │
├─────────────────┤    ├──────────────────────┤
│                 │    │                      │
│ companies       │    │ ✓ createCustomer     │
│ users           │    │ ✓ createCheckout     │
│ employees       │    │ ✓ webhooks           │
│ schedules       │    │                      │
│ shifts          │    │ API Keys:            │
│ subscriptions   │    │ env: BILLING_API_KEY │
│                 │    │                      │
└─────────────────┘    └──────────────────────┘
```
