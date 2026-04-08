import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  animated?: boolean;
  hover?: boolean;
}

export function Card({ className, padded = true, animated = false, hover = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl',
        'transition-all duration-300 ease-smooth',
        padded && 'p-5',
        hover && 'hover:shadow-2xl hover:border-[var(--border-strong)] hover:-translate-y-2 hover:scale-[1.03]',
        className
      )}
      style={{ willChange: hover ? 'transform' : 'auto' }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider', className)}
      {...props}
    >
      {children}
    </h3>
  );
}