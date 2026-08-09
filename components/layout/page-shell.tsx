import { type ReactNode } from 'react';
import Link from 'next/link';
import { Home, MapPin, Truck, Users } from 'lucide-react';

const navItems = [
  { href: '/farmer', label: 'Home', icon: Home },
  { href: '/farmer/help', label: 'Help', icon: Users },
  { href: '/machinery', label: 'Machinery', icon: Truck },
  { href: '/coordinator/dashboard', label: 'Coordinator', icon: MapPin },
];

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
      <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white px-4 py-3 sm:hidden">
        <div className="grid grid-cols-4 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="inline-flex flex-col items-center justify-center rounded-2xl bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
