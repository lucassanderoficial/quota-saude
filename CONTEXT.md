# QuotaSaude — contexto de domínio

## Produto
QuotaSaude é um SaaS para operação de clínicas de saúde, com portais separados para administração da plataforma, clínicas, médicos e pacientes.

## Papéis

### Admin
Usuário operador da plataforma QuotaSaude. Gerencia clínicas, planos, auditoria, usuários, saúde da operação e permissões globais.

### Clínica
Organização cliente do SaaS. Gerencia unidades, médicos, agenda, pacientes, atendimentos, convênios/cotas e indicadores financeiros/operacionais.

### Médico
Profissional vinculado a uma ou mais clínicas. Visualiza agenda, prontuário resumido, pacientes, prescrições/observações e solicitações pendentes.

### Paciente
Pessoa atendida. Acessa agendamentos, documentos, lembretes, histórico e canais de contato.

## Entidades principais

### Organization
Representa uma clínica ou rede de clínicas cliente.

### User
Conta de login vinculada a um papel: admin, clinic_manager, doctor ou patient.

### Appointment
Agendamento entre paciente, médico e clínica.

Status:
- requested: solicitado e pendente de confirmação.
- scheduled: confirmado na agenda.
- checked_in: paciente chegou.
- completed: atendimento finalizado.
- cancelled: cancelado.
- no_show: paciente não compareceu.

### DoctorProfile
Dados profissionais do médico: especialidade, CRM, agenda, unidades e status.

### PatientProfile
Dados do paciente: contato, documentos, histórico e preferências.

### CareQuota
Cota/limite operacional ou comercial da clínica, usado para acompanhar atendimentos, convênios, pacotes ou capacidade contratada.

### ClinicUnit
Unidade física ou virtual da clínica.

## Permissões iniciais
- Admin: acesso global, gestão de clientes, auditoria e planos.
- Clínica: acesso aos dados da própria organização.
- Médico: acesso à própria agenda e pacientes vinculados.
- Paciente: acesso apenas aos próprios dados e agendamentos.

## Nomes canônicos
Use `appointment`, `organization`, `doctor`, `patient`, `clinic`, `quota` no código. Evitar alternar com “booking”, “customer”, “professional” ou “lead” quando o conceito for o mesmo.
