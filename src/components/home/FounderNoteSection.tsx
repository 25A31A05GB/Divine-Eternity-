import React from 'react';
import { Heart, Sparkles, Award, Star, ArrowRight, Instagram, Users } from 'lucide-react';
import { useMediaCMS } from '../../context/MediaCMSContext';

interface FounderNoteSectionProps {
  onExploreProducts?: () => void;
  onJoinCreatorClub?: () => void;
}

export const FounderNoteSection: React.FC<FounderNoteSectionProps> = ({
  onExploreProducts,
  onJoinCreatorClub,
}) => {
  const { founderNote } = useMediaCMS();

  if (founderNote.isActive === false) return null;

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
            <span>{founderNote.badge || 'FOUNDER’S STORY • EST. AUG 31'}</span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
            {founderNote.title || 'A Note From'}{' '}
            <span className="font-serif italic text-[#FF2E93]">
              {founderNote.accentTitle || 'Founder'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-lg mx-auto">
            {founderNote.subtitle || 'What started as a dream at 16 is now a reality lived every single day.'}
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
                    src={founderNote.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                    alt={`${founderNote.founderName || 'Sonu'} — Founder of Divine’s Eternity`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FF2E93] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                          Young Founder
                        </span>
                        <span className="bg-[#FFD94A] text-[#211D1C] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                          Creator & Artisan
                        </span>
                      </div>
                      <h3 className="font-serif-heading text-2xl font-bold text-white">
                        {founderNote.founderName || 'Sonu'}
                      </h3>
                      <p className="text-xs text-stone-300">
                        {founderNote.founderRole || 'Founder — Divine’s Eternity'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Milestone Badges */}
              <div className="absolute -top-4 -left-4 bg-white border border-[#F3E8E2] rounded-2xl p-3 shadow-lg flex items-center gap-2.5 z-20">
                <div className="w-8 h-8 rounded-full bg-[#FFF0F5] text-[#FF2E93] flex items-center justify-center font-bold text-xs">
                  DE
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Atelier Craft</span>
                  <span className="text-xs font-bold text-[#211D1C]">Divine’s Eternity</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white border border-[#F3E8E2] rounded-2xl p-3 shadow-lg flex items-center gap-2.5 z-20">
                <div className="w-8 h-8 rounded-full bg-[#FFF9EB] text-[#D97706] flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Rating</span>
                  <span className="text-xs font-bold text-[#211D1C]">4.95 / 5 ★</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Founder's Personal Letter / Note */}
          <div className="lg:col-span-7 bg-white/90 backdrop-blur-md border border-[#F3E8E2] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 relative">
            <div className="text-5xl font-serif text-[#FF2E93]/20 absolute top-4 right-6 pointer-events-none select-none">
              “
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
              {founderNote.quote && (
                <p className="font-bold text-stone-900 text-sm sm:text-base border-l-4 border-[#FF2E93] pl-3 py-1 bg-[#FFF9EB] rounded-r-xl">
                  {founderNote.quote}
                </p>
              )}

              {founderNote.paragraphs && founderNote.paragraphs.length > 0 ? (
                founderNote.paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
              ) : (
                <>
                  <p>
                    Myself <span className="text-[#FF2E93]">Sonu</span>, a proud young founder, content creator, educator, and entrepreneur.
                  </p>
                  <p>
                    <strong>Divine’s Eternity</strong> is more than just a brand to me — it is a dream I carried with me since I was 16 years old.
                  </p>
                  <p>
                    Divine’s Eternity is my little world of creativity, dreams, gifts, opportunities, and growth. Every order becomes a part of this journey.
                  </p>
                </>
              )}
            </div>

            {/* Founder Signature & Direct Buttons */}
            <div className="pt-6 border-t border-[#F3E8E2] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-serif italic text-2xl sm:text-3xl text-[#FF2E93] block">
                  ~ {founderNote.signature || founderNote.founderName || 'Sonu'}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {founderNote.founderRole || 'Founder — Divine’s Eternity'}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onExploreProducts}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-[#211D1C] hover:bg-[#FF2E93] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>{founderNote.primaryCtaText || 'Explore Handcrafted Gifts'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {onJoinCreatorClub && (
                  <button
                    onClick={onJoinCreatorClub}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-[#FFF0F5] hover:bg-[#FFE0E6] text-[#FF2E93] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#FF2E93]/30 transition-colors cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{founderNote.secondaryCtaText || 'Creator Club'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
