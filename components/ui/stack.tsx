import { type HTMLAttributes } from 'react';
import clsx from 'clsx';

export function Stack({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('space-y-4', className)} {...props} />;
}
