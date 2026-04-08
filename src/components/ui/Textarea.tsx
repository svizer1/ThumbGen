import { TextareaHTMLAttributes, forwardRef } from 'react'; 
 import { cn } from '@/lib/utils'; 
 
 interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { 
   label?: string; 
   error?: string; 
   hint?: string; 
 } 
 
 export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>( 
   ({ className, label, error, hint, id, ...props }, ref) => { 
     const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-'); 
 
     return ( 
       <div className="flex flex-col gap-1.5"> 
         {label && ( 
           <label 
             htmlFor={textareaId} 
             className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider" 
           > 
             {label} 
           </label> 
         )} 
         <textarea 
           ref={ref} 
           id={textareaId} 
           className={cn( 
             'w-full rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]', 
             'bg-[var(--bg-base)] border border-[var(--border-default)]', 
             'focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-glow)]', 
             'transition-colors duration-150', 
             'resize-y min-h-[100px]', 
             'disabled:opacity-50 disabled:cursor-not-allowed', 
             error && 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20', 
             className 
           )} 
           {...props} 
         /> 
         {error && <p className="text-xs text-red-400">{error}</p>} 
         {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>} 
       </div> 
     ); 
   } 
 ); 
 Textarea.displayName = 'Textarea'; 
 