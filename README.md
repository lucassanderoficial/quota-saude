# QuotaSaude

SaaS para clínicas com portais de Admin, Clínica, Médico e Paciente.

## MVP atual

- Landing de produto com visual healthtech premium.
- Login demo por papel.
- Dashboard responsivo desktop/mobile.
- Papéis e permissões iniciais modelados.
- Agenda, cotas, estados de loading/empty/error e navegação mobile.
- PWA manifest e ícone.

## Stack

- Next.js App Router
- React + TypeScript strict
- CSS tokens próprios
- Lucide React
- Deploy Vercel

## Rodar localmente

```bash
npm install
npm run build
npm run dev
```

Acesse `http://localhost:3000`.

## Próxima etapa recomendada

1. Autenticação real com senha hash, sessão httpOnly e recuperação de senha.
2. Banco PostgreSQL com Prisma ou Drizzle.
3. Multi-tenant por clínica.
4. CRUD real para clínicas, médicos, pacientes, agendas e cotas.
5. Auditoria e permissões granulares.
