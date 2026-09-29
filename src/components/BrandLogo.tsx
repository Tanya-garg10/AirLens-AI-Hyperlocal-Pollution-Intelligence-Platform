import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  tagline?: boolean;
}

export function BrandLogo({
  size = 'md',
  showWordmark = true,
  className = '',
  tagline = false,
}: BrandLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Custom Geometric Logo Icon: Location Pin + Atmospheric Airflow Wave + Environmental Leaf Signal */}
      <div
        className={`relative ${iconSizes[size]} rounded-2xl bg-gradient-to-br from-[#123C30] via-[#0C1513] to-[#071713] border border-[#5CF2B2]/30 p-1.5 shadow-lg shadow-[#071713]/60 group transition-all duration-300 hover:border-[#5CF2B2] hover:shadow-[#5CF2B2]/20 flex items-center justify-center shrink-0`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Subtle Ambient Radial Glow */}
          <circle cx="24" cy="24" r="18" fill="url(#mintGlow)" opacity="0.3" />

          {/* Location Pin Outer Frame */}
          <path
            d="M24 6C16.82 6 11 11.82 11 19C11 28.5 24 41 24 41C24 41 37 28.5 37 19C37 11.82 31.18 6 24 6Z"
            stroke="#5CF2B2"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors group-hover:stroke-[#A6C7B5]"
          />

          {/* Atmospheric Airflow Waves */}
          <path
            d="M17 17C19.5 15 22 19 25 17C27.5 15.5 29.5 16.5 31 18"
            stroke="#5CF2B2"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M16 22C19 20 22 24 25.5 22C28.5 20.5 30 22 32 23"
            stroke="#A6C7B5"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Leaf Contour emerging from pin core */}
          <path
            d="M24 13C24 13 28 15 27 21C26 23.5 24 25 24 25C24 25 22 23.5 21 21C20 15 24 13 24 13Z"
            fill="url(#leafGradient)"
            opacity="0.85"
          />
          <path
            d="M24 15V24"
            stroke="#071713"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          <defs>
            <radialGradient
              id="mintGlow"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(24 24) rotate(90) scale(18)"
            >
              <stop stopColor="#5CF2B2" stopOpacity="0.8" />
              <stop offset="1" stopColor="#5CF2B2" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="leafGradient" x1="21" y1="13" x2="27" y2="25" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5CF2B2" />
              <stop offset="1" stopColor="#123C30" />
            </linearGradient>
          </defs>
        </svg>

        {/* Pulse Dot */}
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#5CF2B2] animate-ping opacity-75" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#5CF2B2]" />
      </div>

      {/* Typography Wordmark */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className={`font-heading font-bold tracking-tight text-[#F4F8F5] flex items-center gap-1.5 ${textSizes[size]}`}>
            <span>AirLens</span>
            <span className="text-[#5CF2B2] font-black tracking-normal px-1 py-0.2 rounded bg-[#123C30]/70 border border-[#5CF2B2]/30 text-[0.75em]">
              AI
            </span>
          </div>
          {tagline && (
            <span className="text-[10px] font-mono tracking-wider text-[#8A9A92] uppercase">
              Atmospheric Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
}
