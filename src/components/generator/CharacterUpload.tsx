'use client';
import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { User, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface CharacterUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_SIZE_MB = 15;

export function CharacterUpload({ file, onChange }: CharacterUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function validate(incoming: File): { valid: boolean; error: string | null } {
    if (!ACCEPTED.includes(incoming.type)) {
      return { valid: false, error: `"${incoming.name}" не является допустимым типом изображения.` };
    }
    if (incoming.size > MAX_SIZE_MB * 1024 * 1024) {
      return { valid: false, error: `"${incoming.name}" превышает ${MAX_SIZE_MB} МБ.` };
    }
    return { valid: true, error: null };
  }

  function addFile(incoming: File) {
    const { valid, error } = validate(incoming);
    setError(error);
    if (valid) {
      onChange(incoming);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(incoming);
    }
  }

  function removeFile() {
    onChange(null);
    setPreview(null);
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
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      addFile(dropped);
    }
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      addFile(e.target.files[0]);
      e.target.value = '';
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[var(--text-primary)]">
        Фото персонажа
        <span className="ml-1 text-xs text-[var(--text-muted)]">(опционально)</span>
      </label>

      {/* Drop zone */}
      {!file && (
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
              : 'border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-card)]'
          )}
        >
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
              dragging ? 'bg-[var(--accent-glow)] text-[var(--accent)]' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
            )}
          >
            <User className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Загрузите фото персонажа
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Перетащите изображение сюда или нажмите для выбора
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              JPEG, PNG, WebP, GIF, AVIF • До {MAX_SIZE_MB} МБ
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(',')}
            onChange={onFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Preview */}
      {file && preview && (
        <div className="relative rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-3">
          <div className="flex items-start gap-3">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[var(--bg-elevated)] flex-shrink-0">
              <Image
                src={preview}
                alt={file.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                {file.name}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {(file.size / 1024 / 1024).toFixed(2)} МБ
              </p>
            </div>
            <button
              onClick={removeFile}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
              title="Удалить"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <p className="text-xs text-[var(--text-muted)]">
        Загрузите фото персонажа, который будет использован в генерации миниатюры
      </p>
    </div>
  );
}
