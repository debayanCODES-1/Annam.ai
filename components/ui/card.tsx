import { type HTMLAttributes } from 'react';
import clsx from 'clsx';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-[2.5rem] border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur-xl transition-transform duration-300',
        className,
      )}
      {...props}
    />
  );
}
