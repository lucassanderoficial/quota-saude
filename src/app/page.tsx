'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  FilePlus,
  HeartPulse,
  LogOut,
  Pill,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Stethoscope,
  UserPlus,
  UsersRound,
} from 'lucide-react';
import type { Account, Appointment, AppointmentStatus, Patient, Prescription, QuotaStore, UserRole } from '@/domain/types';
import { canSeePatient, demoStore, roleLabel, SESSION_KEY, STORAGE_KEY, uid } from '@/lib/store';

const statusLabel: Record<AppointmentStatus, string> = {
  requested: 'Solicitado',
  scheduled: 'Agendado',
  checked_in: 'Check-in',
  completed: 'Finalizado',
  cancelled: 'Cancelado',
  no_show: 'Faltou',
};

const nav = [
  { id: 'overview', label: 'Visão geral', icon: Activity },
  { id: 'patients', label: 'Pacientes', icon: UsersRound },
  { id: 'prescriptions', label: 'Prescrições', icon: Pill },
  { id: 'appointments', label: 'Consultas', icon: CalendarCheck },
  { id: 'accounts', label: 'Acessos', icon: ShieldCheck },
] as const;

type View = (typeof nav)[number]['id'];
type LoginMode = 'login' | 'register';

type PatientForm = Omit<Patient, 'id' | 'createdAt'>;
type PrescriptionForm = Omit<Prescription, 'id' | 'issuedAt' | 'status'>;
type AppointmentForm = Omit<Appointment, 'id' | 'status'>;

const emptyPatient: PatientForm = {
  clinicId: 'clinic-vida',
  name: '',
  cpf: '',
  birthDate: '',
  sex: 'nao_informado',
  phone: '',
  email: '',
  address: '',
  allergies: '',
  notes: '',
};

function cloneStore(): QuotaStore {
  return JSON.parse(JSON.stringify(demoStore));
}

function loadStore(): QuotaStore {
  if (typeof window === 'undefined') return cloneStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneStore();
    const parsed = JSON.parse(raw) as QuotaStore;
    return { ...cloneStore(), ...parsed };
  } catch {
    return cloneStore();
  }
}

function saveStore(store: QuotaStore) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export default function QuotaSaudeApp() {
  const [store, setStore] = useState<QuotaStore>(() => cloneStore());
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [view, setView] = useState<View>('overview');
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const nextStore = loadStore();
    setStore(nextStore);
    setSessionId(window.localStorage.getItem(SESSION_KEY));
    setBooted(true);
  }, []);

  function updateStore(updater: (current: QuotaStore) => QuotaStore) {
    setStore((current) => {
      const next = updater(current);
      saveStore(next);
      return next;
    });
  }

  const account = useMemo(() => store.accounts.find((item) => item.id === sessionId) ?? null, [sessionId, store.accounts]);

  function login(email: string, password: string) {
    const match = store.accounts.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
    if (!match) return false;
    window.localStorage.setItem(SESSION_KEY, match.id);
    setSessionId(match.id);
    setView('overview');
    return true;
  }

  function logout() {
    window.localStorage.removeItem(SESSION_KEY);
    setSessionId(null);
    setView('overview');
  }

  function register(data: { name: string; email: string; password: string; role: UserRole }) {
    if (store.accounts.some((item) => item.email.toLowerCase() === data.email.toLowerCase())) return { ok: false, message: 'Este e-mail já existe.' };
    const clinicId = data.role === 'admin' ? undefined : 'clinic-vida';
    const patientId = data.role === 'patient' ? uid('patient') : undefined;
    const doctorId = data.role === 'doctor' ? uid('doctor') : undefined;
    const newAccount: Account = { id: uid('acc'), createdAt: new Date().toISOString(), clinicId, patientId, doctorId, ...data };
    updateStore((current) => ({
      ...current,
      accounts: [...current.accounts, newAccount],
      doctors: doctorId ? [...current.doctors, { id: doctorId, clinicId: clinicId!, name: data.name, specialty: 'Especialidade não informada', crm: 'CRM pendente', email: data.email, phone: '' }] : current.doctors,
      patients: patientId ? [...current.patients, { id: patientId, clinicId: clinicId!, name: data.name, cpf: '', birthDate: '', sex: 'nao_informado', phone: '', email: data.email, address: '', allergies: '', notes: '', createdAt: new Date().toISOString() }] : current.patients,
    }));
    window.localStorage.setItem(SESSION_KEY, newAccount.id);
    setSessionId(newAccount.id);
    return { ok: true, message: 'Conta criada.' };
  }

  if (!booted) return <LoadingScreen />;

  if (!account) return <AuthScreen onLogin={login} onRegister={register} />;

  return <Workspace account={account} store={store} view={view} setView={setView} updateStore={updateStore} logout={logout} />;
}

