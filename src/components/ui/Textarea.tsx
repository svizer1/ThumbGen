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
             className="text-xs font-medium text-slate-400 uppercase tracking-wider" 
           > 
             {label} 
           </label> 
         )} 
         <textarea 
           ref={ref} 
           id={textareaId} 
           className={cn( 
             'w-full rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600', 
             'bg-[#0f0f1a] border border-[#252535]', 
             'focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30', 
             'transition-colors duration-150', 
             'resize-y min-h-[100px]', 
             'disabled:opacity-50 disabled:cursor-not-allowed', 
             error && 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20', 
             className 
           )} 
           {...props} 
         /> 
         {error && <p className="text-xs text-red-400">{error}</p>} 
         {hint && !error && <p className="text-xs text-slate-600">{hint}</p>} 
       </div> 
     ); 
   } 
 ); 
 Textarea.displayName = 'Textarea'; 
 