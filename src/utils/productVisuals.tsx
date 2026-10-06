import React from 'react';
import { Product } from '../types';
import { Music, Play, Heart, Sparkles, Camera, Lock, Flame, Users, Sparkle } from 'lucide-react';

interface PhoneCaseMockupProps {
  product: Pick<Product, 'designPattern' | 'themeColor' | 'secondaryColor' | 'name' | 'category'>;
  customText?: string;
  customPhoto?: string;
  customSong?: string;
  customArtist?: string;
  className?: string;
  isHovered?: boolean;
}

export const PhoneCaseMockup: React.FC<PhoneCaseMockupProps> = ({
  product,
  customText,
  customPhoto,
  customSong,
  customArtist,
  className = 'w-full h-full',
  isHovered = false,
}) => {
  const { designPattern, themeColor, secondaryColor, name } = product;

  return (
    <div
      className={`relative flex items-center justify-center select-none overflow-hidden ${className} transition-transform duration-500 ${
        isHovered ? 'scale-105 rotate-1' : ''
      }`}
      style={{
        background: `radial-gradient(circle at 50% 30%, ${themeColor}50 0%, #FFF8F4 75%)`,
      }}
    >
      {/* Ambient Gold Accents */}
      <div className="absolute top-3 left-4 text-xs text-[#BE123C]/70 animate-pulse">✦</div>
      <div className="absolute bottom-6 right-5 text-sm text-[#C5A059]/90 animate-pulse">✦</div>

      {/* 1. Personalized Name Necklace Mockup */}
      {designPattern === 'jewelry_necklace' && (
        <div className="relative w-64 h-64 flex flex-col items-center justify-center">
          {/* Gold Chain Arc */}
          <svg className="w-56 h-36 overflow-visible" viewBox="0 0 200 120">
            <path
              d="M 10 20 C 50 110, 150 110, 190 20"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="3.5"
              strokeDasharray="4 2"
            />
            {/* Clasp rings */}
            <circle cx="10" cy="20" r="3.5" fill="#B8860B" />
            <circle cx="190" cy="20" r="3.5" fill="#B8860B" />
          </svg>

          {/* Nameplate Pendant */}
          <div className="-mt-10 bg-gradient-to-r from-[#D4AF37] via-[#FFDF73] to-[#B8860B] px-6 py-2 rounded-2xl shadow-xl border border-amber-300 text-center transform hover:scale-110 transition-transform">
            <p className="font-script text-2xl sm:text-3xl text-amber-950 font-bold drop-shadow-xs tracking-wider">
              {customText && customText.trim() ? customText : 'Divine'}
            </p>
            <div className="flex items-center justify-center gap-1 text-[9px] text-amber-900 font-bold uppercase tracking-widest mt-0.5">
              <span>✦ 18k Solid Gold ✦</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Preserved Eternal Rose in Glass Dome */}
      {designPattern === 'eternal_rose_dome' && (
        <div className="relative w-56 h-72 flex flex-col items-center justify-end pb-4">
          {/* Glass Cloche Dome */}
          <div className="relative w-44 h-60 rounded-t-full border-4 border-white/80 bg-gradient-to-b from-white/40 via-rose-50/20 to-black/10 backdrop-blur-xs shadow-2xl flex flex-col items-center justify-between p-4 overflow-hidden">
            {/* Fairy Lights Twinkle */}
            <div className="absolute inset-0 bg-[radial-gradient(#E5C378_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-70 animate-pulse" />
            
            <div className="w-4 h-4 rounded-full bg-white/60 mx-auto -mt-2 shadow-xs" />

            {/* Glowing Rose Art Center */}
            <div className="relative my-auto flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-900 via-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-rose-900/40 border border-rose-300/40">
                <Heart className="w-10 h-10 text-rose-100 fill-rose-100/90" />
              </div>
              <div className="text-[10px] text-amber-300 font-semibold tracking-widest uppercase mt-2">
                Preserved Flora
              </div>
            </div>

            {/* Fallen Petals at base */}
            <div className="flex gap-2 text-xs text-rose-400 opacity-90 items-center">
              <span className="w-2 h-2 rounded-full bg-rose-700 inline-block" />
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
            </div>
          </div>

          {/* Wooden Base with Brass Engraved Plate */}
          <div className="w-52 h-10 bg-amber-950 rounded-2xl shadow-xl flex items-center justify-center border-t-2 border-amber-800 -mt-2 relative z-10 px-2">
            <div className="bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 px-3 py-0.5 rounded border border-amber-600 shadow-xs max-w-full truncate">
              <span className="text-[10px] font-bold text-amber-950 font-serif tracking-wide truncate block">
                {customText && customText.trim() ? customText : 'Forever & Always'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Custom Acrylic Song Plaque with Wooden Base */}
      {designPattern === 'acrylic_song_plaque' && (
        <div className="relative w-56 h-72 flex flex-col items-center justify-end pb-3">
          {/* Clear Acrylic Frame */}
          <div className="w-44 h-56 rounded-2xl bg-white/70 dark:bg-black/50 backdrop-blur-md border-2 border-white/90 shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
            {/* Uploaded Photo / Default Aesthetic Couple Artwork */}
            <div className="w-full aspect-square rounded-xl bg-pink-100 overflow-hidden relative shadow-inner flex items-center justify-center">
              {customPhoto ? (
                <img
                  src={customPhoto}
                  alt="Custom Couple Portrait"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-pink-300 via-rose-200 to-amber-100 flex flex-col items-center justify-center p-2 text-center">
                  <Users className="w-8 h-8 text-rose-800 mb-1" />
                  <span className="text-[9px] font-bold text-rose-900 uppercase tracking-wide">Couple Photo</span>
                </div>
              )}
            </div>

            {/* Song Title & Artist */}
            <div className="pt-1 text-left">
              <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                {customSong && customSong.trim() ? customSong : 'Our Memorable Song'}
              </p>
              <p className="text-[9px] text-slate-500 truncate">
                {customArtist && customArtist.trim() ? customArtist : 'Divine Sound Studio'}
              </p>
            </div>

            {/* Spotify Scannable Code Bar */}
            <div className="bg-black text-white px-2 py-1 rounded-md flex items-center justify-between gap-1">
              <Music className="w-3 h-3 text-[#1DB954]" />
              <div className="flex-1 flex items-center justify-center gap-0.5 h-3">
                {[6, 12, 18, 9, 15, 20, 10, 14, 8, 16, 12, 6].map((h, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-white rounded-full"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
              <Play className="w-2.5 h-2.5 fill-current" />
            </div>
          </div>

          {/* Warm LED Wooden Stand */}
          <div className="w-48 h-8 bg-amber-800 rounded-xl shadow-lg border-t-2 border-amber-600 -mt-2 flex items-center justify-center relative z-10">
            <span className="text-[9px] font-bold text-amber-200 tracking-wider">
              ✦ WARM ILLUMINATION ✦
            </span>
          </div>
        </div>
      )}

      {/* 4. 3D Laser Engraved Crystal Memory Cube */}
      {designPattern === 'crystal_photo_cube' && (
        <div className="relative w-56 h-64 flex flex-col items-center justify-center">
          {/* Glass Crystal Cube with Optical Refraction */}
          <div className="w-40 h-44 rounded-2xl bg-gradient-to-tr from-cyan-100/60 via-white/80 to-blue-200/50 backdrop-blur-md border-4 border-white/90 shadow-2xl flex flex-col items-center justify-center p-3 relative overflow-hidden">
            <Sparkles className="absolute top-2 left-2 w-3.5 h-3.5 text-cyan-500" />
            <Sparkles className="absolute bottom-2 right-2 w-3.5 h-3.5 text-blue-500" />
            
            {/* 3D Holographic Laser Portrait */}
            <div className="w-28 h-28 rounded-full bg-cyan-900/10 border border-cyan-400/40 flex flex-col items-center justify-center text-center p-2 animate-pulse">
              <Camera className="w-8 h-8 text-cyan-700 mb-1" />
              <span className="text-[8px] font-bold text-cyan-950 uppercase tracking-widest">
                3D Laser Crystal
              </span>
            </div>

            <p className="text-[10px] font-bold text-slate-800 font-serif mt-2 truncate max-w-full">
              {customText && customText.trim() ? customText : 'Forever Loved'}
            </p>
          </div>

          {/* Wooden Pedestal */}
          <div className="w-44 h-6 bg-slate-900 rounded-xl -mt-2 shadow-md flex items-center justify-center">
            <div className="w-8 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#38bdf8]" />
          </div>
        </div>
      )}

      {/* 5. Engraved Wooden Keepsake Box */}
      {designPattern === 'wooden_keepsake_box' && (
        <div className="relative w-56 h-56 flex flex-col items-center justify-center">
          <div className="w-48 h-36 rounded-2xl bg-amber-900 border-4 border-amber-800 shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden">
            {/* Wood Grain Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.1)_50%)] [background-size:20px_20px] opacity-40" />

            {/* Brass Latch */}
            <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-amber-600 mx-auto shadow-md flex items-center justify-center text-amber-950">
              <Lock className="w-3.5 h-3.5" />
            </div>

            {/* Custom Engraved Lid Text */}
            <div className="text-center relative z-10 bg-amber-950/40 p-2 rounded-xl border border-amber-700/50">
              <p className="font-serif italic text-sm text-amber-200 font-bold truncate">
                {customText && customText.trim() ? customText : 'Rohan & Ananya'}
              </p>
              <span className="text-[8px] tracking-widest uppercase text-amber-400">
                ✦ Heirloom Keepsake Casket ✦
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 6. Romantic Couple Candle Hamper */}
      {designPattern === 'scented_candle_hamper' && (
        <div className="relative w-60 h-60 flex items-center justify-center">
          <div className="w-52 h-44 rounded-3xl bg-pink-50 dark:bg-slate-900 border-2 border-pink-200 p-3 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-around pt-2">
              {/* Candle 1 */}
              <div className="flex flex-col items-center">
                <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                <div className="w-12 h-14 bg-rose-200 rounded-xl border border-rose-300 shadow-inner flex items-center justify-center text-[8px] font-bold text-rose-900 text-center">
                  Rose Oud
                </div>
              </div>
              {/* Candle 2 */}
              <div className="flex flex-col items-center">
                <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                <div className="w-12 h-14 bg-amber-100 rounded-xl border border-amber-300 shadow-inner flex items-center justify-center text-[8px] font-bold text-amber-900 text-center">
                  Vanilla
                </div>
              </div>
            </div>
            {/* Satin Eye Mask */}
            <div className="bg-[#881337] text-white text-center py-1 rounded-xl text-[9px] font-bold shadow-xs">
              Mulberry Silk Mask Included
            </div>
          </div>
        </div>
      )}

      {/* 7. Phone Case Variations (Pearl Bracelet, Zipper Wallet, Mirror, etc.) */}
      {[
        'pearl_bracelet',
        'zipper_wallet',
        'chrome_mirror',
        'clear_floral',
        'bow_ribbon',
        'squishy_toy',
        'vintage_cherries',
        'aesthetic_clouds',
        'golden_butterflies',
        'starry_night',
        'checkerboard_pink',
      ].includes(designPattern) && (
        <div
          className="relative w-[190px] h-[340px] sm:w-[210px] sm:h-[370px] rounded-[38px] p-[6px] shadow-2xl transition-all duration-500"
          style={{
            backgroundColor: '#1E1E24',
            boxShadow: isHovered
              ? '0 25px 40px -15px rgba(225, 29, 72, 0.35), 0 15px 25px -10px rgba(0, 0, 0, 0.2)'
              : '0 20px 30px -10px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Phone Case Outer Rim */}
          <div
            className="relative w-full h-full rounded-[32px] overflow-hidden flex flex-col justify-between"
            style={{
              backgroundColor: themeColor,
              border: `2px solid ${secondaryColor}30`,
            }}
          >
            {/* Glossy glass highlight */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 45%, rgba(0,0,0,0.05) 100%)',
              }}
            />

            {/* Camera Module Bumper */}
            <div className="relative z-10 p-3 flex items-start justify-between">
              <div className="w-16 h-16 sm:w-18 sm:h-18 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-[18px] p-1.5 shadow-md border border-white/80 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-cyan-900/60 ring-1 ring-cyan-400/40" />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-100 border border-amber-300 shadow-sm" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-indigo-900/60 ring-1 ring-cyan-400/40" />
                  </div>
                  <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shadow-inner">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-800/60" />
                  </div>
                </div>
              </div>

              <div className="pt-1 pr-1 text-[8px] font-bold tracking-widest text-[#231F20]/40 uppercase">
                DIVINE'S
              </div>
            </div>

            {/* Pattern Rendering */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
              {designPattern === 'pearl_bracelet' && (
                <div className="relative w-full flex flex-col items-center">
                  <svg className="w-36 h-32 overflow-visible" viewBox="0 0 120 100">
                    <path
                      d="M 15 20 C 35 90, 85 90, 105 20"
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeDasharray="1 1"
                    />
                    {[
                      [15, 20], [22, 38], [32, 56], [46, 72], [60, 78],
                      [74, 72], [88, 56], [98, 38], [105, 20]
                    ].map(([cx, cy], i) => (
                      <g key={i}>
                        <circle cx={cx} cy={cy} r="6.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                        <circle cx={cx - 1.5} cy={cy - 1.5} r="2.5" fill="#FFF8F4" opacity="0.9" />
                      </g>
                    ))}
                  </svg>
                  <span className="text-[11px] font-medium text-[#881337] tracking-wide mt-1 bg-white/80 px-2 py-0.5 rounded-full shadow-xs">
                    Freshwater Pearls
                  </span>
                </div>
              )}

              {designPattern === 'zipper_wallet' && (
                <div className="relative w-full max-w-[150px] bg-white/90 rounded-2xl p-2.5 shadow-md border border-[#881337]/30 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between border-b border-dashed border-slate-300 pb-1.5">
                    <span className="text-[9px] font-semibold text-slate-700">Zipper Wallet</span>
                    <div className="w-3.5 h-3.5 bg-amber-400 rounded-sm flex items-center justify-center text-[7px] text-white font-bold">
                      ZIP
                    </div>
                  </div>
                  <div className="h-16 rounded-lg bg-pink-50/80 border border-pink-200/60 flex items-center justify-center">
                    <span className="text-[9px] text-pink-900 font-medium">Holds 4 Cards & Cash</span>
                  </div>
                </div>
              )}

              {designPattern === 'chrome_mirror' && (
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-slate-300 via-white to-slate-200 border-4 border-slate-100 shadow-lg flex flex-col items-center justify-center overflow-hidden">
                  <Sparkles className="w-5 h-5 text-rose-500 mb-1" />
                  <span className="text-[9px] font-bold text-slate-800 tracking-wider uppercase">
                    Vanity Mirror
                  </span>
                </div>
              )}
            </div>

            {/* Live Name Calligraphy Overlay */}
            <div className="relative z-10 pb-4 pt-1 px-3 text-center">
              {customText && customText.trim().length > 0 ? (
                <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xs rounded-xl py-1 px-2 border border-white/50 shadow-xs inline-block max-w-full">
                  <p className="font-script text-lg sm:text-xl text-[#881337] leading-none drop-shadow-sm truncate">
                    {customText}
                  </p>
                  <span className="text-[8px] tracking-wider uppercase text-slate-500 font-semibold block">
                    ✦ Custom Inscription
                  </span>
                </div>
              ) : (
                <div className="opacity-70">
                  <p className="font-serif italic text-xs text-slate-700 dark:text-slate-200 truncate">
                    {name.split(' ').slice(0, 3).join(' ')}
                  </p>
                  <p className="text-[8px] tracking-widest uppercase text-slate-500">Divine Atelier</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