function LoadingScreen() {
  return <main className="auth-page"><div className="auth-card"><div className="brand big"><span className="brand-mark"><FilePlus /></span><span>QuotaSaude</span></div><div className="skeleton-line" /><div className="skeleton-line short" /></div></main>;
}

function AuthScreen({ onLogin, onRegister }: { onLogin: (email: string, password: string) => boolean; onRegister: (data: { name: string; email: string; password: string; role: UserRole }) => { ok: boolean; message: string } }) {
  const [mode, setMode] = useState<LoginMode>('login');
  const [role, setRole] = useState<UserRole>('clinic');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('clinica@quotasaude.app');
  const [password, setPassword] = useState('123456');
  const [message, setMessage] = useState('');

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    if (mode === 'login') {
      setMessage(onLogin(email, password) ? '' : 'E-mail ou senha inválidos. Use um demo abaixo ou crie uma conta.');
      return;
    }
    if (!name || !email || password.length < 6) {
      setMessage('Preencha nome, e-mail e senha com no mínimo 6 caracteres.');
      return;
    }
    const result = onRegister({ name, email, password, role });
    setMessage(result.message);
  }

  const demos = [
    ['Admin', 'admin@quotasaude.app'],
    ['Clínica', 'clinica@quotasaude.app'],
    ['Médico', 'medico@quotasaude.app'],
    ['Paciente', 'paciente@quotasaude.app'],
  ];

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="brand big"><span className="brand-mark"><FilePlus /></span><span>QuotaSaude</span></div>
        <p className="eyebrow">SaaS funcional para clínicas</p>
        <h1>Login, pacientes, consultas e prescrições em um só painel.</h1>
        <p>Admin, clínica, médico e paciente acessam portais diferentes. Esta versão já permite cadastrar dados e manter tudo salvo no navegador.</p>
        <div className="hero-proof"><span><CheckIcon /> Multi-login</span><span><CheckIcon /> CRUD real</span><span><CheckIcon /> Mobile/desktop</span></div>
      </section>
      <form className="auth-card" onSubmit={submit}>
        <div className="mode-tabs" role="tablist">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Entrar</button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Criar conta</button>
        </div>
        {mode === 'register' && <Field label="Nome completo"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Ana Souza" /></Field>}
        {mode === 'register' && <Field label="Perfil"><select value={role} onChange={(e) => setRole(e.target.value as UserRole)}><option value="clinic">Clínica</option><option value="doctor">Médico</option><option value="patient">Paciente</option><option value="admin">Admin</option></select></Field>}
        <Field label="E-mail"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@clinica.com" /></Field>
        <Field label="Senha"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="mínimo 6 caracteres" /></Field>
        {message && <div className="form-error">{message}</div>}
        <button className="primary full" type="submit">{mode === 'login' ? 'Entrar no QuotaSaude' : 'Criar e acessar'} <ChevronRight size={18} /></button>
        <div className="demo-box">
          <strong>Acessos demo</strong>
          {demos.map(([label, demoEmail]) => <button type="button" key={demoEmail} onClick={() => { setMode('login'); setEmail(demoEmail); setPassword('123456'); }}>{label}: {demoEmail}</button>)}
          <small>Senha de todos: 123456</small>
        </div>
      </form>
    </main>
  );
}

