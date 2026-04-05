'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Zap, History, Sun, Moon, Palette, DollarSign, LogIn } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileButton } from '@/components/profile/ProfileButton';
import { useState } from 'react';

interface HeaderProps {
  onOpenLogin?: () => void;
  onOpenSignup?: () => void;
}

export function Header({ onOpenLogin, onOpenSignup }: HeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, loading } = useAuth();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const themes = [
    { id: 'cream' as const, label: 'Молочная', icon: Sun },
    { id: 'brown-cream' as const, label: 'Коричневая', icon: Palette },
    { id: 'dark' as const, label: 'Темная', icon: Moon },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center shadow-lg group-hover:opacity-90 transition-opacity">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[var(--text-primary)] text-base tracking-tight">ThumbGen</span>
          <span className="hidden sm:inline-flex text-[10px] font-semibold text-[var(--accent)] bg-[var(--accent-glow)] border border-[var(--border-default)] px-1.5 py-0.5 rounded-full uppercase tracking-wider">
            AI
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-0.5">
          <NavLink href="/" active={pathname === '/'} icon={<Zap className="w-3.5 h-3.5" />}>
            Генератор
          </NavLink>
          <NavLink
            href="/history"
            active={pathname.startsWith('/history')}
            icon={<History className="w-3.5 h-3.5" />}
          >
            История
          </NavLink>
          <NavLink
            href="/pricing"
            active={pathname.startsWith('/pricing')}
            icon={<DollarSign className="w-3.5 h-3.5" />}
          >
            Тарифы
          </NavLink>
          
          {/* Theme Selector */}
          <div className="relative ml-2">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all duration-150"
              title="Выбрать тему"
            >
              <Palette className="w-4 h-4" />
            </button>

            {showThemeMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowThemeMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg shadow-lg overflow-hidden z-50">
                  {themes.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          theme === t.id
                            ? 'bg-[var(--accent-glow)] text-[var(--accent)] font-medium'
                            : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Auth Section */}
          {!loading && (
            <>
              {user ? (
                <ProfileButton />
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="ml-2 flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Войти</span>
                </button>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
 
function NavLink({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
        active
          ? 'bg-[var(--accent-glow)] text-[var(--accent)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{children}</span>
    </Link>
  );
}