import React, { useRef, useState } from 'react';
import { Product } from '../../types';
import { Sparkles, Upload, Image, Music, Gift, Heart, Check, Type } from 'lucide-react';

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
  const [selectedFont, setSelectedFont] = useState<'script' | 'serif' | 'sans'>('script');
  const [selectedFinish, setSelectedFinish] = useState<'18k-gold' | 'rose-gold' | 'silver'>('18k-gold');

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
    <div className="bg-[#FFFDF8] p-4 sm:p-6 rounded-3xl border border-[#F3E8E2] space-y-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#FF2E93]">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
          <span>Bespoke Name Engraving & Personalization</span>
        </div>
        <span className="text-[10px] text-[#211D1C] bg-[#FFD94A] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Complimentary
        </span>
      </div>

      {/* 1. Name / Calligraphy Text Input & Font Selector */}
      {config?.allowsText !== false && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#211D1C] flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#FF2E93]" />
              <span>{config?.textLabel || 'Personalized Name to Print / Engrave'}</span>
            </label>
            <span className="text-[10px] text-stone-400 font-mono">
              {customText.length}/{config?.textMaxLength || 20} chars
            </span>
          </div>

          <input
            type="text"
            maxLength={config?.textMaxLength || 20}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder={config?.textPlaceholder || 'e.g. Shyla, Angel, Mia & Leo'}
            className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#211D1C] focus:ring-2 focus:ring-[#FF2E93] focus:outline-none"
          />

          {/* Typography Style Switcher */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
              Choose Lettering Style:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedFont('script')}
                className={`p-2 rounded-xl text-center border transition-all text-xs cursor-pointer ${
                  selectedFont === 'script'
                    ? 'border-[#FF2E93] bg-[#FFF0F3] text-[#FF2E93] shadow-xs'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <span className="font-script text-base block -mt-1">Script</span>
                <span className="text-[9px] block text-stone-400">Cute Cursive</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFont('serif')}
                className={`p-2 rounded-xl text-center border transition-all text-xs cursor-pointer ${
                  selectedFont === 'serif'
                    ? 'border-[#FF2E93] bg-[#FFF0F3] text-[#FF2E93] shadow-xs'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <span className="font-serif font-bold text-xs block">ROMAN</span>
                <span className="text-[9px] block text-stone-400">Classic Serif</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFont('sans')}
                className={`p-2 rounded-xl text-center border transition-all text-xs cursor-pointer ${
                  selectedFont === 'sans'
                    ? 'border-[#FF2E93] bg-[#FFF0F3] text-[#FF2E93] shadow-xs'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <span className="font-sans font-bold text-xs block tracking-widest">MINIMAL</span>
                <span className="text-[9px] block text-stone-400">Clean Sans</span>
              </button>
            </div>
          </div>

          {/* Live Preview Box for Monogram */}
          {customText.trim() && (
            <div className="p-3.5 rounded-2xl bg-white border border-[#F3E8E2] text-center space-y-1 shadow-xs">
              <span className="text-[9px] uppercase tracking-widest text-[#FF2E93] font-bold block">
                Live Text Simulation
              </span>
              <div
                className={`text-xl sm:text-2xl text-[#211D1C] tracking-wide ${
                  selectedFont === 'script'
                    ? 'font-script text-2xl sm:text-3xl text-[#FF2E93]'
                    : selectedFont === 'serif'
                    ? 'font-serif font-bold'
                    : 'font-sans font-bold tracking-widest uppercase'
                }`}
              >
                {customText}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Photo Upload */}
      {config?.allowsPhoto && setCustomPhoto && (
        <div className="space-y-2 pt-2 border-t border-[#F3E8E2]">
          <label className="text-xs font-bold text-[#211D1C] flex items-center justify-between">
            <span>{config.photoLabel || 'Upload High-Resolution Photo'}</span>
            {customPhoto && (
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                <Check className="w-3 h-3" /> Photo Attached
              </span>
            )}
          </label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-200 hover:border-[#FF2E93] rounded-2xl p-4 text-center cursor-pointer transition-colors bg-white flex flex-col items-center justify-center gap-2"
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
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                />
                <div className="text-left text-xs">
                  <p className="font-bold text-[#211D1C]">Photo Loaded for Case Print</p>
                  <p className="text-[10px] text-[#FF2E93]">Click to change picture</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-[#FFF0F3] text-[#FF2E93] flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="text-xs text-stone-700 font-medium">
                  Click or drag photo here (PNG, JPG)
                </p>
                <p className="text-[10px] text-stone-400">Renders live on your case mockup!</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* 3. Song Title & Artist */}
      {config?.allowsSong && setCustomSong && setCustomArtist && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#F3E8E2]">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
              <Music className="w-3 h-3 text-[#1DB954]" />
              <span>Song Title</span>
            </label>
            <input
              type="text"
              value={customSong || ''}
              onChange={(e) => setCustomSong(e.target.value)}
              placeholder={config.songPlaceholder || 'e.g. Can’t Help Falling in Love'}
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-[#211D1C] focus:ring-2 focus:ring-[#FF2E93] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-700">
              Artist Name
            </label>
            <input
              type="text"
              value={customArtist || ''}
              onChange={(e) => setCustomArtist(e.target.value)}
              placeholder={config.artistPlaceholder || 'e.g. Elvis Presley'}
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-[#211D1C] focus:ring-2 focus:ring-[#FF2E93] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 4. Free Hand-Written Card Message */}
      {setGiftMessage && (
        <div className="pt-2 border-t border-[#F3E8E2] space-y-1.5">
          <label className="text-xs font-bold text-[#211D1C] flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-[#FF2E93]" />
            <span>Complimentary Handwritten Gift Card Note</span>
          </label>
          <textarea
            rows={2}
            value={giftMessage || ''}
            onChange={(e) => setGiftMessage(e.target.value)}
            placeholder="Write your heartfelt note. Free gift card included in every parcel."
            className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-[#211D1C] focus:ring-2 focus:ring-[#FF2E93] focus:outline-none"
          />
        </div>
      )}
    </div>
  );
};
