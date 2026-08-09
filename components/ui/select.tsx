import { forwardRef, type SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={clsx(
        'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
        className,
      )}
      {...props}
    />
  ),
);

Select.displayName = 'Select';
