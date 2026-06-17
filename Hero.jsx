import React from 'react';

export default function Hero({ imageUrl, title, subtitle }) {
  // Fallback to the new ImgBB Ansar logo if no specific hero image is provided
  const graphicUrl = imageUrl || 'https://i.ibb.co/7d4mTQVT/image.png';

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-6 py-16 sm:px-12 sm:py-24 lg:py-32 gap-12">
        
        {/* Left Side: Prominent Text */}
        <div className="w-full lg:w-3/5 flex flex-col items-center lg:items-start text-center lg:text-left">
          <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold tracking-wider uppercase mb-6 border border-emerald-500/30">
            NABET Accredited School
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
            {title || "Welcome to Ansar English School"}
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-light drop-shadow-md mb-10">
            {subtitle || "Nurturing creative and value-driven citizens in a rapidly changing world."}
          </p>
        </div>

        {/* Right Side: Contained Featured Graphic */}
        <div className="w-full lg:w-2/5 flex justify-center lg:justify-end">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-white/5 p-6 rounded-full border border-white/10 backdrop-blur-md shadow-2xl flex items-center justify-center group hover:border-emerald-500/50 transition-colors duration-500">
            <img 
              src={graphicUrl} 
              alt="Featured graphic" 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  );
}