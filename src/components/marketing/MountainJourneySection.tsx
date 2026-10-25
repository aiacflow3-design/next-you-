import React, { useRef } from 'react';
import { ArrowLeft, Flag } from 'lucide-react';
import mountainRidgeImage from '../../assets/images/next_you_mountain_ridge_1790363911162.jpg';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useScrollParallax } from '../../lib/scrollController';

interface MountainJourneySectionProps {
  onOpenAssessment: () => void;
}

export const MountainJourneySection: React.FC<MountainJourneySectionProps> = ({
  onOpenAssessment,
}) => {
  const sectionRef = useScrollReveal();
  const imgRef = useRef<HTMLImageElement>(null);

  // Zero-rerender parallax: updates DOM style.transform directly on the element ref
  useScrollParallax(
    imgRef,
    (y) => `translate3d(0, ${Math.min(Math.max((y - 1200) * 0.08, -30), 40)}px, 0)`
  );

  const waypoints = [
    {
      id: 1,
      title: 'شناخت خود',
      desc: 'درک بهتر از شخصیت، عادت‌ها و ارزش‌ها',
      position: 'bottom-[12%] right-[10%] sm:right-[15%]',
      delay: 'delay-100',
    },
    {
      id: 2,
      title: 'ساخت پایه‌ها',
      desc: 'نظم، تمرکز و عادت‌های سازنده',
      position: 'bottom-[35%] right-[32%] sm:right-[38%]',
      delay: 'delay-200',
    },
    {
      id: 3,
      title: 'رشد شخصیت',
      desc: 'اعتماد به نفس، ارتباطات، ذهنیت',
      position: 'bottom-[56%] right-[55%] sm:right-[60%]',
      delay: 'delay-300',
    },
    {
      id: 4,
      title: 'رسیدن به اهداف',
      desc: 'همگامی، عملکرد بهتر و پیشرفت مستمر',
      position: 'top-[15%] right-[76%] sm:right-[80%]',
      isSummit: true,
      delay: 'delay-500',
    },
  ];

  return (
    <section id="journey" className="py-14 sm:py-16 md:py-20 relative overflow-hidden">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-5 sm:px-8 reveal-on-scroll">
        
        {/* Cinematic Mountain Landscape Container with Crimson Trail */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_16px_70px_rgba(0,0,0,0.95)] min-h-[500px] sm:min-h-[580px] flex flex-col justify-between p-6 sm:p-8 md:p-10">
          
          {/* Background Mountain Photography (Direct DOM transform, no transition delay) */}
          <img
            ref={imgRef}
            src={mountainRidgeImage}
            alt="NEXTYOU Mountain Journey"
            className="absolute inset-0 w-full h-[115%] -top-[7%] object-cover object-[center_40%]"
            loading="lazy"
          />

          {/* Moody Vignette Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/35 to-transparent pointer-events-none" />

          {/* SVG Animated Crimson Ridge Trail (Progressive flow with lightweight GPU stroke glow) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
          >
            {/* Soft Ambient Glow Path (No CPU-costly filter="blur") */}
            <path
              d="M 850 520 Q 650 420 580 370 T 380 260 Q 280 180 200 110"
              fill="none"
              stroke="#B5122B"
              strokeWidth="7"
              strokeOpacity="0.16"
            />
            {/* Crisp Core Crimson Path */}
            <path
              d="M 850 520 Q 650 420 580 370 T 380 260 Q 280 180 200 110"
              fill="none"
              stroke="#B5122B"
              strokeWidth="2"
              strokeDasharray="6 6"
              className="animate-route-flow"
            />
          </svg>

          {/* Top/Right Header Content (In RTL: right-aligned) */}
          <div className="relative z-10 max-w-md text-right">
            <span className="text-[11px] font-medium text-[#85878C] tracking-wider block mb-1.5 uppercase">
              مسیر کلی رشد
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#E8E8E6] tracking-tight mb-2.5">
              از شناخت تا رسیدن به اهدافت
            </h2>
            <p className="text-xs sm:text-sm text-[#85878C] leading-relaxed mb-5">
              یک مسیر جامع برای ساختن نسخه بهتر خودت. اما این فقط بخشی از مسیر است...
            </p>
            <button
              onClick={onOpenAssessment}
              className="inline-flex items-center gap-2 text-xs font-medium text-white px-3.5 py-2 rounded-lg btn-secondary-glass cursor-pointer"
            >
              <span>مشاهده مسیر کامل</span>
              <ArrowLeft className="w-3.5 h-3.5 text-[#B5122B]" />
            </button>
          </div>

          {/* Interactive Waypoints along the mountain ridge */}
          {waypoints.map((wp) => (
            <div
              key={wp.id}
              className={`absolute z-10 ${wp.position} flex flex-col items-center group cursor-pointer transition-all duration-500`}
              onClick={onOpenAssessment}
            >
              {/* Waypoint Marker Beacon */}
              <div className="relative flex items-center justify-center">
                <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-[#101113] border-2 border-[#B5122B] flex items-center justify-center shadow-[0_0_14px_#B5122B] group-hover:scale-120 transition-transform duration-300">
                  {wp.isSummit ? (
                    <Flag className="w-2.5 h-2.5 text-[#B5122B]" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                  )}
                </div>
                {/* Slow, restrained breathing aura */}
                <div className="absolute -inset-1 rounded-full border border-[#B5122B]/30 animate-pulse pointer-events-none" />
              </div>

              {/* Waypoint Card with refined dark luxury glass */}
              <div className="mt-2 p-2 sm:p-2.5 rounded-lg luxury-glass group-hover:border-[#B5122B]/40 transition-all text-center min-w-[130px] sm:min-w-[160px] shadow-lg">
                <h4 className="text-xs font-bold text-white mb-0.5">
                  {wp.title}
                </h4>
                <p className="text-[10px] text-[#85878C] line-clamp-1">
                  {wp.desc}
                </p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
