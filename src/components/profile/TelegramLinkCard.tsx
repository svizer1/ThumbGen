'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MessageCircle, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

export function TelegramLinkCard() {
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [linkUrl, setLinkUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  const isLinked = userData?.telegramId;

  const generateLinkToken = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/telegram/generate-link-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'Already linked') {
          toast.error('Telegram уже привязан к этому аккаунту');
          return;
        }
        throw new Error(data.error || 'Failed to generate link');
      }

      setLinkUrl(data.botUrl);
      setExpiresAt(new Date(Date.now() + data.expiresIn * 1000));
      toast.success('Ссылка для привязки создана!');
    } catch (error: any) {
      console.error('Error generating link:', error);
      toast.error('Ошибка создания ссылки: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!linkUrl) return;

    try {
      await navigator.clipboard.writeText(linkUrl);
      setCopied(true);
      toast.success('Ссылка скопирована!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Не удалось скопировать');
    }
  };

  const openTelegramBot = () => {
    if (linkUrl) {
      window.open(linkUrl, '_blank');
    }
  };

  if (isLinked) {
    return (
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-green-500/10">
            <MessageCircle className="w-6 h-6 text-green-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Telegram привязан</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Ваш Telegram аккаунт успешно привязан к профилю
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-[var(--text-secondary)]">
                ID: {userData.telegramId}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-[var(--accent)]/10">
          <MessageCircle className="w-6 h-6 text-[var(--accent)]" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">Привязать Telegram</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Привяжите Telegram для покупки кредитов и подписок через бота
          </p>

          {!linkUrl ? (
            <Button
              onClick={generateLinkToken}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Создание ссылки...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Создать ссылку для привязки
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
                <p className="text-xs text-[var(--text-secondary)] mb-2">
                  Ссылка для привязки (действительна 10 минут):
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-[var(--bg-primary)] px-3 py-2 rounded border border-[var(--border)] overflow-x-auto">
                    {linkUrl}
                  </code>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={openTelegramBot}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Открыть в Telegram
                </Button>
                <Button
                  onClick={generateLinkToken}
                  variant="outline"
                  disabled={loading}
                >
                  Создать новую ссылку
                </Button>
              </div>

              {expiresAt && (
                <p className="text-xs text-[var(--text-secondary)] text-center">
                  Ссылка истечёт в {expiresAt.toLocaleTimeString('ru-RU')}
                </p>
              )}

              <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-400">
                  <strong>Как привязать:</strong>
                </p>
                <ol className="text-sm text-[var(--text-secondary)] mt-2 space-y-1 list-decimal list-inside">
                  <li>Нажмите "Открыть в Telegram" или скопируйте ссылку</li>
                  <li>Откройте бот @ThumbGenAI_BOT</li>
                  <li>Нажмите "Start" или отправьте /start</li>
                  <li>Аккаунты будут автоматически привязаны</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
