'use client'; 
 import { useRef, useState, DragEvent, ChangeEvent } from 'react'; 
 import { Palette, X, AlertCircle, Loader2, Sparkles } from 'lucide-react'; 
 import { cn } from '@/lib/utils';
 import { analyzeImage } from '@/lib/image-analyzer'; 
 
 interface ReferenceUploadProps { 
   file: File | null; 
   onChange: (file: File | null) => void;
   onDescriptionGenerated?: (description: string) => void;
 } 
 
 const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']; 
 const MAX_SIZE_MB = 15; 
 
 export function ReferenceUpload({ file, onChange, onDescriptionGenerated }: ReferenceUploadProps) { 
   const inputRef = useRef<HTMLInputElement>(null); 
   const [dragging, setDragging] = useState(false); 
   const [error, setError] = useState<string | null>(null);
   const [analyzing, setAnalyzing] = useState(false);
   const [description, setDescription] = useState<string>(''); 
 
   function validate(f: File): string | null { 
     if (!ACCEPTED.includes(f.type)) return `"${f.name}" is not a valid image type.`; 
     if (f.size > MAX_SIZE_MB * 1024 * 1024) return `"${f.name}" exceeds ${MAX_SIZE_MB} MB.`; 
     return null; 
   } 
 
   async function setFile(f: File) { 
     const err = validate(f); 
     setError(err); 
     if (!err) {
       onChange(f);
       
       // Анализируем изображение
       setAnalyzing(true);
       try {
         // Читаем файл как base64
         const reader = new FileReader();
         reader.onloadend = async () => {
           const base64Data = reader.result as string;
           const desc = await analyzeImage(base64Data);
           if (desc) {
             setDescription(desc);
             if (onDescriptionGenerated) {
               onDescriptionGenerated(desc);
             }
           }
           setAnalyzing(false);
         };
         reader.onerror = () => {
           console.error('Failed to read file');
           setAnalyzing(false);
         };
         reader.readAsDataURL(f);
       } catch (error) {
         console.error('Failed to analyze image:', error);
         setAnalyzing(false);
       }
     }
   }

   // Сжимает изображение до максимум 512px и конвертирует в base64
   function compressImage(file: File): Promise<string> {
     return new Promise((resolve, reject) => {
       const reader = new FileReader();
       reader.onload = (e) => {
         const img = new Image();
         img.onload = () => {
           // Создаем canvas для сжатия
           const canvas = document.createElement('canvas');
           const ctx = canvas.getContext('2d');
           
           if (!ctx) {
             reject(new Error('Failed to get canvas context'));
             return;
           }
           
           // Вычисляем новые размеры (максимум 512px по большей стороне)
           const maxSize = 512;
           let width = img.width;
           let height = img.height;
           
           if (width > height) {
             if (width > maxSize) {
               height = (height * maxSize) / width;
               width = maxSize;
             }
           } else {
             if (height > maxSize) {
               width = (width * maxSize) / height;
               height = maxSize;
             }
           }
           
           canvas.width = width;
           canvas.height = height;
           
           // Рисуем сжатое изображение
           ctx.drawImage(img, 0, 0, width, height);
           
           // Конвертируем в base64 с качеством 0.8
           const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
           resolve(compressedBase64);
         };
         img.onerror = () => reject(new Error('Failed to load image'));
         img.src = e.target?.result as string;
       };
       reader.onerror = () => reject(new Error('Failed to read file'));
       reader.readAsDataURL(file);
     });
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
     const dropped = e.dataTransfer.files[0]; 
     if (dropped) setFile(dropped); 
   } 
 
   function onFileChange(e: ChangeEvent<HTMLInputElement>) { 
     const f = e.target.files?.[0]; 
     if (f) { 
       setFile(f); 
       e.target.value = ''; 
     } 
   } 
 
   if (file) { 
     return ( 
       <div className="space-y-2"> 
         <div className="relative group rounded-xl overflow-hidden border border-violet-500/30 bg-[#0f0f1a]"> 
           {/* eslint-disable-next-line @next/next/no-img-element */} 
           <img 
             src={URL.createObjectURL(file)} 
             alt="Reference thumbnail" 
             className="w-full h-40 object-cover" 
           /> 
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" /> 
           <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between"> 
             <div> 
               <div className="flex items-center gap-1.5 mb-0.5"> 
                 <Palette className="w-3 h-3 text-violet-400" /> 
                 <span className="text-xs font-medium text-violet-300">Style Reference</span> 
               </div> 
               <p className="text-[10px] text-white/60 truncate max-w-[160px]">{file.name}</p> 
             </div> 
             <button 
               type="button" 
               onClick={() => { 
                 onChange(null); 
                 setError(null);
                 setDescription('');
               }} 
               className="w-7 h-7 bg-red-600/80 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100" 
             > 
               <X className="w-3.5 h-3.5 text-white" /> 
             </button> 
           </div> 
         </div>
         
         {analyzing && (
           <div className="flex items-center gap-2 text-xs text-violet-400 bg-violet-950/30 border border-violet-700/30 rounded-lg px-3 py-2">
             <Loader2 className="w-3.5 h-3.5 animate-spin" />
             <span>AI анализирует изображение...</span>
           </div>
         )}
         
         {description && !analyzing && (
           <div className="bg-violet-950/30 border border-violet-700/30 rounded-lg px-3 py-2">
             <div className="flex items-start gap-2">
               <Sparkles className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
               <div className="flex-1 min-w-0">
                 <p className="text-[10px] font-medium text-violet-300 mb-1">
                   AI описание стиля:
                 </p>
                 <p className="text-xs text-slate-300">
                   {description}
                 </p>
               </div>
             </div>
           </div>
         )}
         
         <p className="text-xs text-slate-600"> 
           The AI will match the visual style and composition of this reference. 
         </p> 
       </div> 
     ); 
   } 
 
   return ( 
     <div className="space-y-2"> 
       <div 
         role="button" 
         tabIndex={0} 
         onDragOver={onDragOver} 
         onDragLeave={onDragLeave} 
         onDrop={onDrop} 
         onClick={() => inputRef.current?.click()} 
         onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()} 
         className={cn( 
           'flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 text-center', 
           dragging 
             ? 'border-violet-500 bg-violet-500/8' 
             : 'border-[#252535] bg-[#0f0f1a] hover:border-violet-500/30 hover:bg-violet-500/5' 
         )} 
       > 
         <div 
           className={cn( 
             'w-10 h-10 rounded-lg flex items-center justify-center transition-colors', 
             dragging ? 'bg-violet-600/20 text-violet-400' : 'bg-[#1a1a28] text-slate-500' 
           )} 
         > 
           <Palette className="w-5 h-5" /> 
         </div> 
         <div> 
           <p className="text-sm font-medium text-slate-300"> 
             Drop a reference thumbnail or{' '} 
             <span className="text-violet-400 underline underline-offset-2">browse</span> 
           </p> 
           <p className="text-xs text-slate-600 mt-1"> 
             The result will be generated in a similar style 
           </p> 
         </div> 
         <input 
           ref={inputRef} 
           type="file" 
           accept={ACCEPTED.join(',')} 
           className="sr-only" 
           onChange={onFileChange} 
         /> 
       </div> 
 
       {error && ( 
         <div className="flex items-start gap-2 px-3 py-2 bg-red-950/40 border border-red-800/40 rounded-lg"> 
           <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> 
           <p className="text-xs text-red-300">{error}</p> 
         </div> 
       )} 
     </div> 
   ); 
 }