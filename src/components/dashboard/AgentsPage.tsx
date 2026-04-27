import React from 'react';
import { 
  Search, Plus, Filter, Settings2, Activity, MessageSquare, 
  Mic2, Trash2, Edit, MoreVertical, PlayCircle, ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const AGENTS = [
  { id: 1, name: 'Medical Front Desk', status: 'Live', type: 'Voice', industry: 'Healthcare', lastCall: '3 mins ago', callsToday: 42, success: '96%', voices: ['Rachel', 'Nicole'] },
  { id: 2, name: 'Booking Assistant', status: 'Live', type: 'Voice', industry: 'Hospitality', lastCall: '12 mins ago', callsToday: 28, success: '92%', voices: ['Antoni'] },
  { id: 3, name: 'Barber Shop AI', status: 'Live', type: 'Voice', industry: 'Barber Shop', lastCall: '5 mins ago', callsToday: 18, success: '91%', voices: ['Clyde'] },
  { id: 4, name: 'Real Estate Qualifier', status: 'Live', type: 'Voice', industry: 'Real Estate', lastCall: 'Just now', callsToday: 56, success: '98%', voices: ['Rachel'] },
  { id: 5, name: 'Dental Clinic Agent', status: 'Live', type: 'Voice', industry: 'Dental', lastCall: '1 hour ago', callsToday: 31, success: '94%', voices: ['Nicole'] },
  { id: 6, name: 'Salon Receptionist', status: 'Paused', type: 'Chat', industry: 'Beauty', lastCall: '2 hours ago', callsToday: 15, success: '89%', voices: ['-'] },
];

export default function AgentsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Active AI Workforce</h1>
          <p className="text-slate-400">Deploy and manage specialized agents for every business function.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 px-8 py-4">
          <Plus size={20} /> Deploy New Agent
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search your agents..." 
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-cyan-500/50 transition-all shadow-inner" 
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-4 bg-slate-800/40 border border-slate-700 rounded-2xl text-slate-300 hover:bg-slate-800 transition-colors">
          <Filter size={18} />
          <span className="text-sm font-bold uppercase tracking-widest">Filter By Industry</span>
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-4 bg-slate-800/40 border border-slate-700 rounded-2xl text-slate-300 hover:bg-slate-800 transition-colors">
          <Settings2 size={18} />
          <span className="text-sm font-bold uppercase tracking-widest">Global Config</span>
        </button>
      </div>

      {/* Agent Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {AGENTS.map((agent) => (
          <div key={agent.id} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[32px] p-8 group hover:border-cyan-500/50 transition-all duration-300 relative overflow-hidden">
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-cyan-500/20 rounded-[20px] flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)] group-hover:scale-110 transition-transform">
                   {agent.type === 'Voice' ? <Mic2 size={24} /> : <MessageSquare size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg tracking-tight">{agent.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest">
                     {agent.industry} <span className="text-slate-800">•</span> <PlayCircle size={12} className="text-cyan-500" />
                  </div>
                </div>
              </div>
              <span className={cn(
                "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                agent.status === 'Live' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-500 border border-slate-700"
              )}>
                {agent.status}
              </span>
            </div>

            <div className="space-y-6 mb-8 relative z-10">
              <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold uppercase tracking-widest">Knowledge Coverage</span>
                  <span className="text-white font-mono font-bold">{agent.success}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: agent.success }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      parseInt(agent.success) > 90 ? "bg-cyan-500" : "bg-blue-500"
                    )} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/20 rounded-2xl border border-slate-800/50">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Calls (24h)</p>
                  <p className="text-2xl font-black text-white">{agent.callsToday}</p>
                </div>
                <div className="p-4 bg-slate-800/20 rounded-2xl border border-slate-800/50">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Active Voice</p>
                  <p className="text-sm font-bold text-cyan-400 mt-1">{agent.voices[0]}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-slate-800/50 relative z-10">
               <button className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-cyan-600/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all text-xs font-black uppercase tracking-widest border border-cyan-500/20">
                 <Settings2 size={16} /> Configure
               </button>
               <button className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-all">
                  <Trash2 size={18} />
               </button>
            </div>

            {/* Background design elements */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-cyan-500/5 blur-[50px] rounded-full group-hover:bg-cyan-500/10 transition-colors"></div>
          </div>
        ))}
        
        {/* Placeholder for deployment */}
        <button className="border-2 border-dashed border-slate-800 rounded-[32px] p-8 flex flex-col items-center justify-center gap-6 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all min-h-[420px] group">
           <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:scale-110 group-hover:border-cyan-500/50 transition-all shadow-2xl">
             <Plus size={40} className="text-slate-600 group-hover:text-cyan-400" />
           </div>
           <div className="text-center">
             <p className="font-black text-white uppercase tracking-widest">Deploy New Node</p>
             <p className="text-xs text-slate-500 mt-1">Scale your capacity instantly.</p>
           </div>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] flex flex-col lg:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-[28px] border border-emerald-500/20 flex items-center justify-center text-emerald-400">
               <ShieldCheck size={40} />
            </div>
            <div>
               <h3 className="text-xl font-bold text-white">Advanced Safety Safeguards</h3>
               <p className="text-slate-400 text-sm max-w-md mt-1">All agents are secured with PII masking and SOC2-compliant data handling by default.</p>
            </div>
         </div>
         <button className="btn-secondary px-8 py-4 w-full lg:w-auto">Review Security Logs</button>
      </div>
    </div>
  );
}
