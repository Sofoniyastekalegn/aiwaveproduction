import React, { useState, useEffect } from 'react';
import { Target, Users, Activity, ArrowRight, Megaphone, Plus, X, Play, Pause } from 'lucide-react';
import { cn } from '../../lib/utils';
import { loadJson, saveJson } from '../../lib/dashboardStorage';

export interface Campaign {
  id: string;
  name: string;
  status: 'Active' | 'Draft' | 'Paused';
  leads: number;
  reached: number;
  conv: string;
  progress: number;
}

const SEED: Campaign[] = [
  { id: '1', name: 'Q4 Dental Outreach', status: 'Active', leads: 450, reached: 320, conv: '12%', progress: 71 },
  { id: '2', name: 'Re-activation Promo', status: 'Draft', leads: 1200, reached: 0, conv: '0%', progress: 0 },
  { id: '3', name: 'High-Ticket Qualifier', status: 'Active', leads: 85, reached: 82, conv: '24%', progress: 96 },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => loadJson('campaigns', SEED));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', leads: 100 });

  useEffect(() => {
    saveJson('campaigns', campaigns);
  }, [campaigns]);

  const launchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const c: Campaign = {
      id: `c-${Date.now()}`,
      name: form.name,
      status: 'Active',
      leads: form.leads,
      reached: 0,
      conv: '0%',
      progress: 0,
    };
    setCampaigns((prev) => [c, ...prev]);
    setForm({ name: '', leads: 100 });
    setShowForm(false);
  };

  const toggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const next = c.status === 'Active' ? 'Paused' : c.status === 'Paused' ? 'Active' : 'Active';
        return { ...c, status: next };
      })
    );
  };

  const runCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const reached = Math.min(c.leads, c.reached + Math.floor(c.leads * 0.15));
        const progress = Math.round((reached / c.leads) * 100);
        const conv = `${Math.min(30, Math.round(progress * 0.2))}%`;
        return { ...c, reached, progress, conv };
      })
    );
  };

  const totalLeads = campaigns.reduce((s, c) => s + c.leads, 0);
  const activeCount = campaigns.filter((c) => c.status === 'Active').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">AI Campaigns</h1>
          <p className="text-slate-400">Deploy agents to lead lists — syncs with Workflows & n8n.</p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Megaphone size={18} /> Launch Campaign
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: 'Live Prospects', value: totalLeads.toLocaleString(), icon: <Users className="text-cyan-400" /> },
          { label: 'Active Campaigns', value: String(activeCount), icon: <Target className="text-blue-400" /> },
          { label: 'Avg Progress', value: `${Math.round(campaigns.reduce((s, c) => s + c.progress, 0) / Math.max(1, campaigns.length))}%`, icon: <Activity className="text-emerald-400" /> },
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
        {campaigns.map((camp) => (
          <div key={camp.id} className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl group hover:border-cyan-500/30 transition-all">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white">{camp.name}</h3>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight',
                    camp.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
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
                  <div className="h-full bg-cyan-500 rounded-full transition-all duration-1000" style={{ width: `${camp.progress}%` }} />
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Reached</p>
                  <p className="text-xl font-bold text-white">{camp.reached}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Conversion</p>
                  <p className="text-xl font-bold text-emerald-400">{camp.conv}</p>
                </div>
                <button type="button" onClick={() => toggleStatus(camp.id)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors" title="Pause / resume">
                  {camp.status === 'Active' ? <Pause size={20} className="text-amber-400" /> : <Play size={20} className="text-emerald-400" />}
                </button>
                <button type="button" onClick={() => runCampaign(camp.id)} className="p-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-full transition-colors" title="Run outreach batch">
                  <ArrowRight size={20} className="text-cyan-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <form className="bg-[#111118] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()} onSubmit={launchCampaign}>
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Launch Campaign</h3>
              <button type="button" onClick={() => setShowForm(false)}><X className="text-zinc-500" size={18} /></button>
            </div>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Campaign name" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white mb-3" />
            <input type="number" min={1} value={form.leads} onChange={(e) => setForm({ ...form, leads: Number(e.target.value) })} placeholder="Lead count" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white mb-4" />
            <button type="submit" className="w-full py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2">
              <Plus size={16} /> Launch
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
