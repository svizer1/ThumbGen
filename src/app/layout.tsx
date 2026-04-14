import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { ClientLayout } from '@/components/layout/ClientLayout';

export const metadata: Metadata = {
  title: 'ThumbGen AI — Генератор миниатюр для YouTube',
  description:
    'Создавайте профессиональные, привлекательные миниатюры для YouTube с помощью AI. Загружайте референсные изображения, описывайте свою идею и получайте впечатляющие миниатюры мгновенно.',
  icons: {
    icon: [{ url: '/favicon.ico?v=2', type: 'image/x-icon' }],
    shortcut: '/favicon.ico?v=2',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme="cream">
      <body className="min-h-screen antialiased">
        <Script src="https://js.puter.com/v2/" strategy="beforeInteractive" />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
