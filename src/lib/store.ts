import type { Account, Clinic, Patient, QuotaStore, UserRole } from '@/domain/types';

export const STORAGE_KEY = 'quotasaude.store.v3';
export const SESSION_KEY = 'quotasaude.session.v3';

export const emptyStore: QuotaStore = {
  accounts: [],
  clinics: [],
  doctors: [],
  patients: [],
  appointments: [],
  prescriptions: [],
};

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}

export function roleLabel(role: UserRole) {
  return { admin: 'Admin', clinic: 'Clínica', doctor: 'Médico', patient: 'Paciente' }[role];
}

export function cloneEmptyStore(): QuotaStore {
  return JSON.parse(JSON.stringify(emptyStore));
}

export function visibleClinicIds(account: Account, store: QuotaStore) {
  if (account.role === 'admin') return store.clinics.map((clinic) => clinic.id);
  return account.clinicId ? [account.clinicId] : [];
}

export function canSeePatient(account: Account, patient: Patient, store: QuotaStore) {
  if (account.role === 'patient') return account.patientId === patient.id;
  if (account.role === 'doctor') return store.appointments.some((item) => item.doctorId === account.doctorId && item.patientId === patient.id);
  return visibleClinicIds(account, store).includes(patient.clinicId);
}

export function accountClinic(account: Account, store: QuotaStore): Clinic | undefined {
  return account.clinicId ? store.clinics.find((clinic) => clinic.id === account.clinicId) : undefined;
}