function Workspace({ account, store, view, setView, updateStore, logout }: { account: Account; store: QuotaStore; view: View; setView: (view: View) => void; updateStore: (updater: (current: QuotaStore) => QuotaStore) => void; logout: () => void }) {
  const visiblePatients = store.patients.filter((patient) => canSeePatient(account, patient, store));
  const visibleAppointments = store.appointments.filter((appt) => visiblePatients.some((p) => p.id === appt.patientId) || account.role === 'admin');
  const visiblePrescriptions = store.prescriptions.filter((rx) => visiblePatients.some((p) => p.id === rx.patientId) || account.role === 'admin');
  const currentClinic = store.clinics.find((clinic) => clinic.id === account.clinicId) ?? store.clinics[0];

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><FilePlus /></span><span>QuotaSaude</span></div>
        <nav className="side-nav">
          {nav.map((item) => {
            const Icon = item.icon;
            const disabled = item.id === 'accounts' && !['admin', 'clinic'].includes(account.role);
            return <button key={item.id} disabled={disabled} className={view === item.id ? 'active' : ''} onClick={() => setView(item.id)}><Icon size={18} />{item.label}</button>;
          })}
        </nav>
        <div className="user-card"><div className="avatar">{initials(account.name)}</div><strong>{account.name}</strong><span>{roleLabel(account.role)} · {currentClinic?.name ?? 'Global'}</span></div>
      </aside>
      <section className="main-panel">
        <header className="workspace-top">
          <div><p className="eyebrow">{roleLabel(account.role)}</p><h1>{titleFor(view)}</h1><span>Dados salvos neste navegador. Próxima etapa: banco real multi-tenant.</span></div>
          <button className="ghost" onClick={logout}><LogOut size={18} /> Sair</button>
        </header>
        {view === 'overview' && <Overview store={store} account={account} patients={visiblePatients} appointments={visibleAppointments} prescriptions={visiblePrescriptions} />}
        {view === 'patients' && <PatientsView account={account} store={store} patients={visiblePatients} updateStore={updateStore} />}
        {view === 'prescriptions' && <PrescriptionsView account={account} store={store} patients={visiblePatients} prescriptions={visiblePrescriptions} updateStore={updateStore} />}
        {view === 'appointments' && <AppointmentsView account={account} store={store} patients={visiblePatients} appointments={visibleAppointments} updateStore={updateStore} />}
        {view === 'accounts' && <AccountsView account={account} store={store} updateStore={updateStore} />}
      </section>
      <nav className="bottom-nav">
        {nav.slice(0, 4).map((item) => { const Icon = item.icon; return <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => setView(item.id)}><Icon size={18} /><span>{item.label}</span></button>; })}
      </nav>
    </main>
  );
}

function Overview({ store, account, patients, appointments, prescriptions }: { store: QuotaStore; account: Account; patients: Patient[]; appointments: Appointment[]; prescriptions: Prescription[] }) {
  const today = new Date().toISOString().slice(0, 10);
  return <div className="stack"><div className="metric-row"><Metric label="Pacientes" value={patients.length} icon={<UsersRound />} /><Metric label="Consultas futuras" value={appointments.filter((a) => a.date >= today).length} icon={<CalendarCheck />} /><Metric label="Prescrições ativas" value={prescriptions.filter((rx) => rx.status === 'active').length} icon={<Pill />} /><Metric label="Clínicas" value={account.role === 'admin' ? store.clinics.length : 1} icon={<HeartPulse />} /></div><div className="grid two"><Panel title="Próximas consultas">{appointments.length ? appointments.slice(0, 5).map((item) => <AppointmentItem key={item.id} item={item} store={store} />) : <Empty text="Nenhuma consulta visível para este perfil." />}</Panel><Panel title="Prescrições recentes">{prescriptions.length ? prescriptions.slice(0, 5).map((rx) => <PrescriptionItem key={rx.id} rx={rx} store={store} />) : <Empty text="Nenhuma prescrição cadastrada ainda." />}</Panel></div></div>;
}

