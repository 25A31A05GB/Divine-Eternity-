import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, Sparkles } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as standalone app, hide the prompt
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F5] hover:bg-[#FFE0E6] text-[#FF2E93] border border-[#FF2E93]/30 text-xs font-bold transition-all shadow-2xs cursor-pointer"
        title="Install Divine’s Eternity App on your phone"
      >
        <Smartphone className="w-3.5 h-3.5 text-[#FF2E93]" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F5] hover:bg-[#FFE0E6] text-[#FF2E93] border border-[#FF2E93]/30 text-xs font-bold transition-all shadow-2xs cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install on iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-3xl bg-[#FFFDF8] p-6 shadow-2xl border border-[#F3E8E2] text-[#211D1C] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-heading text-base font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF2E93]" />
                  <span>Install Divine’s Eternity on iPhone</span>
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                1. Tap the <strong>Share</strong> button (box with upward arrow) in the Safari toolbar.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#211D1C] hover:bg-black text-white text-xs font-bold cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
