'use client';

import { useState, useRef, useEffect } from 'react';
import { User, Coins, LogOut, Settings, CreditCard, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export function ProfileButton() {
  const { user, userData, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user || !userData) return null;

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--bg-surface)] transition-colors"
      >
        {/* Credits Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[var(--accent-glow)] border border-[var(--accent)] rounded-full">
          <Coins className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="text-xs font-semibold text-[var(--accent)]">
            {userData.credits}
          </span>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-sm font-semibold">
          {userData.photoURL ? (
            <img
              src={userData.photoURL}
              alt={userData.displayName || 'User'}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(userData.displayName)
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-2xl overflow-hidden z-50">
          {/* User Info */}
          <div className="p-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-lg font-semibold">
                {userData.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt={userData.displayName || 'User'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(userData.displayName)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                  {userData.displayName || 'Пользователь'}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {userData.email}
                </p>
              </div>
            </div>

            {/* Credits & Plan */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[var(--bg-surface)] rounded-lg p-2">
                <p className="text-xs text-[var(--text-muted)]">Кредиты</p>
                <p className="text-lg font-bold text-[var(--accent)]">{userData.credits}</p>
              </div>
              <div className="bg-[var(--bg-surface)] rounded-lg p-2">
                <p className="text-xs text-[var(--text-muted)]">План</p>
                <p className="text-sm font-semibold text-[var(--text-primary)] capitalize">
                  {userData.subscription.plan}
                </p>
              </div>
            </div>

            {/* Email Verification Warning */}
            {!userData.emailVerified && (
              <div className="mt-3 bg-amber-950/30 border border-amber-700/30 rounded-lg p-2">
                <p className="text-xs text-amber-300">
                  ⚠️ Подтвердите email для полного доступа
                </p>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
            >
              <User className="w-4 h-4" />
              Профиль
            </Link>

            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Пополнить баланс
            </Link>

            <Link
              href="/profile#settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
            >
              <Settings className="w-4 h-4" />
              Настройки
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-[var(--border-subtle)] py-2">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-[var(--bg-surface)] transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
