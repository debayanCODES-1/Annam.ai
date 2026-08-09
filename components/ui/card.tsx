import { type HTMLAttributes } from 'react';
import clsx from 'clsx';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className)} {...props} />;
}
