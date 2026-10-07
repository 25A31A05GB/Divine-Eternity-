import React from 'react';
import { useMediaCMS } from '../../context/MediaCMSContext';
import { Sparkles, Truck, MessageSquare, Gift, ShieldCheck, Heart } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Sparkles: Sparkles,
  Truck: Truck,
  MessageSquare: MessageSquare,
  Gift: Gift,
  ShieldCheck: ShieldCheck,
  Heart: Heart,
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
              A forever memory handcrafted with love.
            </span>{' '}
            <span className="text-[#FF2E93] ml-1">♡</span>
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeProps.map((item) => {
            const Icon = ICON_MAP[item.iconName] || Sparkles;
            return (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl shadow-xs border border-white/60 flex flex-col items-center text-center space-y-3 transition-transform hover:-translate-y-1"
              >
                {/* Icon in pale yellow container */}
                <div className="w-12 h-12 rounded-xl bg-[#FFF9DE] border border-[#F5E6B8] flex items-center justify-center text-[#FF2E93] text-xl font-bold shadow-2xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[#211D1C]">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {item.subtitle}
                </p>
                {item.badge && (
                  <span className="text-[10px] font-bold text-[#FF2E93] bg-[#FFF0F5] px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
