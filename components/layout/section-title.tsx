import { type ReactNode } from 'react';

export function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
