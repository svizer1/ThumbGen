'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  credits: number;
  balanceMode: 'credits' | 'dollars';
  dollarBalance: number;
  subscription: {
    plan: 'free' | 'starter' | 'pro' | 'unlimited';
    status: 'active' | 'cancelled' | 'expired';
    currentPeriodEnd: Date | null;
  };
  totalGenerations: number;
  favoriteModel: string | null;
  modelUsage: { [modelName: string]: number };
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  useCredit: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string): Promise<UserData | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid,
          email: data.email,
          displayName: data.displayName,
          photoURL: data.photoURL,
          emailVerified: data.emailVerified,
          credits: data.credits || 0,
          balanceMode: data.balanceMode || 'credits',
          dollarBalance: data.dollarBalance || 0,
          subscription: {
            plan: data.subscription?.plan || 'free',
            status: data.subscription?.status || 'active',
            currentPeriodEnd: data.subscription?.currentPeriodEnd?.toDate() || null,
          },
          totalGenerations: data.totalGenerations || 0,
          favoriteModel: data.favoriteModel || null,
          modelUsage: data.modelUsage || {},
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Create user document in Firestore
  const createUserDocument = async (user: User) => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        credits: 10, // 10 бесплатных кредитов при регистрации
        balanceMode: 'credits', // По умолчанию режим кредитов
        dollarBalance: 0,
        subscription: {
          plan: 'free',
          status: 'active',
          currentPeriodEnd: null,
        },
        totalGenerations: 0,
        favoriteModel: null,
        modelUsage: {},
        createdAt: new Date(),
      });
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });
      
      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      // Create user document
      await createUserDocument(userCredential.user);
      
      toast.success('Регистрация успешна! Проверьте почту для подтверждения.');
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email уже используется');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Пароль слишком слабый (минимум 6 символов)');
      } else {
        toast.error('Ошибка регистрации: ' + error.message);
      }
      throw error;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Вход выполнен успешно!');
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Неверный email или пароль');
      } else {
        toast.error('Ошибка входа: ' + error.message);
      }
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createUserDocument(result.user);
      toast.success('Вход через Google выполнен успешно!');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast.error('Ошибка входа через Google: ' + error.message);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      toast.success('Выход выполнен');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Ошибка выхода: ' + error.message);
      throw error;
    }
  };

  // Refresh user data
  const refreshUserData = async () => {
    if (user) {
      const data = await fetchUserData(user.uid);
      setUserData(data);
    }
  };

  // Use a credit or dollar for generation
  const useCredit = async (): Promise<boolean> => {
    if (!user || !userData) {
      toast.error('Войдите в систему для генерации');
      return false;
    }

    // Check balance
    if (userData.credits <= 0) {
      toast.error('Недостаточно кредитов. Пополните баланс!');
      return false;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      
      await updateDoc(userRef, {
        credits: increment(-1),
        totalGenerations: increment(1),
      });
      
      // Update local state
      setUserData(prev => prev ? {
        ...prev,
        credits: prev.credits - 1,
        totalGenerations: prev.totalGenerations + 1,
      } : null);
      
      return true;
    } catch (error) {
      console.error('Error using credit:', error);
      toast.error('Ошибка списания средств');
      return false;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        await createUserDocument(user);
        const data = await fetchUserData(user.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userData,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    refreshUserData,
    useCredit,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
