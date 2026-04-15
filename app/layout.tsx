import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Controle de carro por KM', description: 'Rateio de despesas do carro por quilometragem com Supabase.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
