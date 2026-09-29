import { Activity, Building2, CalendarCheck, FilePlus, ShieldCheck, Stethoscope, UserRound, UsersRound } from 'lucide-react';
import type { Appointment, QuotaSnapshot, RoleConfig, UserRole } from '@/domain/types';

export const roleConfigs: RoleConfig[] = [
  {
    id: 'admin',
    label: 'Admin',
    title: 'Operação da plataforma',
    description: 'Visão global de clínicas, planos, auditoria e saúde operacional do SaaS.',
    primaryMetric: '42 clínicas ativas',
    permissions: ['Gerenciar clientes', 'Auditar acessos', 'Configurar planos'],
  },
  {
    id: 'clinic',
    label: 'Clínica',
    title: 'Gestão da unidade',
    description: 'Agenda, médicos, pacientes, cotas de atendimento e operação financeira em um só lugar.',
    primaryMetric: '86% de ocupação',
    permissions: ['Agenda da clínica', 'Equipe médica', 'Cotas e repasses'],
  },
  {
    id: 'doctor',
    label: 'Médico',
    title: 'Rotina clínica clara',
    description: 'Agenda do dia, prontuário resumido, pendências e comunicação com a recepção.',
    primaryMetric: '12 atendimentos hoje',
    permissions: ['Agenda pessoal', 'Pacientes vinculados', 'Notas clínicas'],
  },
  {
    id: 'patient',
    label: 'Paciente',
    title: 'Portal do paciente',
    description: 'Agendamentos, lembretes, documentos e histórico simples de acompanhar.',
    primaryMetric: 'Próxima consulta 14:30',
    permissions: ['Meus agendamentos', 'Documentos', 'Atualizar cadastro'],
  },
];

export const appointments: Appointment[] = [
  { id: 'A-1042', time: '08:30', patient: 'Marina Lopes', doctor: 'Dra. Helena Prado', clinic: 'Unidade Jardins', status: 'checked_in', kind: 'Retorno' },
  { id: 'A-1043', time: '09:10', patient: 'Caio Ribeiro', doctor: 'Dr. Vitor Nunes', clinic: 'Teleconsulta', status: 'scheduled', kind: 'Primeira consulta' },
  { id: 'A-1044', time: '10:40', patient: 'Aline Moura', doctor: 'Dra. Helena Prado', clinic: 'Unidade Centro', status: 'requested', kind: 'Avaliação' },
  { id: 'A-1045', time: '11:20', patient: 'Rafael Dias', doctor: 'Dr. Vitor Nunes', clinic: 'Unidade Jardins', status: 'scheduled', kind: 'Exame' },
];

export const quotas: QuotaSnapshot[] = [
  { label: 'Consultas particulares', used: 138, total: 180 },
  { label: 'Convênio premium', used: 92, total: 120 },
  { label: 'Teleconsultas', used: 64, total: 100 },
];

export const roleIcons = {
  admin: ShieldCheck,
  clinic: Building2,
  doctor: Stethoscope,
  patient: UserRound,
};

export const navigation = [
  { label: 'Visão geral', href: '#app', icon: Activity },
  { label: 'Agenda', href: '#agenda', icon: CalendarCheck },
  { label: 'Pacientes', href: '#roles', icon: UsersRound },
  { label: 'Cotas', href: '#quotas', icon: FilePlus },
];

export function getRole(role: UserRole) {
  return roleConfigs.find((item) => item.id === role) ?? roleConfigs[0];
}
