import { SelectHTMLAttributes, forwardRef } from 'react'; 
 import { cn } from '@/lib/utils'; 
 
 interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { 
   label?: string; 
   error?: string; 
   hint?: string; 
   options: { value: string; label: string }[]; 
   placeholder?: string; 
 } 
 
 export const Select = forwardRef<HTMLSelectElement, SelectProps>( 
   ({ className, label, error, hint, options, placeholder, id, ...props }, ref) => { 
     const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-'); 
 
     return ( 
       <div className="flex flex-col gap-1.5"> 
         {label && ( 
           <label 
             htmlFor={selectId} 
             className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider" 
           > 
             {label} 
           </label> 
         )} 
         <select 
           ref={ref} 
           id={selectId} 
           className={cn( 
             'w-full rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)]',
            'bg-[var(--bg-base)] border border-[var(--border-default)]',
            'focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-glow)]', 
             'transition-colors duration-150', 
             'appearance-none cursor-pointer', 
             'disabled:opacity-50 disabled:cursor-not-allowed', 
             error && 'border-red-500/50', 
             className 
           )} 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, 
             backgroundRepeat: 'no-repeat', 
             backgroundPosition: 'right 12px center', 
             paddingRight: '36px', 
           }} 
           {...props} 
         > 
           {placeholder && ( 
             <option value="" className="bg-[var(--bg-base)] text-[var(--text-muted)]"> 
               {placeholder} 
             </option> 
           )} 
           {options.map((opt) => ( 
             <option key={opt.value} value={opt.value} className="bg-[var(--bg-base)]"> 
               {opt.label} 
             </option> 
           ))} 
         </select> 
         {error && <p className="text-xs text-red-400">{error}</p>} 
         {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>} 
       </div> 
     ); 
   } 
 ); 
 Select.displayName = 'Select'; 
 