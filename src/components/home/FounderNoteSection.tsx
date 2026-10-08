import React from 'react';
import { Sparkles, Award, ArrowRight, Users } from 'lucide-react';
import { useMediaCMS } from '../../context/MediaCMSContext';

interface FounderNoteSectionProps {
  onExploreProducts?: () => void;
  onJoinCreatorClub?: () => void;
}

export const FounderNoteSection: React.FC<FounderNoteSectionProps> = ({
  onExploreProducts,
  onJoinCreatorClub,
}) => {
  const { founderData } = useMediaCMS();

  if (founderData?.isVisible === false) {
    return null;
  }

  const name = founderData?.name || 'Sonu';
  const role = founderData?.role || 'Founder — Divine’s Eternity';
  const badge1 = founderData?.badge1 || '20-Year-Old Founder';
  const badge2 = founderData?.badge2 || 'Educator & Creator';
  const rawImageUrl = founderData?.imageUrl;
  const defaultFounderImage = '/images/founder/founder_sonu_real_1791375717528.jpg';
  const imageUrl = (rawImageUrl && !rawImageUrl.startsWith('/src/assets'))
    ? rawImageUrl
    : defaultFounderImage;
  const establishedDate = founderData?.establishedDate || 'EST. AUG 31';
  const dreamAge = founderData?.dreamAge || 'Dreamed at Age 16';
  const launchDate = founderData?.launchDate || 'August 31st';
  const introText = founderData?.introText || 'Myself Sonu, a 20-year-old proud young founder, content creator, educator, and entrepreneur.';
  const storyNote = founderData?.storyNote;
  const highlightQuote = founderData?.highlightQuote || 'What started as a dream at 16 is now a reality I get to live every single day with Divine’s Eternity.';
  const signatureText = founderData?.signatureText || 'With gratitude & love, Sonu';
  const ctaPrimaryText = founderData?.ctaPrimaryText || 'Explore Handcrafted Gifts';
  const ctaSecondaryText = founderData?.ctaSecondaryText || 'Join Creator Club';

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-[#FFFDF8] via-[#FFF9EB] to-[#FFF0F5] border-y border-[#F3E8E2] relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF2E93]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFD94A]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Pill Badge */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#F3E8E2] text-xs font-extrabold uppercase tracking-widest text-[#FF2E93] shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
            <span>FOUNDER’S STORY</span>
            <span className="text-stone-300">•</span>
            <span className="text-[#211D1C]">{establishedDate}</span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
            A Note From <span className="font-serif italic text-[#FF2E93]">Founder</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-lg mx-auto">
            {highlightQuote}
          </p>
        </div>

        {/* Main Founder Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Founder Photo Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md">
              {/* Gold Ring Frame */}
              <div className="relative rounded-3xl overflow-hidden p-2.5 bg-gradient-to-b from-[#FFD94A] via-[#FF2E93] to-[#211D1C] shadow-2xl">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-stone-900 relative group">
                  <img
                    src={imageUrl}
                    alt={`${name} — ${role}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = defaultFounderImage;
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FF2E93] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                          {badge1}
                        </span>
                        <span className="bg-[#FFD94A] text-[#211D1C] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                          {badge2}
                        </span>
                      </div>
                      <h3 className="font-serif-heading text-2xl font-bold text-white">
                        {name}
                      </h3>
                      <p className="text-xs text-stone-300">
                        {role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Milestone Badges */}
              <div className="absolute -top-4 -left-4 bg-white border border-[#F3E8E2] rounded-2xl p-3 shadow-lg flex items-center gap-2.5 z-20">
                <div className="w-8 h-8 rounded-full bg-[#FFF0F5] text-[#FF2E93] flex items-center justify-center font-bold text-xs">
                  16
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">{dreamAge}</span>
                  <span className="text-xs font-extrabold text-[#211D1C]">Vision Sparked</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white border border-[#F3E8E2] rounded-2xl p-3 shadow-lg flex items-center gap-2.5 z-20">
                <div className="w-8 h-8 rounded-full bg-[#FFF9EB] text-[#FFD94A] flex items-center justify-center font-bold text-xs">
                  ★
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Launched</span>
                  <span className="text-xs font-extrabold text-[#211D1C]">{launchDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sonu's Letter */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-[#F3E8E2] shadow-xl space-y-6 relative">
              <div className="text-5xl font-serif text-[#FF2E93]/20 absolute top-4 right-6 select-none">
                “
              </div>

              <div className="space-y-3">
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#FFD94A]" />
                  <span>A PERSONAL MESSAGE FROM SONU</span>
                </p>
                <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#211D1C]">
                  {introText}
                </h3>
              </div>

              {/* Letter Paragraphs */}
              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed max-h-96 overflow-y-auto pr-2">
                {storyNote?.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-stone-700">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Sonu Signature Row */}
              <div className="pt-4 border-t border-[#F3E8E2] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-serif italic font-bold text-xl text-[#FF2E93]">
                    {signatureText}
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">
                    Content Creator • Educator • Founder, Divine’s Eternity
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {onExploreProducts && (
                    <button
                      onClick={onExploreProducts}
                      className="px-4 py-2 rounded-xl bg-[#211D1C] hover:bg-[#FF2E93] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <span>{ctaPrimaryText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onJoinCreatorClub && (
                    <button
                      onClick={onJoinCreatorClub}
                      className="px-4 py-2 rounded-xl bg-[#FFF0F5] hover:bg-[#FFE0E6] text-[#FF2E93] border border-[#FF2E93]/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{ctaSecondaryText}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
