/**
 * ProBadge Component
 * Minimalist dark gold PRO badge
 */

interface ProBadgeProps {
  className?: string;
}

export function ProBadge({ className = '' }: ProBadgeProps) {
  return (
    <span 
      className={`relative inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-amber-900/40 to-yellow-900/40 border border-amber-600/50 text-amber-400 shadow-lg shadow-amber-900/20 ${className}`}
    >
      PRO
    </span>
  );
}
