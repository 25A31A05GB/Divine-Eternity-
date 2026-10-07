import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-2xl animate-in slide-in-from-bottom-2">
      <WifiOff className="w-4 h-4 text-amber-200 shrink-0" />
      <span>Offline Mode — Browsing Cached Collections</span>
    </div>
  );
};
