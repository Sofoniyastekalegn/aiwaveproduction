import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { industryPersonas } from '../../services/chatService';
import VoiceAgentInterface from './VoiceAgentInterface';

const VOICES = [
  { id: 'barber', name: 'Barbershop', type: 'Male / Friendly', icon: '💈' },
  { id: 'hotel', name: 'Hotel', type: 'Male / Formal', icon: '🏨' },
  { id: 'realestate', name: 'Real Estate', type: 'Male / Professional', icon: '🏠' },
  { id: 'dental', name: 'Dental Clinic', type: 'Female / Caring', icon: '🦷' },
  { id: 'beauty', name: 'Beauty Salon', type: 'Female / Energetic', icon: '💅' },
  { id: 'fintech', name: 'Fintech', type: 'Neutral / Efficient', icon: '💳' },
  { id: 'universal', name: 'AI Systems', type: 'Neutral / Universal', icon: '🔥' },
];

export default function VoiceDemo() {
  const [activeIndustry, setActiveIndustry] = useState<keyof typeof industryPersonas>('barber');

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full -mr-64 -mt-64"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
             <div className="badge-cyan">AI Intelligence Sandbox</div>
             <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
               Talk to your <br />
               <span className="text-gradient">Future Workforce.</span>
             </h2>
             <p className="text-slate-400 text-lg">
               Select an industry node and chat with our neural agents. They handle logic, scheduling, and PII masking with sub-second latency.
             </p>
             
             <div className="grid grid-cols-2 gap-3">
                {VOICES.map((voice) => (
                  <button 
                    key={voice.id}
                    onClick={() => setActiveIndustry(voice.id as any)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border transition-all group text-left",
                      activeIndustry === voice.id 
                        ? "bg-cyan-500/10 border-cyan-500/30 text-white shadow-[0_0_20px_rgba(34,211,238,0.1)]" 
                        : "bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700 hover:bg-slate-900/60"
                    )}
                  >
                    <div className="text-2xl">{voice.icon}</div>
                    <div className="flex-1">
                       <p className="font-bold text-sm leading-tight">{voice.name}</p>
                       <p className="text-[10px] opacity-60 uppercase font-black tracking-widest mt-0.5">{voice.type}</p>
                    </div>
                    {activeIndustry === voice.id && (
                      <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center text-slate-950">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
             </div>

             <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl border-dashed">
                <div className="flex justify-between items-center mb-2">
                   <div className="flex items-center gap-3">
                      <ShieldCheck className="text-emerald-400" size={18} />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Safety Layer Active</span>
                   </div>
                   <span className="text-[9px] font-bold text-slate-500 uppercase">Powered by ElevenLabs</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Automatic PII masking (Phone numbers, Emails, Names) and HIPAA compliance protocols are running on all interactions.
                </p>
             </div>
          </div>

          <div className="relative">
             <VoiceAgentInterface className="h-[600px]" initialIndustry={activeIndustry} />
             {/* Decorative background glow */}
             <div className="absolute inset-x-0 bottom-0 h-1/2 bg-cyan-500/10 blur-[120px] rounded-full scale-125 z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShieldCheck({ className, size }: { className?: string, size?: number }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size || 24} 
            height={size || 24} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
