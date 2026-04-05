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
             className="text-xs font-medium text-slate-400 uppercase tracking-wider" 
           > 
             {label} 
           </label> 
         )} 
         <select 
           ref={ref} 
           id={selectId} 
           className={cn( 
             'w-full rounded-lg px-3 py-2.5 text-sm text-slate-100', 
             'bg-[#0f0f1a] border border-[#252535]', 
             'focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30', 
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
             <option value="" className="bg-[#0f0f1a] text-slate-500"> 
               {placeholder} 
             </option> 
           )} 
           {options.map((opt) => ( 
             <option key={opt.value} value={opt.value} className="bg-[#0f0f1a]"> 
               {opt.label} 
             </option> 
           ))} 
         </select> 
         {error && <p className="text-xs text-red-400">{error}</p>} 
         {hint && !error && <p className="text-xs text-slate-600">{hint}</p>} 
       </div> 
     ); 
   } 
 ); 
 Select.displayName = 'Select'; 
 