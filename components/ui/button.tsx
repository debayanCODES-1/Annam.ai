import { type ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

const baseStyles = 'inline-flex items-center justify-center rounded-2xl border font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <button ref={ref} className={clsx(baseStyles, 'border-transparent bg-primary px-5 py-3 text-sm text-white hover:bg-primary/90', className)} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
