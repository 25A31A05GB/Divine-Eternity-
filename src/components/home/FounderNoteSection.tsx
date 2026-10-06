import React from 'react';
import { Heart, Sparkles, Award, Star, ArrowRight, Instagram, Users } from 'lucide-react';

interface FounderNoteSectionProps {
  onExploreProducts?: () => void;
  onJoinCreatorClub?: () => void;
}

export const FounderNoteSection: React.FC<FounderNoteSectionProps> = ({
  onExploreProducts,
  onJoinCreatorClub,
}) => {
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
            <span className="text-[#211D1C]">EST. AUG 31</span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
            A Note From <span className="font-serif italic text-[#FF2E93]">Founder</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-lg mx-auto">
            What started as a dream at 16 is now a reality lived every single day.
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
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                    alt="Sonu — Founder of Divine’s Eternity"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      // Fallback image if unsplash URL fails
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FF2E93] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                          20-Year-Old Founder
                        </span>
                        <span className="bg-[#FFD94A] text-[#211D1C] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                          Educator & Creator
                        </span>
                      </div>
                      <h3 className="font-serif-heading text-2xl font-bold text-white">
                        Sonu
                      </h3>
                      <p className="text-xs text-stone-300">
                        Founder — Divine’s Eternity
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
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Dream Seeded</span>
                  <span className="text-xs font-bold text-[#211D1C]">Dreamed at Age 16</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white border border-[#F3E8E2] rounded-2xl p-3 shadow-lg flex items-center gap-2.5 z-20">
                <div className="w-8 h-8 rounded-full bg-[#FFF9EB] text-[#D97706] flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Official Launch</span>
                  <span className="text-xs font-bold text-[#211D1C]">August 31st</span>
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
              <p className="font-bold text-stone-900 text-sm sm:text-base">
                Myself <span className="text-[#FF2E93]">Sonu</span>, a 20-year-old proud young founder, content creator, educator, and entrepreneur.
              </p>

              <p>
                <strong>Divine’s Eternity</strong> is more than just a brand to me — it is a dream I carried with me since I was 16 years old. After completing my 12th, I finally decided to take that dream seriously and started working towards building something of my own.
              </p>

              <p>
                On <strong className="text-[#211D1C] underline decoration-[#FFD94A] decoration-2">August 31st</strong>, I officially started Divine’s Eternity, and that day will always remain one of the best days of my life. Today, after one and a half years of building this journey, seeing how far we have come feels like a true dream come true.
              </p>

              <p className="bg-[#FFF9EB] border-l-4 border-[#FF2E93] p-3.5 rounded-r-2xl italic text-stone-800">
                The journey hasn't always been easy. I have faced failures, difficult phases, setbacks, and moments when giving up felt easier. But I never gave up on my passion or the vision I had for myself.
              </p>

              <p>
                Today, I proudly stand as a full-time content creator, educator, and entrepreneur, while continuing to grow Divine’s Eternity with the same passion with which it began.
              </p>

              <p>
                My vision goes beyond just building a successful brand. <strong className="text-[#211D1C]">I want to create opportunities and encourage women and students to become financially independent, confident, and capable of building something of their own.</strong>
              </p>

              <p>
                Divine’s Eternity is my little world of creativity, dreams, gifts, opportunities, and growth. Every order, every creator who joins us, every collaboration, and every person who supports us becomes a part of this journey.
              </p>

              <p className="font-serif-heading text-base sm:text-lg font-bold text-[#211D1C]">
                What started as a dream at 16 is now a reality I get to live every day.
              </p>

              <div className="bg-[#FFF0F5] border border-pink-200 rounded-2xl p-4 text-center space-y-1 my-2">
                <p className="font-bold text-[#211D1C] text-sm sm:text-base">
                  This is not just my brand.
                </p>
                <p className="font-serif italic text-[#FF2E93] font-bold text-base sm:text-lg">
                  This is my dream, my journey, and my Divine’s Eternity. ❤️
                </p>
              </div>
            </div>

            {/* Founder Signature */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-stone-400 block font-serif italic">With love,</span>
                <span className="font-serif-heading text-2xl font-bold text-[#211D1C]">Sonu</span>
                <span className="text-xs text-[#FF2E93] font-bold block">Founder — Divine’s Eternity</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {onExploreProducts && (
                  <button
                    onClick={onExploreProducts}
                    className="px-5 py-2.5 rounded-full bg-[#211D1C] hover:bg-[#FF2E93] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Explore Sonu’s Creations</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {onJoinCreatorClub && (
                  <button
                    onClick={onJoinCreatorClub}
                    className="px-5 py-2.5 rounded-full bg-[#FFF0F5] hover:bg-[#FF2E93] text-[#FF2E93] hover:text-white border border-[#FF2E93]/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Join Creator Club</span>
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
