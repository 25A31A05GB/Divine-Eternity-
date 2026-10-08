import React, { useRef, useState } from 'react';
import { Product } from '../../types';
import { Sparkles, Upload, Image as ImageIcon, Music, Gift, Heart, Check, Type, Eye, Layers, ShieldCheck } from 'lucide-react';

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
  const [selectedFont, setSelectedFont] = useState<'script' | 'serif' | 'roman' | 'sans'>('script');
  const [selectedFinish, setSelectedFinish] = useState<'18k-gold' | 'rose-gold' | 'silver'>('18k-gold');
  const [liveGlowColor, setLiveGlowColor] = useState<'warm' | 'white' | 'rgb'>('warm');

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

  const isJewelry = product.category.toLowerCase().includes('jewel') || product.name.toLowerCase().includes('pendant') || product.name.toLowerCase().includes('locket') || product.name.toLowerCase().includes('bracelet');
  const isPlaqueOrSong = product.category.toLowerCase().includes('song') || product.category.toLowerCase().includes('plaque') || product.name.toLowerCase().includes('spotify');
  const isCrystalOrLamp = product.category.toLowerCase().includes('crystal') || product.category.toLowerCase().includes('lamp') || product.name.toLowerCase().includes('dome');

  return (
    <div className="bg-[#FFFDF8] p-4 sm:p-6 rounded-3xl border border-[#F3E8E2] space-y-6 shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#FF2E93]">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
          <span>Bespoke Customization Atelier</span>
        </div>
        <span className="text-[10px] text-[#211D1C] bg-[#FFD94A] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
          Live Proof Available
        </span>
      </div>

      {/* ============================================================ */}
      {/* BESPOKE LIVE ENGRAVING / CUSTOM VISUAL PREVIEW CANVAS */}
      {/* ============================================================ */}
      <div className="rounded-2xl overflow-hidden border border-[#F5E6CE] bg-gradient-to-br from-[#171413] via-[#262120] to-[#171413] p-5 text-white space-y-3 relative shadow-inner">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#FFD94A] font-bold uppercase tracking-wider flex items-center gap-1">
            <Eye className="w-3 h-3 text-[#FF2E93]" />
            <span>Interactive Live Atelier Mockup</span>
          </span>
          <span className="text-[10px] text-stone-400 font-mono">100% Laser Precision</span>
        </div>

        {/* Dynamic Visual Mockup Center */}
        <div className="min-h-[140px] flex items-center justify-center p-4">
          
          {/* A. Personalized Jewellery Bar / Locket Preview */}
          {isJewelry && (
            <div className="flex flex-col items-center space-y-3 animate-in fade-in duration-300">
              {/* Metallic Chain / Bar Rendering */}
              <div className="w-48 h-1 bg-gradient-to-r from-transparent via-amber-200 to-transparent opacity-80" />
              
              <div
                className={`relative px-8 py-3.5 rounded-xl border shadow-2xl text-center transform transition-all duration-300 ${
                  selectedFinish === '18k-gold'
                    ? 'bg-gradient-to-r from-[#F7D070] via-[#FFEBB0] to-[#E5BD55] text-[#4A3206] border-[#FFD94A]'
                    : selectedFinish === 'rose-gold'
                    ? 'bg-gradient-to-r from-[#F6B6A5] via-[#FFDED6] to-[#E39886] text-[#4F1D15] border-[#F6B6A5]'
                    : 'bg-gradient-to-r from-[#E2E8F0] via-[#FFFFFF] to-[#CBD5E1] text-[#1E293B] border-white'
                }`}
              >
                <div className="absolute inset-0 bg-white/20 rounded-xl pointer-events-none" />
                <span
                  className={`text-lg sm:text-xl font-bold tracking-wide select-none drop-shadow-xs ${
                    selectedFont === 'script'
                      ? 'font-serif italic text-2xl font-normal'
                      : selectedFont === 'roman'
                      ? 'font-serif tracking-widest uppercase'
                      : selectedFont === 'serif'
                      ? 'font-serif'
                      : 'font-sans font-extrabold uppercase tracking-wider'
                  }`}
                >
                  {customText.trim() || 'Your Name Here'}
                </span>
              </div>
              <span className="text-[10px] text-amber-200/80 font-mono tracking-widest uppercase">
                ✦ 18k Thick Gold Vermeil Micro-Engraving ✦
              </span>
            </div>
          )}

          {/* B. Spotify Acrylic Plaque Live Preview */}
          {isPlaqueOrSong && (
            <div className="w-full max-w-xs bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl space-y-3 text-center">
              <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden bg-stone-800 border border-white/30 flex items-center justify-center">
                {customPhoto ? (
                  <img src={customPhoto} alt="Album Art" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                ) : (
                  <Music className="w-8 h-8 text-[#FF2E93]" />
                )}
              </div>
              <div>
                <div className="font-bold text-xs text-white truncate">{customSong || 'Your Favorite Song'}</div>
                <div className="text-[10px] text-stone-400 truncate">{customArtist || 'Special Artist'}</div>
              </div>

              {/* Scannable Soundwave Mockup */}
              <div className="flex items-center justify-center gap-1 py-1">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1 bg-[#1DB954] rounded-full"
                    style={{ height: `${Math.sin(i * 0.8) * 12 + 16}px` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* C. Illuminated 3D Crystal / Lamp Mockup */}
          {isCrystalOrLamp && (
            <div className="flex flex-col items-center space-y-2">
              <div className="relative w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 p-2 shadow-2xl flex items-center justify-center overflow-hidden">
                {customPhoto ? (
                  <img src={customPhoto} alt="Photo Proof" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-xl opacity-90 brightness-110" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-[#FFD94A] opacity-70" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-400/20 via-transparent to-white/10 pointer-events-none" />
              </div>
              {/* Wooden LED base mockup */}
              <div className="w-32 h-3.5 bg-amber-800 rounded-lg shadow-md border border-amber-700 flex items-center justify-center text-[9px] text-amber-200">
                Warm Wooden LED Base
              </div>
            </div>
          )}
        </div>

        {/* Finish / Color Switcher for Jewellery */}
        {isJewelry && (
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-stone-400 font-semibold">Precious Metal Finish:</span>
            <div className="flex items-center gap-1.5">
              {[
                { id: '18k-gold', label: '18k Gold', color: 'bg-amber-400' },
                { id: 'rose-gold', label: 'Rose Gold', color: 'bg-rose-300' },
                { id: 'silver', label: '925 Silver', color: 'bg-slate-200' },
              ].map((finish) => (
                <button
                  key={finish.id}
                  type="button"
                  onClick={() => setSelectedFinish(finish.id as any)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    selectedFinish === finish.id
                      ? 'bg-white text-[#211D1C] shadow-xs'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${finish.color}`} />
                  <span>{finish.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
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
            className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3.5 py-2.5 text-xs text-[#211D1C] font-semibold outline-none shadow-xs"
          />

          {/* Typography Style Switcher */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
              Choose Lettering Typography Style:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSelectedFont('script')}
                className={`p-2 rounded-xl text-center border transition-all text-xs cursor-pointer ${
                  selectedFont === 'script'
                    ? 'border-[#FF2E93] bg-[#FFF0F5] text-[#FF2E93] font-bold shadow-xs'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <span className="font-serif italic text-sm block">Cursive Script</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFont('serif')}
                className={`p-2 rounded-xl text-center border transition-all text-xs cursor-pointer ${
                  selectedFont === 'serif'
                    ? 'border-[#FF2E93] bg-[#FFF0F5] text-[#FF2E93] font-bold shadow-xs'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <span className="font-serif font-bold text-xs block">Royal Serif</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFont('roman')}
                className={`p-2 rounded-xl text-center border transition-all text-xs cursor-pointer ${
                  selectedFont === 'roman'
                    ? 'border-[#FF2E93] bg-[#FFF0F5] text-[#FF2E93] font-bold shadow-xs'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <span className="font-serif tracking-widest text-xs block">ROMAN / DATE</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFont('sans')}
                className={`p-2 rounded-xl text-center border transition-all text-xs cursor-pointer ${
                  selectedFont === 'sans'
                    ? 'border-[#FF2E93] bg-[#FFF0F5] text-[#FF2E93] font-bold shadow-xs'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <span className="font-sans font-bold text-xs block">Minimal Sans</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Photo Upload Option */}
      {(config?.allowsPhoto || setCustomPhoto) && (
        <div className="space-y-2 pt-2 border-t border-[#F3E8E2]">
          <label className="text-xs font-bold text-[#211D1C] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#FF2E93]" />
              <span>{config?.photoLabel || 'Upload Your Picture for Locket / Frame'}</span>
            </span>
            {customPhoto && (
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" /> Photo Attached
              </span>
            )}
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2.5 px-4 rounded-xl border border-dashed border-[#FF2E93] bg-[#FFF0F5] hover:bg-[#FFE0E6] text-[#FF2E93] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <Upload className="w-4 h-4" />
              <span>{customPhoto ? 'Change Uploaded Photo' : 'Choose Photo From Device'}</span>
            </button>

            {customPhoto && (
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#F3E8E2] shrink-0 shadow-2xs">
                <img src={customPhoto} alt="Upload preview" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Spotify Song & Artist Name */}
      {(config?.allowsSong || isPlaqueOrSong) && (
        <div className="space-y-3 pt-2 border-t border-[#F3E8E2]">
          <label className="text-xs font-bold text-[#211D1C] flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-[#FF2E93]" />
            <span>Spotify Song Plaque Details</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              value={customSong || ''}
              onChange={(e) => setCustomSong && setCustomSong(e.target.value)}
              placeholder="Song Title (e.g. Perfect)"
              className="bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-xs text-[#211D1C] outline-none"
            />
            <input
              type="text"
              value={customArtist || ''}
              onChange={(e) => setCustomArtist && setCustomArtist(e.target.value)}
              placeholder="Artist Name (e.g. Ed Sheeran)"
              className="bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-xs text-[#211D1C] outline-none"
            />
          </div>
        </div>
      )}

      {/* WhatsApp Proof Assurance */}
      <div className="p-3 rounded-2xl bg-[#FFF9EB] border border-[#F5E6CE] flex items-center gap-2.5 text-xs text-[#211D1C]">
        <ShieldCheck className="w-4 h-4 text-[#FF2E93] shrink-0" />
        <span className="text-[11px] text-stone-700">
          Our design atelier will share a <strong>live WhatsApp artwork proof</strong> with you before final laser engraving!
        </span>
      </div>
    </div>
  );
};
