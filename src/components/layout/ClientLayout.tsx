'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoginModal } from '@/components/auth/LoginModal';
import { SignupModal } from '@/components/auth/SignupModal';
import { ReactNode, useState } from 'react';
import { Toaster } from 'react-hot-toast';

export function ClientLayout({ children }: { children: ReactNode }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

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
        <Header 
          onOpenLogin={() => setShowLogin(true)}
          onOpenSignup={() => setShowSignup(true)}
        />
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
        <Footer />
        
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
        
        <SignupModal
          isOpen={showSignup}
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
