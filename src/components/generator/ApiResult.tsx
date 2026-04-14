'use client';
import { useState } from 'react';
import { Download, RefreshCw, AlertCircle, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ImageModal } from '@/components/ui/ImageModal';
import { LoadingBuilderGame } from './LoadingBuilderGame';
import Image from 'next/image'; 
 
 interface ApiResultProps { 
   imageUrl?: string; 
   error?: string; 
   isLoading: boolean; 
   onRegenerate: () => void; 
 } 
 
export function ApiResult({ imageUrl, error, isLoading, onRegenerate }: ApiResultProps) {
  const [imgError, setImgError] = useState(false);
  const [showModal, setShowModal] = useState(false);
 
   if (isLoading) { 
    return <LoadingBuilderGame />; 
   } 
 
   if (error) { 
     return ( 
       <div className="rounded-xl border border-red-800/40 bg-red-950/20 p-6 flex flex-col items-center gap-4 text-center animate-fade-in"> 
         <div className="w-12 h-12 rounded-xl bg-red-900/30 flex items-center justify-center"> 
           <AlertCircle className="w-6 h-6 text-red-400" /> 
         </div> 
         <div> 
           <p className="text-sm font-medium text-red-300 mb-1">Generation failed</p> 
           <p className="text-xs text-red-400/70">{error}</p> 
         </div> 
         <Button variant="secondary" size="sm" onClick={onRegenerate}> 
           <RefreshCw className="w-3.5 h-3.5" /> 
           Try again 
         </Button> 
       </div> 
     ); 
   } 
 
   if (!imageUrl) return null;

  return (
    <>
      {showModal && <ImageModal imageUrl={imageUrl} onClose={() => setShowModal(false)} />}
      
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] overflow-hidden animate-slide-up">
        {/* Image */}
        <div 
          className="aspect-video relative group cursor-pointer"
          onClick={() => !imgError && setShowModal(true)}
        >
          {imgError ? (
            <div className="w-full h-full flex items-center justify-center bg-[var(--bg-card)] text-[var(--text-muted)] text-sm gap-2">
              <AlertCircle className="w-4 h-4" />
              Не удалось загрузить изображение
            </div>
          ) : (
            <>
              <Image
                src={imageUrl}
                alt="Сгенерированная миниатюра"
                fill
                className="object-cover"
                onError={() => setImgError(true)}
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center pointer-events-none">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-8 h-8 text-[var(--text-primary)]" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-[var(--border-subtle)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-[var(--text-muted)] font-medium">Успешно сгенерировано</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setShowModal(true)}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              Открыть
            </Button>
            <Button
              variant="secondary"
              size="xs"
              onClick={async () => {
                try {
                  const res = await fetch(imageUrl);
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `thumbnail-${Date.now()}.jpg`;
                  a.click();
                  URL.revokeObjectURL(url);
                } catch { 
                  window.open(imageUrl, '_blank');
                }
              }}
            >
              <Download className="w-3.5 h-3.5" />
              Скачать
            </Button>
            <Button variant="outline" size="xs" onClick={onRegenerate}>
              <RefreshCw className="w-3.5 h-3.5" />
              Повторить
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
