import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Phone, ArrowRight, Play, Star, ChevronRight, Zap, Workflow } from 'lucide-react';
import VoiceAgentInterface from './VoiceAgentInterface';

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full animate-pulse delay-700"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff05 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-10 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-xs font-bold text-cyan-400 uppercase tracking-widest"
          >
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></div>
            Now in Private Beta
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.9] max-w-5xl mx-auto"
          >
            Scale your Agency <br />
            <span className="text-gradient">With AI Workforce.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Deploy enterprise-grade AI Voice agents that handle bookings, qualify leads, and update your CRM—all while you sleep.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button onClick={onStart} className="btn-primary px-10 py-5 text-xl flex items-center gap-3 w-full sm:w-auto shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              Build Your First Agent <ArrowRight size={24} />
            </button>
            <button className="px-10 py-5 bg-slate-900 border border-slate-800 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-3 w-full sm:w-auto">
              <Play size={20} fill="white" /> Watch Product Tour
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-12 pt-8"
          >
            <div className="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
               <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                  <Workflow size={20} className="text-[#FF6C37]" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Native n8n</span>
            </div>
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex gap-0.5 text-amber-400 mb-1">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-xs font-bold text-white">Loved by 500+ Agency Founders</p>
            </div>
          </motion.div>
        </div>

        {/* Dashboard & Voice Agent Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
          className="relative max-w-7xl mx-auto"
        >
          <div className="grid lg:grid-cols-12 gap-8 items-center bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-2 lg:p-6 rounded-[48px] shadow-[0_0_100px_rgba(34,211,238,0.1)]">
            
            {/* Left: Voice Agent Try-It Interface */}
            <div className="lg:col-span-4 order-2 lg:order-1 h-[530px]">
               <div className="h-full flex flex-col">
                  <div className="mb-4 flex items-center justify-between px-2">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[9px] font-black text-white uppercase tracking-[0.25em]">Live AI Receptionist Demo</span>
                     </div>
                     <span className="text-[9px] font-bold text-slate-500">v2.4.L</span>
                  </div>
                  <VoiceAgentInterface className="flex-1" initialIndustry="barber" />
                  
                  <div className="mt-6 flex flex-col gap-3">
                     <div className="flex items-center gap-3 p-4 bg-slate-900 shadow-inner border border-white/5 rounded-2xl">
                        <Phone size={14} className="text-cyan-400" />
                        <div className="flex-1">
                           <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Direct Twilio Fallback</p>
                           <p className="text-xs font-bold text-white">+1 (978) 643-5828</p>
                        </div>
                        <div className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded-md border border-emerald-500/20">
                           Online
                        </div>
                     </div>
                     <p className="text-[9px] text-slate-600 text-center font-medium italic">
                        Try booking a sample slot. The agent will collect your name & email.
                     </p>
                  </div>
               </div>
            </div>

            {/* Right: Dashboard Mock Interface */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <div className="aspect-[16/10] bg-[#020617] rounded-[30px] border border-slate-800 overflow-hidden relative group">
                {/* Mock Dashboard UI Overlay */}
                <div className="absolute inset-x-0 top-0 h-16 border-b border-white/5 bg-slate-900/50 flex items-center px-8 gap-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                  <div className="flex-1"></div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/5"></div>
                </div>
                <div className="absolute top-24 left-10 w-64 space-y-6">
                  <div className="h-10 bg-slate-900 border border-white/5 rounded-xl animate-pulse"></div>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-8 bg-slate-900 border border-white/5 rounded-lg opacity-40 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
                  ))}
                </div>
                <div className="absolute top-24 left-[340px] right-10 bottom-10 grid grid-cols-2 gap-8">
                  <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-[32px] p-8 flex flex-col justify-center items-center gap-4 group-hover:bg-cyan-500/10 transition-colors">
                    <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center text-slate-950">
                      <Zap size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">4,284</p>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Calls Handled</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8 flex flex-col justify-center">
                    <div className="space-y-4">
                      {[70, 45, 90].map((w, i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-700 animate-pulse" style={{ width: `${w}%`, animationDelay: `${i * 300}ms` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-transparent z-10 pointer-events-none flex items-end justify-center pb-20">
                  <button onClick={onStart} className="px-8 py-3 bg-white text-slate-950 font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform shadow-2xl pointer-events-auto">
                    Explore Live Interface <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
