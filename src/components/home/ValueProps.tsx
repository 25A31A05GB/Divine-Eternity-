import React from 'react';
import {
  Sparkles,
  Truck,
  MessageSquare,
  Gift,
  ShieldCheck,
  Heart,
  Award,
} from 'lucide-react';
import { useMediaCMS } from '../../context/MediaCMSContext';

const ICON_MAP = {
  Sparkles,
  Truck,
  MessageSquare,
  Gift,
  ShieldCheck,
  Heart,
  Award,
};

export const ValueProps: React.FC = () => {
  const { valueProps } = useMediaCMS();
  const activeProps = valueProps.filter((p) => p.isActive !== false);

  if (activeProps.length === 0) return null;

  return (
    <section className="bg-[#FFD94A] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Banner Strip */}
        <div className="text-center">
          <p className="font-serif-heading text-lg sm:text-2xl text-[#211D1C]">
            <span className="text-[#FF2E93] mr-2">✦</span>
            Not just a gift.{' '}
            <span className="font-serif italic text-[#FF2E93]">
              A timeless memory for moments that mean everything.
            </span>{' '}
            <span className="text-[#FF2E93] ml-1">♡</span>
          </p>
        </div>

        {/* Dynamic Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeProps.map((item) => {
            const IconComponent = ICON_MAP[item.icon] || Sparkles;

            return (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl shadow-xs border border-white/60 flex flex-col items-center text-center space-y-3 relative group hover:shadow-md transition-shadow"
              >
                {/* Icon in pale yellow container */}
                <div className="w-12 h-12 rounded-xl bg-[#FFF9DE] border border-[#F5E6B8] flex items-center justify-center text-[#FF2E93] shadow-2xs">
                  <IconComponent className="w-6 h-6" />
                </div>
                
                {item.highlightBadge && (
                  <span className="bg-[#FFF0F5] text-[#FF2E93] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                    {item.highlightBadge}
                  </span>
                )}

                <h3 className="font-bold text-base text-[#211D1C]">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
