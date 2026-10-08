import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { soundFeedback } from '../lib/soundFeedback';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AlertCircle, X } from 'lucide-react';

interface WishlistContextType {
  wishlist: string[]; // array of product IDs
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
  error: string | null;
  clearError: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'divines_eternity_wishlist_v1';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // When guest, keep local storage updated as a cache
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
      } catch (e) {
        console.error('Failed to save wishlist cache', e);
      }
    }
  }, [wishlist, isAuthenticated]);

  // When user logs in, load wishlist from Supabase and merge local guest list
  useEffect(() => {
    if (!isAuthenticated || !user?.id || !isSupabaseConfigured() || !supabase) {
      return;
    }

    let isMounted = true;
    const syncWithSupabase = async () => {
      try {
        // 1. Fetch remote wishlist
        const { data, error: fetchErr } = await supabase!
          .from('wishlist_items')
          .select('product_id')
          .eq('user_id', user.id);

        if (fetchErr) {
          console.error('Failed to load wishlist from Supabase', fetchErr);
          setError(`Supabase Wishlist Error: ${fetchErr.message}`);
          return;
        }

        const remoteProductIds = (data || []).map((row: any) => row.product_id);

        // 2. Read local guest cache to merge
        let localGuestIds: string[] = [];
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) localGuestIds = JSON.parse(raw);
        } catch {
          // ignore
        }

        const itemsToMerge = localGuestIds.filter((id) => !remoteProductIds.includes(id));

        if (itemsToMerge.length > 0) {
          const rowsToInsert = itemsToMerge.map((pid) => ({
            user_id: user.id,
            product_id: pid,
          }));

          const { error: insertErr } = await supabase!
            .from('wishlist_items')
            .upsert(rowsToInsert);

          if (insertErr) {
            console.error('Failed to merge local wishlist to Supabase', insertErr);
            setError(`Supabase Wishlist Sync Error: ${insertErr.message}`);
          } else {
            // Local guest items successfully merged into remote database
            try {
              localStorage.removeItem(STORAGE_KEY);
            } catch {
              // ignore
            }
          }
        }

        const mergedList = Array.from(new Set([...remoteProductIds, ...itemsToMerge]));
        if (isMounted) {
          setWishlist(mergedList);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(`Supabase Wishlist Sync Error: ${err.message}`);
        }
      }
    };

    syncWithSupabase();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.id]);

  const toggleWishlist = async (productId: string) => {
    soundFeedback.playWishlistChime(0.1);
    const isCurrentlyIn = wishlist.includes(productId);

    // If authenticated, persist write directly to Supabase wishlist_items
    if (isAuthenticated && user?.id && isSupabaseConfigured() && supabase) {
      if (isCurrentlyIn) {
        // Delete from Supabase
        const { error: delErr } = await supabase
          .from('wishlist_items')
          .delete()
          .match({ user_id: user.id, product_id: productId });

        if (delErr) {
          setError(`Failed to remove item from Supabase wishlist: ${delErr.message}`);
          return; // Never silently fall back on shared business data write failure!
        }
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        // Insert to Supabase
        const { error: insErr } = await supabase
          .from('wishlist_items')
          .insert({ user_id: user.id, product_id: productId });

        if (insErr) {
          setError(`Failed to save item to Supabase wishlist: ${insErr.message}`);
          return; // Never silently fall back!
        }
        setWishlist((prev) => [...prev, productId]);
      }
    } else {
      // Guest mode: local cache
      setWishlist((prev) =>
        isCurrentlyIn ? prev.filter((id) => id !== productId) : [...prev, productId]
      );
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
        error,
        clearError,
      }}
    >
      {error && (
        <div className="fixed bottom-4 right-4 z-[9999] max-w-md bg-rose-900/95 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-rose-500/50 flex items-start gap-3 backdrop-blur-md animate-in slide-in-from-bottom-2">
          <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-rose-100">Database Synchronisation Notice</p>
            <p className="text-rose-200 mt-0.5 leading-relaxed">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-rose-300 hover:text-white p-1 rounded transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
