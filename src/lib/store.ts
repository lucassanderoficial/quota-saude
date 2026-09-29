import type { Account, Appointment, Clinic, Doctor, Patient, Prescription, QuotaStore, UserRole } from '@/domain/types';

export const STORAGE_KEY = 'quotasaude.store.v2';
export const SESSION_KEY = 'quotasaude.session.v2';

const now = () => new Date().toISOString();

export const demoStore: QuotaStore = {
  clinics: [
    { id: 'clinic-vida', name: 'Clínica Vida Plena', city: 'São Paulo', plan: 'Growth' },
    { id: 'clinic-norte', name: 'Instituto Norte Saúde', city: 'Curitiba', plan: 'Starter' },
  ],
  doctors: [
    { id: 'doctor-marina', clinicId: 'clinic-vida', name: 'Dra. Marina Alves', specialty: 'Clínica Geral', crm: 'CRM-SP 18342', email: 'marina@quotasaude.app', phone: '(11) 98888-1001' },
    { id: 'doctor-rafael', clinicId: 'clinic-vida', name: 'Dr. Rafael Torres', specialty: 'Cardiologia', crm: 'CRM-SP 24418', email: 'rafael@quotasaude.app', phone: '(11) 97777-1002' },
  ],
  patients: [
    { id: 'patient-lia', clinicId: 'clinic-vida', name: 'Lia Martins', cpf: '123.456.789-00', birthDate: '1989-04-18', sex: 'feminino', phone: '(11) 99999-2211', email: 'lia@email.com', address: 'Rua Saúde, 120', allergies: 'Dipirona', notes: 'Acompanhamento mensal de pressão.', createdAt: now() },
    { id: 'patient-caio', clinicId: 'clinic-vida', name: 'Caio Ribeiro', cpf: '987.654.321-00', birthDate: '1978-11-03', sex: 'masculino', phone: '(11) 98888-3322', email: 'caio@email.com', address: 'Av. Paulista, 700', allergies: 'Nenhuma conhecida', notes: 'Retorno pós-exames.', createdAt: now() },
  ],
  appointments: [
    { id: 'appt-1', clinicId: 'clinic-vida', patientId: 'patient-lia', doctorId: 'doctor-marina', date: todayPlus(1), time: '09:30', reason: 'Retorno clínico', status: 'scheduled' },
    { id: 'appt-2', clinicId: 'clinic-vida', patientId: 'patient-caio', doctorId: 'doctor-rafael', date: todayPlus(2), time: '14:00', reason: 'Avaliação cardiológica', status: 'requested' },
  ],
  prescriptions: [
    { id: 'rx-1', clinicId: 'clinic-vida', patientId: 'patient-lia', doctorId: 'doctor-marina', medication: 'Losartana 50mg', dosage: '1 comprimido ao dia', instructions: 'Tomar pela manhã após café.', duration: '30 dias', status: 'active', issuedAt: todayPlus(0) },
  ],
  accounts: [
    { id: 'acc-admin', name: 'Admin QuotaSaude', email: 'admin@quotasaude.app', password: '123456', role: 'admin', createdAt: now() },
    { id: 'acc-clinic', name: 'Gestora Clínica Vida', email: 'clinica@quotasaude.app', password: '123456', role: 'clinic', clinicId: 'clinic-vida', createdAt: now() },
    { id: 'acc-doctor', name: 'Dra. Marina Alves', email: 'medico@quotasaude.app', password: '123456', role: 'doctor', clinicId: 'clinic-vida', doctorId: 'doctor-marina', createdAt: now() },
    { id: 'acc-patient', name: 'Lia Martins', email: 'paciente@quotasaude.app', password: '123456', role: 'patient', clinicId: 'clinic-vida', patientId: 'patient-lia', createdAt: now() },
  ],
};

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}

export function getVisibleClinicIds(account: Account, store: QuotaStore) {
  if (account.role === 'admin') return store.clinics.map((clinic) => clinic.id);
  return account.clinicId ? [account.clinicId] : [];
}

export function canSeePatient(account: Account, patient: Patient, store: QuotaStore) {
  if (account.role === 'patient') return account.patientId === patient.id;
  if (account.role === 'doctor') return store.appointments.some((a) => a.doctorId === account.doctorId && a.patientId === patient.id);
  return getVisibleClinicIds(account, store).includes(patient.clinicId);
}

export function roleLabel(role: UserRole) {
  return { admin: 'Admin', clinic: 'Clínica', doctor: 'Médico', patient: 'Paciente' }[role];
}
