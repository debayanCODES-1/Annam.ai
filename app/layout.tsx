import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parali-to-Prosper',
  description: 'Turn crop residue into income, cleaner air and smarter farming.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface text-slate-900 antialiased">{children}</body>
    </html>
  );
}
