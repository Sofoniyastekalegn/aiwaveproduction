import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, User, Zap, Globe } from 'lucide-react';

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-24 relative overflow-hidden bg-[#05070a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="badge-cyan"
          >
            How it Works
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            The Future of <span className="text-gradient">Agency Scale</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Watch a 2-minute overview of how AIWave is helping 500+ agencies automate their client's operations using next-gen voice intelligence.
          </motion.p>
        </div>

        {/* Video Player Frame */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto group"
        >
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-2 rounded-[32px] shadow-[0_0_50px_rgba(34,211,238,0.1)] relative overflow-hidden">
            {/* Aspect Ratio Box */}
            <div className="aspect-video relative rounded-[28px] overflow-hidden bg-slate-950">
              {/* Thumbnail Placeholder */}
              <img 
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2000" 
                alt="AI Video Introduction" 
                className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="relative group/play"
                >
                  <div className="absolute inset-0 bg-cyan-400 rounded-full blur-2xl opacity-20 group-hover/play:opacity-40 transition-opacity animate-pulse"></div>
                  <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover/play:scale-110 transition-transform">
                    <Play className="text-slate-950 w-8 h-8 md:w-10 md:h-10 ml-1 fill-slate-950" />
                  </div>
                </button>
              </div>

              {/* Founder Tag */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3 glass p-3 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center border border-white/10 overflow-hidden">
                  <User className="text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Founder's Note</p>
                  <p className="text-[10px] text-slate-400">Sofoniyas Tekalegn, CEO @ AIWave</p>
                </div>
              </div>

              {/* Dynamic Stats Tag */}
              <div className="absolute top-6 right-6 flex items-center gap-2 glass p-2 px-3 rounded-full border border-white/5 text-[10px] font-bold text-cyan-400 uppercase tracking-widest leading-none">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
                Live Overview
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Highlights beneath video */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto border-t border-slate-800/50 pt-12">
            {[
              { label: 'Latency', value: '< 200ms', icon: <Zap size={18} className="text-cyan-400" /> },
              { label: 'Voice Clarity', value: 'Ultra HD', icon: <Globe size={18} className="text-blue-400" /> },
              { label: 'Uptime', value: '99.99%', icon: <Zap size={18} className="text-emerald-400" /> },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-2">
                <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">{stat.icon}</div>
                <div>
                  <p className="text-white font-bold">{stat.value}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-600 tracking-widest">{stat.label}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="AIWave Introduction Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
              <button 
                onClick={() => setIsPlaying(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center border border-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Accents */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-cyan-500/5 blur-[120px] rounded-full -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/5 blur-[150px] rounded-full translate-x-1/3"></div>
    </section>
  );
}
