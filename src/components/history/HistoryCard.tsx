'use client'; 
 import { useState } from 'react'; 
 import Image from 'next/image'; 
 import { Wand2, ImageIcon, Clock, Trash2, Copy, Check, ChevronDown, ChevronUp, Download, Maximize2 } from 'lucide-react'; 
 import type { HistoryEntry } from '@/types'; 
 import { formatDate, truncate } from '@/lib/utils'; 
 import { Button } from '@/components/ui/Button';
 import { ImageModal } from '@/components/ui/ImageModal'; 
 
 interface HistoryCardProps { 
   entry: HistoryEntry; 
   onDelete?: (id: string) => void; 
 } 
 
 export function HistoryCard({ entry, onDelete }: HistoryCardProps) { 
  const [copied, setCopied] = useState(false); 
  const [expanded, setExpanded] = useState(false); 
  const [deleting, setDeleting] = useState(false); 
  const [downloading, setDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isPromptMode = entry.mode === 'prompt';
  const isWildberriesMode = entry.mode === 'wildberries';
  const isPlayerokMode = entry.mode === 'playerok';
  const playerokCard = entry.playerokCard;
  const prompt = entry.result?.generatedPrompt ?? '';
  const imageUrl = entry.result?.generatedImageUrl ?? playerokCard?.imageUrl;

  async function copyPrompt() { 
    if (!prompt) return; 
    await navigator.clipboard.writeText(prompt).catch(() => null); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  } 

  async function deleteEntry() { 
    setDeleting(true); 
    try { 
      await fetch(`/api/history?id=${entry.id}`, { method: 'DELETE' }); 
      onDelete?.(entry.id); 
    } catch { 
      setDeleting(false); 
    } 
  }

  async function downloadImage() {
    if (!imageUrl) return;
    
    setDownloading(true);
    try {
      // Если это data URL, конвертируем в blob
      if (imageUrl.startsWith('data:')) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `thumbnail-${entry.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        // Если это обычный URL, скачиваем напрямую
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = `thumbnail-${entry.id}.png`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  }
 
   return (
     <>
       {showModal && imageUrl && <ImageModal imageUrl={imageUrl} onClose={() => setShowModal(false)} />}
       
       <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden card-hover flex flex-col"> 
         {/* Image or placeholder */} 
         <div 
           className={`aspect-video bg-[var(--bg-base)] relative overflow-hidden ${imageUrl ? 'cursor-pointer group' : ''}`}
           onClick={() => imageUrl && setShowModal(true)}
         > 
           {imageUrl ? (
             <>
               <Image 
                 src={imageUrl} 
                 alt="Generated thumbnail" 
                 fill 
                 className="object-cover" 
                 unoptimized 
               />
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                 <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                   <Maximize2 className="w-8 h-8 text-[var(--text-primary)]" />
                 </div>
               </div>
             </>
           ) : ( 
             <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#0f0f1a] to-[#1a1027]"> 
               <Wand2 className="w-8 h-8 text-[var(--accent)]/40" /> 
               <span className="text-xs text-[var(--text-muted)]">Prompt mode — no image</span> 
             </div> 
            )} 
 
            {/* Mode badge */} 
           <div className="absolute top-2.5 left-2.5"> 
             <span 
              className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full ${
                isPromptMode
                  ? 'bg-[var(--accent)] text-white'
                  : isWildberriesMode
                    ? 'bg-fuchsia-600/80 text-fuchsia-100'
                    : isPlayerokMode
                      ? 'bg-orange-600/80 text-orange-100'
                      : 'bg-emerald-700/80 text-emerald-100'
               } backdrop-blur-sm`} 
             > 
              {isPromptMode ? (
                <Wand2 className="w-3 h-3" />
              ) : isWildberriesMode ? (
                 <span className="font-bold tracking-wider">WB</span>
              ) : isPlayerokMode ? (
                <span className="font-bold tracking-wider">PO</span>
              ) : (
                <ImageIcon className="w-3 h-3" />
              )}
              {isPromptMode ? 'Prompt' : isWildberriesMode ? 'Wildberries' : isPlayerokMode ? 'Playerok' : 'API'}
             </span> 
           </div> 
 
            {/* Status badge */} 
            {entry.status === 'error' && ( 
              <div className="absolute top-2.5 right-2.5"> 
                <span className="inline-flex text-[10px] font-semibold px-2 py-1 rounded-full bg-red-700/80 text-red-100 backdrop-blur-sm"> 
                  Error 
                </span> 
              </div> 
            )} 
          </div>
 
          {/* Body */} 
          <div className="p-4 flex flex-col gap-3 flex-1"> 
            {/* Date */} 
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]"> 
              <Clock className="w-3 h-3" /> 
              {formatDate(entry.createdAt)} 
            </div> 
 
            {/* General description summary */} 
            {entry.input.generalDescription && (
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed"> 
                {truncate(entry.input.generalDescription, 120)} 
              </p> 
            )} 
            {isPlayerokMode && playerokCard?.title && (
              <div className="space-y-1">
                <h3 className="font-semibold text-[var(--text-primary)]">{playerokCard.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {truncate(playerokCard.description || '', 90)}
                </p>
              </div>
            )}
            {entry.mode === 'wildberries' && entry.input.product?.productName && (
              <div className="space-y-1">
                <h3 className="font-semibold text-[var(--text-primary)]">{entry.input.product.productName}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {truncate(entry.input.product.description || '', 80)}
                </p>
              </div>
            )}
 
            {/* Tags */} 
            <div className="flex flex-wrap gap-1.5"> 
              {entry.mode === 'wildberries' ? (
                <>
                  <Tag>{entry.input.product?.category}</Tag>
                  {entry.input.options?.includeInfographic && <Tag>Инфографика</Tag>}
                  {entry.input.options?.includeMultipleAngles && <Tag>Ракурсы</Tag>}
                </>
              ) : isPlayerokMode ? (
                <>
                  <Tag>{entry.input.category || playerokCard?.category}</Tag>
                  {entry.input.style && <Tag>{entry.input.style}</Tag>}
                  {playerokCard?.priceRub && <Tag>{playerokCard.priceRub} RUB</Tag>}
                </>
              ) : (
                <>
                  {entry.input.details?.emotion && <Tag>{entry.input.details.emotion}</Tag>}
                  {entry.input.details?.style && <Tag>{entry.input.details.style}</Tag>}
                  {entry.input.details?.composition && <Tag>{entry.input.details.composition}</Tag>}
                  {entry.input.sourceImageUrls && entry.input.sourceImageUrls.length > 0 && <Tag>{entry.input.sourceImageUrls.length} source img</Tag>}
                  {entry.input.referenceImageUrl && <Tag>Reference style</Tag>}
                </>
              )}
            </div> 
 
            {/* Prompt preview */} 
            {prompt && ( 
              <div className="mt-auto"> 
                <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] overflow-hidden"> 
                  <div className="flex items-center justify-between px-3 py-2"> 
                    <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider"> 
                      Prompt 
                    </span> 
                    <button 
                      type="button" 
                      onClick={() => setExpanded(!expanded)} 
                      className="text-[var(--text-muted)] hover:text-[var(--text-muted)] transition-colors" 
                    > 
                      {expanded ? ( 
                        <ChevronUp className="w-3.5 h-3.5" /> 
                      ) : ( 
                        <ChevronDown className="w-3.5 h-3.5" /> 
                      )} 
                    </button> 
                  </div> 
                  <div className="px-3 pb-3"> 
                    <p 
                      className={`text-xs text-[var(--text-muted)] font-mono leading-relaxed transition-all ${
                        expanded ? '' : 'line-clamp-2' 
                      }`} 
                    > 
                      {prompt} 
                    </p> 
                  </div> 
                </div> 
              </div> 
            )} 
 
            {/* Actions */} 
            <div className="flex items-center gap-2 pt-1 border-t border-[var(--border-subtle)] mt-1"> 
              {imageUrl && (
                <>
                  <Button variant="ghost" size="xs" onClick={() => setShowModal(true)} className="flex-1 justify-center">
                    <Maximize2 className="w-3.5 h-3.5" />
                    Просмотр
                  </Button>
                  <Button variant="ghost" size="xs" onClick={downloadImage} loading={downloading} className="flex-1 justify-center">
                    <Download className="w-3.5 h-3.5" />
                    Скачать
                  </Button>
                </>
              )}
              {prompt && ( 
                <Button variant="ghost" size="xs" onClick={copyPrompt} className="flex-1 justify-center"> 
                  {copied ? ( 
                    <> 
                      <Check className="w-3.5 h-3.5 text-green-400" /> 
                      <span className="text-green-400">Скопировано</span> 
                    </> 
                  ) : ( 
                    <> 
                      <Copy className="w-3.5 h-3.5" /> 
                      Копировать 
                    </> 
                  )} 
                </Button> 
              )} 
              <Button 
                variant="danger" 
                size="xs" 
                loading={deleting} 
                onClick={deleteEntry} 
                className="shrink-0" 
              > 
                <Trash2 className="w-3.5 h-3.5" /> 
              </Button> 
            </div>
          </div>
      </div>
      </>
   ); 
 } 
 
 function Tag({ children }: { children: React.ReactNode }) { 
   return ( 
     <span className="inline-flex text-[10px] font-medium text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-default)] px-1.5 py-0.5 rounded-full capitalize"> 
       {children} 
     </span> 
   ); 
 }
