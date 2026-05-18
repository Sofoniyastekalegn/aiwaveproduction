import React from 'react';
import { Target, Send, Users, Activity, BarChart3, ArrowRight, Zap, Megaphone } from 'lucide-react';
import { cn } from '../../lib/utils';

const CAMPAIGNS = [
  { id: 1, name: 'Q4 Dental Outreach', status: 'Active', leads: 450, reached: 320, conv: '12%', progress: 71 },
  { id: 2, name: 'Re-activation Promo', status: 'Draft', leads: 1200, reached: 0, conv: '0%', progress: 0 },
  { id: 3, name: 'High-Ticket Qualifier', status: 'Active', leads: 85, reached: 82, conv: '24%', progress: 96 },
];

export default function CampaignsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">AI Campaigns</h1>
          <p className="text-slate-400">Deploy agents to specific lead lists for massive scale.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Megaphone size={18} /> Launch Campaign
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: 'Live Prospects', value: '1,402', icon: <Users className="text-cyan-400" /> },
          { label: 'Avg Conversion', value: '18.4%', icon: <Target className="text-blue-400" /> },
          { label: 'Active Spikes', value: '12/hr', icon: <Activity className="text-emerald-400" /> },
        ].map((card, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-800 rounded-lg">{card.icon}</div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{card.label}</span>
             </div>
             <p className="text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {CAMPAIGNS.map((camp) => (
          <div key={camp.id} className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl group hover:border-cyan-500/30 transition-all">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white">{camp.name}</h3>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight",
                    camp.status === 'Active' ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
                  )}>{camp.status}</span>
                </div>
                <p className="text-slate-500 text-sm">Targeting <span className="text-slate-300 font-bold">{camp.leads}</span> verified leads</p>
              </div>

              <div className="flex-1 max-w-md space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Campaign Progress</span>
                  <span className="text-white font-bold">{camp.progress}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${camp.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-12 text-center">
                 <div>
                   <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Reached</p>
                   <p className="text-xl font-bold text-white">{camp.reached}</p>
                 </div>
                 <div>
                   <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Conversion</p>
                   <p className="text-xl font-bold text-emerald-400">{camp.conv}</p>
                 </div>
                 <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors self-center">
                    <ArrowRight size={20} className="text-white" />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