function PatientsView({ account, store, patients, updateStore }: { account: Account; store: QuotaStore; patients: Patient[]; updateStore: (updater: (current: QuotaStore) => QuotaStore) => void }) {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Patient | null>(null);
  const [form, setForm] = useState<PatientForm>({ ...emptyPatient, clinicId: account.clinicId ?? store.clinics[0]?.id ?? 'clinic-vida' });
  const canEdit = ['admin', 'clinic', 'doctor'].includes(account.role);
  const list = patients.filter((p) => `${p.name} ${p.cpf} ${p.phone}`.toLowerCase().includes(query.toLowerCase()));

  function startEdit(patient: Patient) { setEditing(patient); setForm({ ...patient }); }
  function clear() { setEditing(null); setForm({ ...emptyPatient, clinicId: account.clinicId ?? store.clinics[0]?.id ?? 'clinic-vida' }); }
  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) return;
    updateStore((current) => ({ ...current, patients: editing ? current.patients.map((p) => p.id === editing.id ? { ...editing, ...form } : p) : [...current.patients, { id: uid('patient'), createdAt: new Date().toISOString(), ...form }] }));
    clear();
  }

  return <div className="grid two wide-left"><Panel title="Pacientes cadastrados" action={<div className="search"><Search size={16} /><input placeholder="Buscar paciente" value={query} onChange={(e) => setQuery(e.target.value)} /></div>}>{list.length ? list.map((patient) => <button className="record" key={patient.id} onClick={() => startEdit(patient)}><div className="avatar">{initials(patient.name)}</div><div><strong>{patient.name}</strong><span>{patient.phone || 'Sem telefone'} · {patient.cpf || 'CPF pendente'}</span></div><ChevronRight size={18} /></button>) : <Empty text="Nenhum paciente encontrado." />}</Panel><Panel title={canEdit ? (editing ? 'Editar paciente' : 'Cadastrar paciente') : 'Seu cadastro'}>{canEdit ? <PatientFormView form={form} setForm={setForm} save={save} clear={clear} editing={Boolean(editing)} store={store} /> : <ReadonlyPatient patient={patients[0]} />}</Panel></div>;
}

function PatientFormView({ form, setForm, save, clear, editing, store }: { form: PatientForm; setForm: (form: PatientForm) => void; save: (event: React.FormEvent) => void; clear: () => void; editing: boolean; store: QuotaStore }) {
  return <form className="form-grid" onSubmit={save}><Field label="Clínica"><select value={form.clinicId} onChange={(e) => setForm({ ...form, clinicId: e.target.value })}>{store.clinics.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field><Field label="Nome"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field><Field label="CPF"><input value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} /></Field><Field label="Nascimento"><input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} /></Field><Field label="Sexo"><select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value as Patient['sex'] })}><option value="nao_informado">Não informado</option><option value="feminino">Feminino</option><option value="masculino">Masculino</option><option value="outro">Outro</option></select></Field><Field label="Telefone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field><Field label="E-mail"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field><Field label="Endereço"><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field><Field label="Alergias"><textarea value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} /></Field><Field label="Observações"><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field><div className="form-actions"><button className="primary" type="submit"><Save size={17} />{editing ? 'Salvar paciente' : 'Cadastrar paciente'}</button><button type="button" className="ghost" onClick={clear}>Limpar</button></div></form>;
}

