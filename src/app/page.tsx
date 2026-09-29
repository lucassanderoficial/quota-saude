'use client';

import { useMemo, useState } from 'react';
import { Activity, ArrowRight, CalendarCheck, CheckCircle2, ClipboardList, FilePlus, LockKeyhole, Plus, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { appointments, getRole, navigation, quotas, roleConfigs, roleIcons } from '@/lib/demo-data';
import type { AppointmentStatus, UserRole } from '@/domain/types';

const statusLabels: Record<AppointmentStatus, string> = {
  requested: 'Solicitado',
  scheduled: 'Agendado',
  checked_in: 'Check-in',
  completed: 'Finalizado',
  cancelled: 'Cancelado',
  no_show: 'Faltou',
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function RoleIcon({ role }: { role: UserRole }) {
  const Icon = roleIcons[role];
  return <Icon size={22} aria-hidden="true" />;
}

function Header() {
  return (
    <header className="topbar shell" aria-label="Topo do site">
      <a className="brand" href="#top" aria-label="QuotaSaude início">
        <span className="brand-mark"><FilePlus size={22} /></span>
        <span>QuotaSaude</span>
      </a>
      <nav className="nav" aria-label="Navegação principal">
        <a href="#roles">Portais</a>
        <a href="#app">Dashboard</a>
        <a href="#quotas">Cotas</a>
        <a href="#login">Login demo</a>
      </nav>
      <div className="top-actions">
        <a className="btn btn-soft" href="#app">Ver produto</a>
        <a className="btn btn-primary" href="#login">Entrar</a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero shell" id="top">
      <div className="hero-copy">
        <span className="kicker"><Sparkles size={16} /> SaaS multilogin para clínicas</span>
        <h1>Gestão de clínicas com cada pessoa no portal certo.</h1>
        <p>
          Admin, clínica, médico e paciente em uma experiência limpa, rápida e responsiva. Agenda, cotas e operação conectadas sem confundir papéis.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#login">Acessar demo <ArrowRight size={18} /></a>
          <a className="btn btn-soft" href="#roles">Ver perfis</a>
        </div>
      </div>
      <div className="hero-panel" aria-label="Prévia do dashboard QuotaSaude">
        <div className="device">
          <div className="mini-head">
            <div className="brand"><span className="brand-mark"><FilePlus size={20} /></span><span>Hoje</span></div>
            <span className="pill">Operação saudável</span>
          </div>
          <div className="metric-grid">
            <div className="metric-card"><strong>91%</strong><span>agenda ocupada</span></div>
            <div className="metric-card"><strong>24</strong><span>check-ins pendentes</span></div>
          </div>
          <div className="agenda">
            {appointments.slice(0, 3).map((item) => (
              <div className="agenda-row" key={item.id}>
                <span className="time">{item.time}</span>
                <div><div className="patient">{item.patient}</div><div className="meta">{item.doctor}</div></div>
                <span className="status">{statusLabels[item.status]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Roles() {
  return (
    <section className="section shell" id="roles">
      <div className="section-head">
        <div><h2>Quatro portais, uma operação.</h2></div>
        <p>Cada papel enxerga só o que precisa para trabalhar bem, com permissões claras e navegação própria.</p>
      </div>
      <div className="role-grid">
        {roleConfigs.map((role) => (
          <article className="role-card" key={role.id}>
            <div>
              <div className="role-icon"><RoleIcon role={role.id} /></div>
              <h3>{role.label}</h3>
              <p>{role.description}</p>
            </div>
            <ul>
              {role.permissions.map((permission) => <li key={permission}>{permission}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function LoginDemo({ role, setRole }: { role: UserRole; setRole: (role: UserRole) => void }) {
  return (
    <section className="section shell" id="login">
      <div className="section-head">
        <div><h2>Login demo por perfil.</h2></div>
        <p>Escolha um papel para visualizar a experiência. A próxima etapa troca essa camada por autenticação real com banco.</p>
      </div>
      <form className="panel form-demo" onSubmit={(event) => event.preventDefault()}>
        <div className="role-tabs" role="tablist" aria-label="Selecionar perfil de acesso">
          {roleConfigs.map((item) => (
            <button key={item.id} className={cx('btn', role === item.id ? 'btn-primary' : 'btn-soft')} onClick={() => setRole(item.id)} type="button">
              <RoleIcon role={item.id} /> {item.label}
            </button>
          ))}
        </div>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" value={`${role}@quotasaude.com.br`} readOnly aria-describedby="email-help" />
          <small id="email-help">Credencial demo somente para navegação visual e validação de fluxos.</small>
        </div>
        <div className="field">
          <label htmlFor="password">Senha</label>
          <input id="password" type="password" value="quotasaude-demo" readOnly />
        </div>
        <button className="btn btn-primary" type="button"><LockKeyhole size={18} /> Entrar como {getRole(role).label}</button>
        <div className="empty-state">Estado vazio coberto: quando uma clínica não tiver agendamentos, o sistema mostra próximos passos e CTA para criar agenda.</div>
        <div className="error-state">Estado de erro coberto: login inválido deve explicar o problema e permitir recuperação de senha.</div>
        <div className="loading-state">Estado de loading coberto: carregando dados da organização e permissões do usuário.</div>
      </form>
    </section>
  );
}

function AppPreview({ role, setRole }: { role: UserRole; setRole: (role: UserRole) => void }) {
  const selected = useMemo(() => getRole(role), [role]);
  return (
    <section className="section shell" id="app">
      <div className="section-head">
        <div><h2>Dashboard responsivo.</h2></div>
        <p>Desktop usa sidebar e visão operacional. Mobile prioriza a próxima ação com navegação inferior e blocos empilhados.</p>
      </div>
      <div className="app-frame">
        <div className="app">
          <aside className="sidebar" aria-label="Menu do produto">
            <div className="brand"><span className="brand-mark"><FilePlus size={20} /></span><span>QuotaSaude</span></div>
            <nav className="menu">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                return <a href={item.href} key={item.label} className={index === 0 ? 'active' : ''}><Icon size={18} />{item.label}</a>;
              })}
            </nav>
            <div className="sidebar-footer">
              <strong>{selected.label}</strong>
              <p className="meta">Sessão demo com permissões isoladas por papel.</p>
            </div>
          </aside>
          <main className="main">
            <div className="app-top">
              <div className="app-title">
                <h2>{selected.title}</h2>
                <p>{selected.description}</p>
              </div>
              <div className="role-tabs" aria-label="Trocar visualização">
                {roleConfigs.map((item) => <a href="#app" key={item.id} onClick={() => setRole(item.id)} className={role === item.id ? 'active' : ''}>{item.label}</a>)}
              </div>
            </div>
            <div className="dashboard-grid">
              <div>
                <div className="stat-row">
                  <div className="stat"><strong>{selected.primaryMetric.split(' ')[0]}</strong><span>{selected.primaryMetric.replace(selected.primaryMetric.split(' ')[0], '').trim() || selected.label}</span></div>
                  <div className="stat"><strong>4.8</strong><span>satisfação média</span></div>
                  <div className="stat"><strong>18</strong><span>tarefas abertas</span></div>
                </div>
                <section className="panel" id="agenda">
                  <h3>Agenda e atendimentos</h3>
                  <div className="list">
                    {appointments.map((item) => (
                      <article className="item" key={item.id}>
                        <div className="avatar">{item.patient.slice(0, 1)}</div>
                        <div><strong>{item.time} · {item.patient}</strong><span>{item.kind} com {item.doctor} · {item.clinic}</span></div>
                        <span className={cx('tag', item.status === 'requested' && 'warn')}>{statusLabels[item.status]}</span>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
              <aside className="panel" id="quotas">
                <h3>Cotas e capacidade</h3>
                <div className="quota">
                  {quotas.map((quota) => {
                    const percent = Math.round((quota.used / quota.total) * 100);
                    return (
                      <div key={quota.label}>
                        <div className="mini-head"><strong>{quota.label}</strong><span className="meta">{quota.used}/{quota.total}</span></div>
                        <div className="bar" aria-label={`${quota.label}: ${percent}% usado`}><i style={{ width: `${percent}%` }} /></div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ height: 14 }} />
                <button className="btn btn-primary" type="button"><Plus size={18} /> Nova cota</button>
                <div style={{ height: 14 }} />
                <div className="empty-state"><CheckCircle2 size={18} /> Sem pendências críticas neste perfil.</div>
              </aside>
            </div>
            <nav className="bottom-nav" aria-label="Navegação mobile">
              <a className="active" href="#app"><Activity size={19} />Início</a>
              <a href="#agenda"><CalendarCheck size={19} />Agenda</a>
              <a href="#quotas"><ClipboardList size={19} />Cotas</a>
              <a href="#login"><UserRound size={19} />Login</a>
            </nav>
          </main>
        </div>
      </div>
    </section>
  );
}

function SecurityStrip() {
  return (
    <section className="section shell">
      <div className="panel" style={{ display: 'grid', gap: 14 }}>
        <span className="kicker"><ShieldCheck size={16} /> Arquitetura preparada para multi-tenant</span>
        <div className="section-head" style={{ margin: 0 }}>
          <h2>Separação entre UI, regras, dados e integrações.</h2>
          <p>O MVP já está organizado para evoluir para autenticação real, banco PostgreSQL, permissões por papel, logs de auditoria e integrações de agenda/WhatsApp.</p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [role, setRole] = useState<UserRole>('clinic');
  return (
    <div className="page">
      <Header />
      <Hero />
      <Roles />
      <LoginDemo role={role} setRole={setRole} />
      <AppPreview role={role} setRole={setRole} />
      <SecurityStrip />
      <footer className="footer shell">QuotaSaude · MVP SaaS para clínicas · Admin, clínica, médico e paciente.</footer>
    </div>
  );
}
