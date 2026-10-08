import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, CustomerAddress } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, name?: string, role?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateAddress: (address: CustomerAddress) => void;
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup' | 'forgot';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'divines_eternity_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');

  const openAuthModal = (mode: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Sync Supabase Auth session & onAuthStateChange listener
  useEffect(() => {
    const client = supabase;
    if (isSupabaseConfigured() && client) {
      // 1. Initial Session Check
      client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          syncUserProfile(session.user);
        } else {
          setIsLoading(false);
        }
      });

      // 2. Real-time Auth State Listener
      const { data: authListener } = client.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            await syncUserProfile(session.user);
          } else {
            setUser(null);
            setIsLoading(false);
          }
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const syncUserProfile = async (authUser: any) => {
    try {
      let role = 'customer';
      let fullName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Patron';
      let phone = authUser.user_metadata?.phone || '';

      if (supabase) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (profile) {
          role = profile.role || 'customer';
          if (profile.full_name) fullName = profile.full_name;
          if (profile.phone) phone = profile.phone;
        }
      }

      const isAdmin = role === 'admin' || role === 'staff';

      const userProfile: UserProfile = {
        id: authUser.id,
        name: fullName,
        email: authUser.email || '',
        phone,
        isAdmin,
        addresses: [],
        wishlistProductIds: [],
      };

      setUser(userProfile);
    } catch (e) {
      console.warn('Profile sync warning:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Local caching sync
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const login = async (email: string, name?: string, role?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const isAdminUser =
      role === 'admin' ||
      cleanEmail === 'admin@divineseternity.com' ||
      cleanEmail === 'owner@divineseternity.com' ||
      cleanEmail === 'admin';

    if (isAdminUser) {
      try {
        localStorage.setItem('de_admin_authenticated', 'true');
        localStorage.setItem('de_admin_user_role', 'admin');
        sessionStorage.setItem('de_admin_authenticated', 'true');
        sessionStorage.setItem('de_admin_user_role', 'admin');
      } catch {
        // ignore
      }
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || (isAdminUser ? 'Atelier Administrator' : email.split('@')[0]),
      email: email.trim(),
      phone: '',
      isAdmin: isAdminUser,
      addresses: [],
      wishlistProductIds: [],
    };
    setUser(newUser);
    return {
      success: true,
      message: isAdminUser ? 'Welcome, Administrator!' : 'Welcome to Divine’s Eternity',
    };
  };

  const logout = async () => {
    try {
      localStorage.removeItem('de_admin_authenticated');
      localStorage.removeItem('de_admin_user_role');
      sessionStorage.removeItem('de_admin_authenticated');
      sessionStorage.removeItem('de_admin_user_role');
    } catch {
      // ignore
    }
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign out error', e);
      }
    }
    setUser(null);
  };

  const updateAddress = (newAddress: CustomerAddress) => {
    if (!user) return;
    setUser({
      ...user,
      addresses: [newAddress, ...user.addresses.filter((a) => a.streetAddress !== newAddress.streetAddress)],
    });
  };

  const isAuthenticated = !!user;
  const isAdmin = !!user?.isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        logout,
        updateAddress,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