function PrescriptionsView({ account, store, patients, prescriptions, updateStore }: { account: Account; store: QuotaStore; patients: Patient[]; prescriptions: Prescription[]; updateStore: (updater: (current: QuotaStore) => QuotaStore) => void }) {
  const firstPatient = patients[0]?.id ?? '';
  const firstDoctor = account.doctorId ?? store.doctors[0]?.id ?? '';
  const [form, setForm] = useState<PrescriptionForm>({ clinicId: account.clinicId ?? 'clinic-vida', patientId: firstPatient, doctorId: firstDoctor, medication: '', dosage: '', instructions: '', duration: '' });
  const canEdit = ['admin', 'clinic', 'doctor'].includes(account.role);
  function save(event: React.FormEvent) { event.preventDefault(); if (!form.patientId || !form.medication) return; updateStore((current) => ({ ...current, prescriptions: [{ id: uid('rx'), issuedAt: new Date().toISOString().slice(0, 10), status: 'active', ...form }, ...current.prescriptions] })); setForm({ ...form, medication: '', dosage: '', instructions: '', duration: '' }); }
  return <div className="grid two wide-left"><Panel title="Prescrições">{prescriptions.length ? prescriptions.map((rx) => <PrescriptionItem key={rx.id} rx={rx} store={store} />) : <Empty text="Nenhuma prescrição ainda." />}</Panel><Panel title="Nova prescrição">{canEdit ? <form className="form-grid" onSubmit={save}><Field label="Paciente"><select required value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>{patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field><Field label="Médico"><select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>{store.doctors.map((d) => <option key={d.id} value={d.id}>{d.name} · {d.specialty}</option>)}</select></Field><Field label="Medicamento"><input required value={form.medication} onChange={(e) => setForm({ ...form, medication: e.target.value })} placeholder="Ex: Amoxicilina 500mg" /></Field><Field label="Dosagem"><input value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} placeholder="1 cápsula a cada 8h" /></Field><Field label="Duração"><input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="7 dias" /></Field><Field label="Instruções"><textarea value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} /></Field><button className="primary" type="submit"><FilePlus size={17} /> Emitir prescrição</button></form> : <Empty text="Paciente só visualiza suas prescrições." />}</Panel></div>;
}

function AppointmentsView({ account, store, patients, appointments, updateStore }: { account: Account; store: QuotaStore; patients: Patient[]; appointments: Appointment[]; updateStore: (updater: (current: QuotaStore) => QuotaStore) => void }) {
  const [form, setForm] = useState<AppointmentForm>({ clinicId: account.clinicId ?? 'clinic-vida', patientId: account.patientId ?? patients[0]?.id ?? '', doctorId: account.doctorId ?? store.doctors[0]?.id ?? '', date: new Date().toISOString().slice(0, 10), time: '09:00', reason: '' });
  function save(event: React.FormEvent) { event.preventDefault(); if (!form.patientId || !form.doctorId) return; updateStore((current) => ({ ...current, appointments: [{ id: uid('appt'), status: account.role === 'patient' ? 'requested' : 'scheduled', ...form }, ...current.appointments] })); setForm({ ...form, reason: '' }); }
  function updateStatus(id: string, status: AppointmentStatus) { updateStore((current) => ({ ...current, appointments: current.appointments.map((a) => a.id === id ? { ...a, status } : a) })); }
  return <div className="grid two wide-left"><Panel title="Agenda">{appointments.length ? appointments.map((item) => <AppointmentItem key={item.id} item={item} store={store} onStatus={['admin','clinic','doctor'].includes(account.role) ? updateStatus : undefined} />) : <Empty text="Nenhuma consulta cadastrada." />}</Panel><Panel title={account.role === 'patient' ? 'Solicitar consulta' : 'Agendar consulta'}><form className="form-grid" onSubmit={save}><Field label="Paciente"><select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>{patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field><Field label="Médico"><select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>{store.doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></Field><Field label="Data"><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field><Field label="Horário"><input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></Field><Field label="Motivo"><textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></Field><button className="primary" type="submit"><CalendarCheck size={17} /> Salvar consulta</button></form></Panel></div>;
}

function AccountsView({ account, store, updateStore }: { account: Account; store: QuotaStore; updateStore: (updater: (current: QuotaStore) => QuotaStore) => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '123456', role: 'clinic' as UserRole, clinicId: account.clinicId ?? store.clinics[0]?.id ?? 'clinic-vida' });
  const allowed = ['admin', 'clinic'].includes(account.role);
  function save(event: React.FormEvent) { event.preventDefault(); if (!allowed || !form.name || !form.email) return; updateStore((current) => ({ ...current, accounts: [...current.accounts, { id: uid('acc'), createdAt: new Date().toISOString(), ...form }] })); setForm({ ...form, name: '', email: '', password: '123456' }); }
  return <div className="grid two wide-left"><Panel title="Usuários">{store.accounts.map((user) => <div className="record static" key={user.id}><div className="avatar">{initials(user.name)}</div><div><strong>{user.name}</strong><span>{roleLabel(user.role)} · {user.email}</span></div></div>)}</Panel><Panel title="Criar acesso">{allowed ? <form className="form-grid" onSubmit={save}><Field label="Nome"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field><Field label="E-mail"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field><Field label="Senha"><input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field><Field label="Perfil"><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}><option value="clinic">Clínica</option><option value="doctor">Médico</option><option value="patient">Paciente</option><option value="admin">Admin</option></select></Field><button className="primary" type="submit"><UserPlus size={17} /> Criar acesso</button></form> : <Empty text="Seu perfil não pode criar usuários." />}</Panel></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="field"><span>{label}</span>{children}</label>; }
