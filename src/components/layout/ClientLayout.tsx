'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LoginModal } from '@/components/auth/LoginModal';
import { SignupModal } from '@/components/auth/SignupModal';
import { ThumbBot } from '@/components/ai-assistant/ThumbBot';
import { ReactNode, useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import { onLoginModal, onSignupModal } from '@/lib/landing-events';

function LayoutInner({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const unsub1 = onLoginModal(() => setShowLogin(true));
    const unsub2 = onSignupModal(() => setShowSignup(true));
    return () => { unsub1(); unsub2(); };
  }, []);

  const isLanding = !loading && !user && pathname === '/';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: 'var(--accent)' }} />
      </div>
    );
  }

  if (isLanding) {
    return (
      <div className="landing-page">
        <LandingHeader
          onOpenLogin={() => setShowLogin(true)}
          onOpenSignup={() => setShowSignup(true)}
        />
        <main>{children}</main>
        <LandingFooter />
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }}
        />
        <SignupModal
          isOpen={showSignup}
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }}
        />
      </div>
    );
  }

  return (
    <>
      <Header
        onOpenLogin={() => setShowLogin(true)}
        onOpenSignup={() => setShowSignup(true)}
      />
      <main className="min-h-[calc(100vh-64px)]">{children}</main>
      <Footer />
      <ThumbBot />
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }}
      />
    </>
  );
}

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
            },
            success: {
              iconTheme: {
                primary: 'var(--accent)',
                secondary: 'white',
              },
            },
          }}
        />
        <LayoutInner>{children}</LayoutInner>
      </AuthProvider>
    </ThemeProvider>
  );
}
