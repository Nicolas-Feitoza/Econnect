import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Econnect - Plataforma de Créditos de Carbono',
  description: 'Marketplace sustentável para créditos de carbono com rastreabilidade e transparência',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="min-h-screen bg-slate-50">
          {children}
        </div>
      </body>
    </html>
  );
}
