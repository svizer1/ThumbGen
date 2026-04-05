'use client'; 
 import { useState } from 'react'; 
 import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'; 
 import { Button } from '@/components/ui/Button'; 
 
 interface PromptResultProps { 
   prompt: string; 
   negativePrompt: string; 
 } 
 
 export function PromptResult({ prompt, negativePrompt }: PromptResultProps) { 
   const [copied, setCopied] = useState(false); 
   const [copiedNeg, setCopiedNeg] = useState(false); 
   const [showNeg, setShowNeg] = useState(false); 
 
   async function copy(text: string, setter: (v: boolean) => void) { 
     try { 
       await navigator.clipboard.writeText(text); 
       setter(true); 
       setTimeout(() => setter(false), 2000); 
     } catch { 
       /* Fallback — silent fail */ 
     } 
   } 
 
   return ( 
     <div className="space-y-3 animate-slide-up"> 
       {/* Main prompt */} 
       <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 overflow-hidden"> 
         <div className="flex items-center justify-between px-4 py-3 border-b border-violet-500/20"> 
           <div className="flex items-center gap-2"> 
             <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" /> 
             <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider"> 
               Generated Prompt 
             </span> 
           </div> 
           <Button 
             variant="ghost" 
             size="xs" 
             onClick={() => copy(prompt, setCopied)} 
             className={copied ? 'text-green-400' : 'text-slate-400'} 
           > 
             {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} 
             {copied ? 'Copied!' : 'Copy'} 
           </Button> 
         </div> 
         <div className="p-4"> 
           <p className="text-sm text-slate-200 leading-relaxed font-mono whitespace-pre-wrap break-words"> 
             {prompt} 
           </p> 
         </div> 
       </div> 
 
        {/* Negative prompt toggle */} 
        <div className="rounded-xl border border-[#252535] bg-[#0f0f1a] overflow-hidden"> 
          <button 
            type="button" 
            onClick={() => setShowNeg(!showNeg)} 
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#141420] transition-colors" 
          > 
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider"> 
              Negative Prompt 
            </span> 
            <div className="flex items-center gap-2"> 
              {!showNeg && ( 
                <button 
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    copy(negativePrompt, setCopiedNeg); 
                  }} 
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
                    copiedNeg ? 'text-green-400' : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                > 
                  {copiedNeg ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} 
                </button> 
              )} 
              {showNeg ? ( 
                <ChevronUp className="w-4 h-4 text-slate-500" /> 
              ) : ( 
                <ChevronDown className="w-4 h-4 text-slate-500" /> 
              )} 
            </div> 
          </button>
 
         {showNeg && ( 
           <div className="px-4 pb-4 border-t border-[#1e1e2e] pt-3"> 
             <div className="flex justify-end mb-2"> 
               <Button 
                 variant="ghost" 
                 size="xs" 
                 onClick={() => copy(negativePrompt, setCopiedNeg)} 
                 className={copiedNeg ? 'text-green-400' : 'text-slate-400'} 
               > 
                 {copiedNeg ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} 
                 {copiedNeg ? 'Copied!' : 'Copy'} 
               </Button> 
             </div> 
             <p className="text-sm text-slate-500 leading-relaxed font-mono whitespace-pre-wrap break-words"> 
               {negativePrompt} 
             </p> 
           </div> 
         )} 
       </div> 
 
       <p className="text-xs text-slate-600 text-center"> 
         Paste this prompt into Midjourney, DALL-E, Stable Diffusion, or any image generator. 
       </p> 
     </div> 
   ); 
 }