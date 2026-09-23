import React, { useState } from 'react';

interface IFutureWalletLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'icon' | 'horizontal' | 'stacked';
  showSubtitle?: boolean;
  subtitleText?: string;
  className?: string;
  glow?: boolean;
}

export const IFutureWalletLogo: React.FC<IFutureWalletLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  showSubtitle = false,
  subtitleText = 'Enterprise Command',
  className = '',
  glow = true,
}) => {
  const [imageError, setImageError] = useState(false);

  // Pixel sizing mapping
  const sizeMap = {
    xs: { icon: 22, text: 'text-xs', sub: 'text-[9px]' },
    sm: { icon: 28, text: 'text-sm', sub: 'text-[10px]' },
    md: { icon: 36, text: 'text-base', sub: 'text-[11px]' },
    lg: { icon: 48, text: 'text-lg', sub: 'text-xs' },
    xl: { icon: 64, text: 'text-xl', sub: 'text-xs' },
    '2xl': { icon: 84, text: 'text-2xl', sub: 'text-sm' },
  };

  const dim = sizeMap[size] || sizeMap.md;

  // High-fidelity SVG vector representation matching the uploaded official emblem
  const renderVectorEmblem = () => (
    <svg
      width={dim.icon}
      height={dim.icon}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]"
    >
      <defs>
        {/* Electric blue glow gradient */}
        <linearGradient id="ifwBlueGrad" x1="10" y1="20" x2="110" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="45%" stopColor="#0284c7" />
          <stop offset="85%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        {/* Vibrant Red orbital gradient */}
        <linearGradient id="ifwRedGrad" x1="100" y1="10" x2="20" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff334b" />
          <stop offset="50%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>

        {/* Orbital glow filter */}
        <filter id="ifwGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer subtle glow background circle */}
      <circle cx="60" cy="60" r="54" fill="#0b132b" stroke="#1e293b" strokeWidth="1" opacity="0.6" />

      {/* Main Electric Blue Elliptical Ring (tilted ~ -35 deg) */}
      <g transform="rotate(-32 60 60)">
        <ellipse
          cx="60"
          cy="60"
          rx="44"
          ry="24"
          stroke="url(#ifwBlueGrad)"
          strokeWidth="7.5"
          strokeLinecap="round"
          filter={glow ? 'url(#ifwGlow)' : undefined}
        />
        {/* Upper inner highlight */}
        <path
          d="M 28 50 A 44 24 0 0 1 92 50"
          stroke="#7dd3fc"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.85"
        />
      </g>

      {/* Intersecting Red Orbit (tilted ~ 45 deg) */}
      <g transform="rotate(45 60 60)">
        <ellipse
          cx="60"
          cy="60"
          rx="42"
          ry="21"
          stroke="url(#ifwRedGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>

      {/* Upper Red Satellite Node */}
      <circle cx="58" cy="18" r="6" fill="#ff2a44" filter="url(#ifwGlow)" />
      <circle cx="56.5" cy="16.5" r="2" fill="#ffffff" opacity="0.8" />

      {/* Left Red Satellite Node */}
      <circle cx="20" cy="52" r="5" fill="#ff2a44" filter="url(#ifwGlow)" />
      <circle cx="19" cy="50.5" r="1.5" fill="#ffffff" opacity="0.8" />

      {/* Lower-right Red Satellite Node */}
      <circle cx="94" cy="74" r="5.5" fill="#ff2a44" filter="url(#ifwGlow)" />
      <circle cx="92.5" cy="72.5" r="1.8" fill="#ffffff" opacity="0.8" />

      {/* Inner Central Dynamic Loop Overlay */}
      <path
        d="M 40 45 C 50 30, 75 32, 82 50 C 88 65, 75 85, 60 92 C 45 85, 36 70, 42 52"
        stroke="#38bdf8"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );

  // Image-based emblem with graceful SVG vector fallback
  const renderEmblem = () => {
    if (imageError) {
      return renderVectorEmblem();
    }

    return (
      <div 
        className="relative shrink-0 rounded-xl overflow-hidden shadow-lg border border-cyan-500/30 bg-slate-950 flex items-center justify-center group"
        style={{ width: `${dim.icon}px`, height: `${dim.icon}px` }}
      >
        <img
          src="/logo.png"
          alt="iFutureWallet Logo"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center transform transition-transform duration-300 group-hover:scale-105"
        />
        {glow && (
          <div className="absolute inset-0 ring-1 ring-inset ring-cyan-400/30 rounded-xl pointer-events-none" />
        )}
      </div>
    );
  };

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderEmblem()}</div>;
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center justify-center text-center gap-2 group ${className}`}>
        {renderEmblem()}
        <div>
          <div className={`font-bold tracking-tight text-white ${dim.text} flex items-center justify-center gap-0.5`}>
            <span className="text-cyan-400 font-semibold">i</span>
            <span>Future</span>
            <span className="text-slate-100">Wallet</span>
            <span className="text-[10px] text-cyan-400 font-mono align-super ml-0.5">™</span>
          </div>
          {showSubtitle && (
            <span className={`text-slate-400 font-medium block uppercase tracking-wider ${dim.sub}`}>
              {subtitleText}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default horizontal layout
  return (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      {renderEmblem()}
      <div className="flex flex-col">
        <div className={`font-bold tracking-tight text-slate-100 ${dim.text} leading-none flex items-center`}>
          <span className="text-cyan-400 font-semibold">i</span>
          <span>Future</span>
          <span className="text-white">Wallet</span>
          <span className="text-[10px] text-cyan-400 font-mono ml-0.5">™</span>
        </div>
        {showSubtitle && (
          <span className={`text-cyan-400/90 font-mono uppercase tracking-wider font-semibold mt-1 block ${dim.sub}`}>
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
