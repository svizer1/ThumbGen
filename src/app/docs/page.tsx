'use client';

import Link from 'next/link';
import { ArrowLeft, Book, Zap, Image as ImageIcon, Settings, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        На главную
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
          <Book className="w-8 h-8 text-[var(--accent)]" />
          Документация
        </h1>
        <p className="text-lg text-[var(--text-secondary)]">
          Руководство по использованию платформы ThumbGen AI для создания профессиональных миниатюр.
        </p>
      </div>

      <div className="space-y-12">
        {/* Начало работы */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Быстрый старт
          </h2>
          <Card className="p-6">
            <ol className="list-decimal list-inside space-y-4 text-[var(--text-secondary)]">
              <li><strong className="text-[var(--text-primary)]">Регистрация:</strong> Создайте аккаунт или войдите через Google/GitHub.</li>
              <li><strong className="text-[var(--text-primary)]">Генератор V1 или V2:</strong> Выберите версию генератора. V2 поддерживает пресеты популярных ютуберов (например, MrBeast, А4).</li>
              <li><strong className="text-[var(--text-primary)]">Описание (Промпт):</strong> Введите подробное описание желаемой миниатюры.</li>
              <li><strong className="text-[var(--text-primary)]">Генерация:</strong> Нажмите кнопку "Сгенерировать" и подождите несколько секунд.</li>
            </ol>
          </Card>
        </section>

        {/* Настройки */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-500" />
            Продвинутые настройки
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">AI Модели</h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Платформа поддерживает несколько моделей для разных стилей:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
                <li><strong className="text-[var(--text-primary)]">FLUX.1 Dev:</strong> Лучшая детализация и фотореализм.</li>
                <li><strong className="text-[var(--text-primary)]">Google Imagen 4:</strong> Отличное понимание сложных промптов.</li>
                <li><strong className="text-[var(--text-primary)]">SDXL:</strong> Классическая генерация в различных стилях.</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Формат и Разрешение</h3>
              <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
                <li><strong className="text-[var(--text-primary)]">16:9 (YouTube):</strong> Стандартный формат миниатюр.</li>
                <li><strong className="text-[var(--text-primary)]">9:16 (Shorts):</strong> Вертикальный формат.</li>
                <li><strong className="text-[var(--text-primary)]">Разрешение:</strong> До 4K для максимального качества.</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Тарифы */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-green-500" />
            Баланс и Подписки
          </h2>
          <Card className="p-6">
            <p className="text-[var(--text-secondary)] mb-4">
              Каждая генерация списывает кредиты с вашего баланса. Вы можете пополнить баланс или приобрести подписку для более выгодных условий.
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li><strong className="text-[var(--text-primary)]">Бесплатный тариф:</strong> Базовые возможности для тестирования.</li>
              <li><strong className="text-[var(--text-primary)]">Платные тарифы:</strong> Доступ к премиум-моделям, Telegram-боту и приоритетной генерации.</li>
              <li><strong className="text-[var(--text-primary)]">Telegram Бот:</strong> Позволяет генерировать миниатюры прямо в мессенджере. <Link href="/profile" className="text-[var(--accent)] hover:underline">Привязать аккаунт</Link></li>
            </ul>
          </Card>
        </section>

        {/* Telegram Бот */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-purple-500" />
            Интеграция с Telegram
          </h2>
          <Card className="p-6">
            <p className="text-[var(--text-secondary)] mb-4">
              Для удобства вы можете использовать нашего Telegram бота. Он синхронизируется с вашим аккаунтом на сайте.
            </p>
            <div className="bg-[var(--bg-surface)] p-4 rounded-lg border border-[var(--border-default)]">
              <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)] text-sm">
                <li>Перейдите в настройки профиля на сайте.</li>
                <li>Нажмите "Привязать Telegram".</li>
                <li>Отправьте полученный код боту.</li>
                <li>Теперь ваш баланс и подписки синхронизированы!</li>
              </ol>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}