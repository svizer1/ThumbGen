'use client';

import { useState, useEffect } from 'react';
import { X, Search, Loader2, ExternalLink } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    username: string;
    link: string;
  };
  link: string;
  download_location: string;
  width: number;
  height: number;
}

interface UnsplashModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string, imageData: UnsplashImage) => void;
}

export function UnsplashModal({ isOpen, onClose, onSelectImage }: UnsplashModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setError(null);
      setHasSearched(false);
    }
  }, [isOpen]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!query.trim()) {
      setError('Введите поисковый запрос');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/unsplash/search?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`);
      
      if (!response.ok) {
        throw new Error('Ошибка поиска');
      }

      const data = await response.json();
      setResults(data.results || []);
      
      if (data.results.length === 0) {
        setError('Ничего не найдено. Попробуйте другой запрос.');
      }
    } catch (err) {
      console.error('Unsplash search error:', err);
      setError('Не удалось выполнить поиск. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = (image: UnsplashImage) => {
    onSelectImage(image.urls.regular, image);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-default)]">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Поиск на Unsplash</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Найдите идеальное референсное изображение</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Search Form */}
        <div className="p-6 border-b border-[var(--border-default)]">
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Например: gaming thumbnail, youtube banner..."
              className="flex-1"
              autoFocus
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Искать
            </Button>
          </form>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="text-center py-12">
              <p className="text-[var(--text-secondary)]">{error}</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--accent)]" />
              <p className="text-[var(--text-secondary)] mt-4">Поиск изображений...</p>
            </div>
          )}

          {!loading && !error && results.length === 0 && !hasSearched && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-4" />
              <p className="text-[var(--text-secondary)]">Введите запрос для поиска изображений</p>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-video rounded-lg overflow-hidden cursor-pointer border border-[var(--border-default)] hover:border-[var(--accent)] transition-all hover:scale-105"
                  onClick={() => handleSelectImage(image)}
                >
                  <img
                    src={image.urls.small}
                    alt={image.alt_description || image.description || 'Unsplash image'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-[var(--text-primary)] text-xs font-medium truncate">
                        by {image.user.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-default)] bg-[var(--bg-secondary)]">
          <p className="text-xs text-[var(--text-muted)] text-center">
            Изображения предоставлены{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline inline-flex items-center gap-1"
            >
              Unsplash
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
