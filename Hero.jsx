import React from 'react';

export default function Hero({ imageUrl, title, subtitle }) {
  // Fallback to the new ImgBB Ansar logo if no specific hero image is provided
  const graphicUrl = imageUrl || 'https://i.ibb.co/7d4mTQVT/image.png';

  return (
    <div className="relative w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl bg-emerald-950 border border-emerald-900/50 mt-4 lg:mt-6">
      {/* Premium Cinematic Overlay & Glows */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] rounded-full bg-emerald-500/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between px-8 py-20 sm:px-16 sm:py-28 lg:py-36 gap-16 lg:gap-8">
        
        {/* Left Side: Prominent Text */}
        <div className="w-full lg:w-3/5 flex flex-col items-center lg:items-start text-center lg:text-left">
          <span className="inline-block py-1.5 px-5 rounded-full bg-gradient-to-r from-amber-400/20 to-amber-500/10 text-amber-400 text-sm font-bold tracking-[0.2em] uppercase mb-6 border border-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
            Ansar English School
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-[1.1] tracking-tight">
            {title || "Welcome to Ansar English School"}
          </h1>
          <p className="text-lg sm:text-xl text-emerald-50/80 max-w-2xl font-light leading-relaxed mb-10">
            {subtitle || "Nurturing creative and value-driven citizens in a rapidly changing world."}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <a href="https://www.p4panorama.com/360-virtual-tour/ansar-school/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 font-bold py-4 px-8 rounded-full hover:bg-amber-300 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              360° Virtual Tour
            </a>
          </div>
        </div>

        {/* Right Side: Contained Featured Graphic */}
        <div className="w-full lg:w-2/5 flex justify-center lg:justify-end">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-tr from-emerald-800/40 to-white/10 p-8 rounded-[3rem] border border-white/20 backdrop-blur-2xl shadow-2xl flex items-center justify-center group hover:rotate-2 hover:scale-105 transition-all duration-700 ease-out">
            <img 
              src={graphicUrl} 
              alt="Featured graphic" 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-2xl contrast-125 brightness-105"
              style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  );
}