import React, { useRef } from 'react';
import { Product } from '../../types';
import { Sparkles, Upload, Image, Music, Gift, Heart, Check } from 'lucide-react';

interface GiftPersonalizerProps {
  product: Product;
  customText: string;
  setCustomText: (text: string) => void;
  customPhoto?: string;
  setCustomPhoto?: (photo: string) => void;
  customSong?: string;
  setCustomSong?: (song: string) => void;
  customArtist?: string;
  setCustomArtist?: (artist: string) => void;
  giftMessage?: string;
  setGiftMessage?: (msg: string) => void;
}

export const GiftPersonalizer: React.FC<GiftPersonalizerProps> = ({
  product,
  customText,
  setCustomText,
  customPhoto,
  setCustomPhoto,
  customSong,
  setCustomSong,
  customArtist,
  setCustomArtist,
  giftMessage,
  setGiftMessage,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const config = product.personalizationConfig;

  if (!product.allowsPersonalization) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && setCustomPhoto) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCustomPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#FFF8F4] dark:bg-slate-900/50 p-4 sm:p-5 rounded-3xl border border-pink-200/80 dark:border-pink-900/40 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-pink-200/60 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#E11D48]">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
          <span>Bespoke Customization & Engraving (FREE)</span>
        </div>
        <span className="text-[10px] bg-pink-100 dark:bg-pink-950/60 text-[#E11D48] px-2 py-0.5 rounded-full font-bold">
          Handcrafted
        </span>
      </div>

      {/* 1. Name / Calligraphy Text Input */}
      {config?.allowsText !== false && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {config?.textLabel || 'Personalized Name / Date to Engrave'}
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {customText.length}/{config?.textMaxLength || 20} chars
            </span>
          </div>
          <input
            type="text"
            maxLength={config?.textMaxLength || 20}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder={config?.textPlaceholder || 'e.g. Isabella, Maya, 14.02.2024'}
            className="w-full bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E11D48] focus:outline-none"
          />
        </div>
      )}

      {/* 2. Photo Upload for Plaques & Crystal Lamps */}
      {config?.allowsPhoto && setCustomPhoto && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span>{config.photoLabel || 'Upload High-Res Photo'}</span>
            {customPhoto && (
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                <Check className="w-3 h-3" /> Photo Attached
              </span>
            )}
          </label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-pink-300 dark:border-slate-700 hover:border-[#E11D48] rounded-2xl p-4 text-center cursor-pointer transition-colors bg-white/70 dark:bg-slate-800/40 flex flex-col items-center justify-center gap-2"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            {customPhoto ? (
              <div className="flex items-center gap-3">
                <img
                  src={customPhoto}
                  alt="Uploaded preview"
                  className="w-12 h-12 rounded-xl object-cover border border-pink-200"
                />
                <div className="text-left text-xs">
                  <p className="font-bold text-slate-800 dark:text-white">Photo Ready for Laser UV Print</p>
                  <p className="text-[10px] text-pink-600">Click to change picture</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-slate-700 text-[#E11D48] flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Click or drag photo here (PNG, JPG)
                </p>
                <p className="text-[10px] text-slate-400">Renders live on the plaque mockup above!</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* 3. Song Title & Artist for Music Plaques */}
      {config?.allowsSong && setCustomSong && setCustomArtist && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Music className="w-3 h-3 text-[#1DB954]" />
              <span>Song Title</span>
            </label>
            <input
              type="text"
              value={customSong || ''}
              onChange={(e) => setCustomSong(e.target.value)}
              placeholder={config.songPlaceholder || 'e.g. Perfect'}
              className="w-full bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Artist Name
            </label>
            <input
              type="text"
              value={customArtist || ''}
              onChange={(e) => setCustomArtist(e.target.value)}
              placeholder={config.artistPlaceholder || 'e.g. Ed Sheeran'}
              className="w-full bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* 4. Free Gift Message & Wax Seal Card */}
      {setGiftMessage && (
        <div className="pt-2 border-t border-pink-100 dark:border-slate-800 space-y-1.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-[#E11D48]" />
            <span>Free Hand-Written Wax Sealed Card Message</span>
          </label>
          <textarea
            rows={2}
            value={giftMessage || ''}
            onChange={(e) => setGiftMessage(e.target.value)}
            placeholder="Write a sweet note for your loved one. We print it on textured parchment with a real wax seal!"
            className="w-full bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E11D48] focus:outline-none"
          />
        </div>
      )}
    </div>
  );
};
