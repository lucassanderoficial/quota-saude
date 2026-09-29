import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QuotaSaude | Gestão inteligente para clínicas',
  description: 'SaaS moderno para administrar clínicas, médicos, pacientes, agendas e cotas de atendimento.',
  manifest: '/manifest.webmanifest',
  icons: [{ rel: 'icon', url: '/icon.svg' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a6256',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
