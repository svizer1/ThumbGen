'use client'; 
 import { useRef, useState, DragEvent, ChangeEvent } from 'react'; 
 import { Upload, X, ImageIcon, AlertCircle } from 'lucide-react'; 
 import { cn } from '@/lib/utils'; 
 import { Button } from '@/components/ui/Button'; 
 
 interface SourceUploadProps { 
   files: File[]; 
   onChange: (files: File[]) => void; 
 } 
 
 const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']; 
 const MAX_FILES = 10; 
 const MAX_SIZE_MB = 15; 
 
 export function SourceUpload({ files, onChange }: SourceUploadProps) { 
   const inputRef = useRef<HTMLInputElement>(null); 
   const [dragging, setDragging] = useState(false); 
   const [error, setError] = useState<string | null>(null); 
 
   function validate(incoming: File[]): { valid: File[]; error: string | null } { 
     const combined = [...files, ...incoming]; 
     if (combined.length > MAX_FILES) { 
       return { 
         valid: incoming.slice(0, MAX_FILES - files.length), 
         error: `Maximum ${MAX_FILES} images allowed.`, 
       }; 
     } 
     for (const f of incoming) { 
       if (!ACCEPTED.includes(f.type)) { 
         return { valid: [], error: `"${f.name}" is not a valid image type.` }; 
       } 
       if (f.size > MAX_SIZE_MB * 1024 * 1024) { 
         return { valid: [], error: `"${f.name}" exceeds ${MAX_SIZE_MB} MB.` }; 
       } 
     } 
     return { valid: incoming, error: null }; 
   } 
 
   function addFiles(incoming: File[]) { 
     const { valid, error } = validate(incoming); 
     setError(error); 
     if (valid.length > 0) { 
       onChange([...files, ...valid]); 
     } 
   } 
 
   function removeFile(index: number) { 
     onChange(files.filter((_, i) => i !== index)); 
     setError(null); 
   } 
 
   function onDragOver(e: DragEvent) { 
     e.preventDefault(); 
     setDragging(true); 
   } 
 
   function onDragLeave(e: DragEvent) { 
     e.preventDefault(); 
     setDragging(false); 
   } 
 
   function onDrop(e: DragEvent) { 
     e.preventDefault(); 
     setDragging(false); 
     const dropped = Array.from(e.dataTransfer.files); 
     addFiles(dropped); 
   } 
 
   function onFileChange(e: ChangeEvent<HTMLInputElement>) { 
     if (e.target.files) { 
       addFiles(Array.from(e.target.files)); 
       e.target.value = ''; 
     } 
   } 
 
   return ( 
     <div className="space-y-3"> 
       {/* Drop zone */} 
       <div 
         role="button" 
         tabIndex={0} 
         onDragOver={onDragOver} 
         onDragLeave={onDragLeave} 
         onDrop={onDrop} 
         onClick={() => inputRef.current?.click()} 
         onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()} 
         className={cn( 
           'relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed', 
           'cursor-pointer transition-all duration-200 text-center', 
           dragging 
             ? 'border-[var(--accent)] bg-[var(--accent-glow)]' 
             : 'border-[var(--border-default)] bg-[var(--bg-base)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-card)]', 
           files.length >= MAX_FILES && 'opacity-50 pointer-events-none' 
         )} 
       > 
         <div 
           className={cn( 
             'w-12 h-12 rounded-xl flex items-center justify-center transition-colors', 
             dragging ? 'bg-[var(--accent-glow)] text-[var(--accent)]' : 'bg-[var(--bg-surface)] text-[var(--text-muted)]' 
           )} 
         > 
           <Upload className="w-5 h-5" /> 
         </div> 
 
         <div> 
           <p className="text-sm font-medium text-[var(--text-secondary)]"> 
             Drop images here or{' '} 
             <span className="text-[var(--accent)] underline underline-offset-2">browse</span> 
           </p> 
           <p className="text-xs text-[var(--text-muted)] mt-1"> 
             JPEG, PNG, WebP, GIF, AVIF · Up to {MAX_SIZE_MB} MB · Max {MAX_FILES}  files 
           </p> 
         </div> 
 
         <input 
           ref={inputRef} 
           type="file" 
           accept={ACCEPTED.join(',')} 
           multiple 
           className="sr-only" 
           onChange={onFileChange} 
         /> 
       </div> 
 
       {/* Error */} 
       {error && ( 
         <div className="flex items-start gap-2 px-3 py-2.5 bg-red-950/40 border border-red-800/40 rounded-lg"> 
           <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> 
           <p className="text-xs text-red-300">{error}</p> 
         </div> 
       )} 
 
       {/* Previews */} 
       {files.length > 0 && ( 
         <div className="grid grid-cols-3 sm:grid-cols-4 gap-2"> 
           {files.map((file, i) => ( 
             <div 
               key={i} 
               className="relative group aspect-video rounded-lg overflow-hidden border border-[var(--border-default)] bg-[var(--bg-base)] img-checkerboard" 
             > 
               {/* eslint-disable-next-line @next/next/no-img-element */} 
               <img 
                 src={URL.createObjectURL(file)} 
                 alt={file.name} 
                 className="w-full h-full object-cover" 
               /> 
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"> 
                 <button 
                   type="button" 
                   onClick={(e) => { 
                     e.stopPropagation(); 
                     removeFile(i); 
                   }} 
                   className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors" 
                 > 
                   <X className="w-3.5 h-3.5 text-[var(--text-primary)]" /> 
                 </button> 
               </div> 
               <div className="absolute bottom-1 left-1 right-1"> 
                 <p className="text-[9px] text-[var(--text-primary)]/70 truncate bg-black/60 px-1.5 py-0.5 rounded"> 
                   {file.name} 
                 </p> 
               </div> 
             </div> 
           ))} 
 
           {/* Add more button */} 
           {files.length < MAX_FILES && ( 
             <button 
               type="button" 
               onClick={() => inputRef.current?.click()} 
               className="aspect-video rounded-lg border-2 border-dashed border-[var(--border-default)] bg-[var(--bg-base)] hover:border-[var(--accent)]/40 hover:bg-[var(--accent-glow)] flex flex-col items-center justify-center gap-1 transition-all" 
             > 
               <ImageIcon className="w-4 h-4 text-[var(--text-muted)]" /> 
               <span className="text-[10px] text-[var(--text-muted)]">Add more</span> 
             </button> 
           )} 
         </div> 
       )} 
 
       {/* Clear all */} 
       {files.length > 1 && ( 
         <div className="flex justify-end"> 
           <Button variant="ghost" size="xs" onClick={() => onChange([])}> 
             <X className="w-3 h-3" /> 
             Clear all 
           </Button> 
         </div> 
       )} 
     </div> 
   ); 
 }