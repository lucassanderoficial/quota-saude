export type UserRole = 'admin' | 'clinic' | 'doctor' | 'patient';

export type AppointmentStatus = 'requested' | 'scheduled' | 'checked_in' | 'completed' | 'cancelled' | 'no_show';
export type PrescriptionStatus = 'draft' | 'active' | 'completed' | 'cancelled';
export type Sex = 'feminino' | 'masculino' | 'outro' | 'nao_informado';

export type Account = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  clinicId?: string;
  doctorId?: string;
  patientId?: string;
  createdAt: string;
};

export type Clinic = {
  id: string;
  name: string;
  city: string;
  plan: 'Starter' | 'Growth' | 'Enterprise';
};

export type Doctor = {
  id: string;
  clinicId: string;
  name: string;
  specialty: string;
  crm: string;
  email: string;
  phone: string;
};

export type Patient = {
  id: string;
  clinicId: string;
  name: string;
  cpf: string;
  birthDate: string;
  sex: Sex;
  phone: string;
  email: string;
  address: string;
  allergies: string;
  notes: string;
  createdAt: string;
};

export type Appointment = {
  id: string;
  clinicId: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
};

export type Prescription = {
  id: string;
  clinicId: string;
  patientId: string;
  doctorId: string;
  medication: string;
  dosage: string;
  instructions: string;
  duration: string;
  status: PrescriptionStatus;
  issuedAt: string;
};

export type QuotaStore = {
  accounts: Account[];
  clinics: Clinic[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  prescriptions: Prescription[];
};

export type Session = {
  accountId: string;
};
