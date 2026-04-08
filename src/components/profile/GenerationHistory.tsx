'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Download, Copy, Trash2, Image as ImageIcon, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface Generation {
  id: string;
  createdAt: Date;
  mode: 'prompt' | 'api';
  generatedPrompt: string;
  negativePrompt?: string;
  generatedImageUrl?: string;
  status: 'success' | 'error';
  error?: string;
}

export function GenerationHistory() {
  const { user } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchGenerations = async () => {
      try {
        const generationsRef = collection(db, 'users', user.uid, 'generations');
        const q = query(generationsRef, orderBy('createdAt', 'desc'), limit(20));
        const snapshot = await getDocs(q);

        const data: Generation[] = snapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            id: doc.id,
            createdAt: docData.createdAt?.toDate() || new Date(),
            mode: docData.mode || 'prompt',
            generatedPrompt: docData.result?.generatedPrompt || '',
            negativePrompt: docData.result?.negativePrompt,
            generatedImageUrl: docData.result?.generatedImageUrl,
            status: docData.status || 'success',
            error: docData.error,
          };
        });

        setGenerations(data);
      } catch (error) {
        console.error('Error fetching generations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenerations();
  }, [user]);

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success('Промпт скопирован!');
  };

  const handleDownloadImage = async (url: string, id: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `generation-${id}.png`;
      a.click();
      URL.revokeObjectURL(blobUrl);
      toast.success('Изображение загружено!');
    } catch (error) {
      toast.error('Ошибка загрузки изображения');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="text-center py-12 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl">
        <ImageIcon className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
        <p className="text-[var(--text-secondary)] font-medium mb-1">Нет истории генераций</p>
        <p className="text-sm text-[var(--text-muted)]">Ваши генерации появятся здесь</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {generations.map((gen) => (
          <div
            key={gen.id}
            className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden hover:border-[var(--accent)] transition-all duration-300 card-hover"
          >
            {/* Image Preview */}
            {gen.generatedImageUrl && gen.status === 'success' ? (
              <div 
                className="relative aspect-video bg-[var(--bg-surface)] cursor-pointer group"
                onClick={() => setSelectedImage(gen.generatedImageUrl!)}
              >
                <img
                  src={gen.generatedImageUrl}
                  alt="Generated thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-[var(--text-primary)]" />
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-[var(--bg-surface)] flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
                  <p className="text-xs text-[var(--text-muted)]">
                    {gen.status === 'error' ? 'Ошибка генерации' : 'Только промпт'}
                  </p>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Date and Mode */}
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {gen.createdAt.toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  gen.mode === 'api' 
                    ? 'bg-purple-950/30 text-purple-300 border border-purple-700/30'
                    : 'bg-blue-950/30 text-blue-300 border border-blue-700/30'
                }`}>
                  {gen.mode === 'api' ? 'API' : 'Промпт'}
                </span>
              </div>

              {/* Prompt */}
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">Промпт:</p>
                <p className="text-sm text-[var(--text-primary)] line-clamp-3">
                  {gen.generatedPrompt}
                </p>
              </div>

              {/* Error */}
              {gen.error && (
                <div className="bg-red-950/30 border border-red-700/30 rounded-lg p-2">
                  <p className="text-xs text-red-300">{gen.error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => handleCopyPrompt(gen.generatedPrompt)}
                  className="flex-1 gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Копировать
                </Button>
                {gen.generatedImageUrl && gen.status === 'success' && (
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleDownloadImage(gen.generatedImageUrl!, gen.id)}
                    className="flex-1 gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Скачать
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-5xl w-full">
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-auto rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