function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) { return <section className="panel"><div className="panel-head"><h2>{title}</h2>{action}</div>{children}</section>; }
function Metric({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) { return <div className="metric"><div>{icon}</div><strong>{value}</strong><span>{label}</span></div>; }
function Empty({ text }: { text: string }) { return <div className="empty"><ClipboardList size={20} /><span>{text}</span></div>; }
function ReadonlyPatient({ patient }: { patient?: Patient }) { if (!patient) return <Empty text="Nenhum cadastro vinculado." />; return <div className="readonly"><strong>{patient.name}</strong><span>{patient.email}</span><span>{patient.phone}</span><span>{patient.address}</span><p>{patient.notes}</p></div>; }
function titleFor(view: View) { return { overview: 'Painel operacional', patients: 'Pacientes', prescriptions: 'Prescrições', appointments: 'Consultas', accounts: 'Acessos e usuários' }[view]; }
function CheckIcon() { return <span className="check-dot">✓</span>; }
function AppointmentItem({ item, store, onStatus }: { item: Appointment; store: QuotaStore; onStatus?: (id: string, status: AppointmentStatus) => void }) { const patient = store.patients.find((p) => p.id === item.patientId); const doctor = store.doctors.find((d) => d.id === item.doctorId); return <div className="record static"><div className="date-chip"><strong>{item.time}</strong><span>{item.date.slice(5).replace('-', '/')}</span></div><div><strong>{patient?.name ?? 'Paciente removido'}</strong><span>{doctor?.name ?? 'Médico pendente'} · {item.reason || 'Sem motivo'}</span></div>{onStatus ? <select className="mini-select" value={item.status} onChange={(e) => onStatus(item.id, e.target.value as AppointmentStatus)}>{Object.entries(statusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select> : <span className="badge">{statusLabel[item.status]}</span>}</div>; }
function PrescriptionItem({ rx, store }: { rx: Prescription; store: QuotaStore }) { const patient = store.patients.find((p) => p.id === rx.patientId); const doctor = store.doctors.find((d) => d.id === rx.doctorId); return <div className="record static"><div className="icon-chip"><Pill size={18} /></div><div><strong>{rx.medication}</strong><span>{patient?.name} · {doctor?.name}</span><small>{rx.dosage} · {rx.duration} · {rx.instructions}</small></div><span className="badge">{rx.status}</span></div>; }
