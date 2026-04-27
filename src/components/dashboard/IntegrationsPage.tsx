import React from 'react';
import { Database, Calendar, MessageSquare, Phone, Globe, Lock, Share2, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

const APPS = [
  { name: 'Cal.com', desc: 'Booking widget & scheduling', icon: <Calendar size={24} />, connected: true, category: 'Scheduling' },
  { name: 'Twilio', desc: 'Phone numbers & calling', icon: <Phone size={24} />, connected: true, category: 'Telecom' },
  { name: 'ElevenLabs', desc: 'High-fidelity voice synthesis', icon: <Layers size={24} />, connected: true, category: 'AI Voice' },
  { name: 'GoHighLevel', desc: 'CRM & pipeline management', icon: <Database size={24} />, connected: false, category: 'CRM' },
  { name: 'Slack', desc: 'Real-time notifications', icon: <MessageSquare size={24} />, connected: false, category: 'Communication' },
  { name: 'Webhooks', desc: 'Custom HTTP automation', icon: <Globe size={24} />, connected: true, category: 'Developer' },
  { name: 'Stripe', desc: 'Handle payments in calls', icon: <Lock size={24} />, connected: false, category: 'Finance' },
  { name: 'Make.com', desc: 'Advanced logic workflows', icon: <Share2 size={24} />, connected: false, category: 'Automation' },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Integrations</h1>
        <p className="text-slate-400">Connect your existing tech stack to supercharge your AI agents.</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {APPS.map((app) => (
          <div key={app.name} className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl group hover:border-cyan-500/50 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className={cn(
                "p-3 rounded-2xl border",
                app.connected ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-slate-800 border-slate-700 text-slate-500"
              )}>
                {app.icon}
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight",
                app.connected ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
              )}>
                {app.connected ? 'Active' : 'Not Linked'}
              </span>
            </div>
            
            <div className="mb-6">
              <h4 className="text-white font-bold mb-1">{app.name}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{app.desc}</p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{app.category}</span>
              <button className={cn(
                "text-xs font-bold transition-all",
                app.connected ? "text-slate-500 hover:text-white" : "text-cyan-400 hover:text-cyan-300"
              )}>
                {app.connected ? 'Configure' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/60 border border-dashed border-slate-700 p-12 rounded-[40px] flex flex-col items-center text-center">
         <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mb-6">
           <Share2 size={32} />
         </div>
         <h3 className="text-white font-bold mb-2 text-xl">Need a custom integration?</h3>
         <p className="text-slate-400 text-sm max-w-sm mb-8">Deploy our API directly into your backend or use our Webhooks to connect anything.</p>
         <button className="btn-secondary px-8">Read API Docs</button>
      </div>
    </div>
  );
}
