export type UserRole = 'admin' | 'clinic' | 'doctor' | 'patient';

export type AppointmentStatus = 'requested' | 'scheduled' | 'checked_in' | 'completed' | 'cancelled' | 'no_show';

export type RoleConfig = {
  id: UserRole;
  label: string;
  title: string;
  description: string;
  primaryMetric: string;
  permissions: string[];
};

export type Appointment = {
  id: string;
  time: string;
  patient: string;
  doctor: string;
  clinic: string;
  status: AppointmentStatus;
  kind: string;
};

export type QuotaSnapshot = {
  label: string;
  used: number;
  total: number;
};
