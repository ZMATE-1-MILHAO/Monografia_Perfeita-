import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Roteiro e Comercial - Academia de Monografias',
  description: 'Gerador e Visualizador de Roteiro Comercial Interativo de 3 minutos para a Academia de Monografias e Pesquisas Científicas.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
