import React from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, Clock, User, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

const HISTORY = [
  { id: 1, type: 'inbound', number: '+1 (555) 0123', name: 'James Carter', duration: '4:12', result: 'Booking Success', time: '12 mins ago' },
  { id: 2, type: 'outbound', number: '+1 (415) 9021', name: 'Unknown Lead', duration: '0:45', result: 'No Interest', time: '1 hour ago' },
  { id: 3, type: 'inbound', number: '+1 (202) 8871', name: 'Robert Wilson', duration: '2:30', result: 'Questions Handled', time: '3 hours ago' },
  { id: 4, type: 'outbound', number: '+1 (310) 4423', name: 'Sarah Chen', duration: '8:55', result: 'Follow-up Scheduled', time: 'Yesterday' },
];

export default function CallHistoryPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Call History</h1>
        <p className="text-slate-400">Review, listen, and analyze every AI conversation.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {HISTORY.map((call) => (
            <div key={call.id} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl group hover:border-cyan-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-xl",
                    call.type === 'inbound' ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                  )}>
                    {call.type === 'inbound' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{call.number}</h4>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <User size={12} /> {call.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block mb-1">{call.time}</span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs justify-end">
                    <Clock size={12} /> {call.duration}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="flex-1 px-4 py-3 bg-slate-950/50 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Outcome:</span>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{call.result}</span>
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-xs font-bold transition-all border border-white/5">
                   <Phone size={14} fill="white" /> Listen Recording
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-white mb-6">Volume Analytics</h3>
            <div className="space-y-6">
              {[
                { label: 'Total Duration', value: '42.5 hrs', trend: '+12%' },
                { label: 'Avg Call Length', value: '3m 12s', trend: '-2%' },
                { label: 'Peak Hour', value: '14:00 EST', trend: 'Static' },
                { label: 'Sentiment Score', value: '8.4/10', trend: '+5%' },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full mb-1",
                    stat.trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  )}>
                    {stat.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/20 p-6 rounded-3xl relative overflow-hidden">
             <div className="relative z-10">
               <h4 className="text-white font-bold mb-2">Automated Transcripts</h4>
               <p className="text-slate-400 text-xs mb-4">Every call is transcribed and analyzed for sentiment by our Whisper-v3 engine.</p>
               <button className="w-full py-2.5 bg-cyan-500 text-slate-950 rounded-xl font-bold text-xs">Enable Auto-Sync to CRM</button>
             </div>
             <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan-400/10 blur-2xl rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
