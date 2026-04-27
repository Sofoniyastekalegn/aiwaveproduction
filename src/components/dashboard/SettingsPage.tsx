import React from 'react';
import { User, Bell, Lock, Shield, CreditCard, Laptop, Globe, Save } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Settings</h1>
        <p className="text-slate-400">Manage your profile, billing, and system preferences.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="space-y-1">
          {[
            { id: 'profile', label: 'Profile', icon: <User size={18} /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
            { id: 'security', label: 'Security', icon: <Lock size={18} /> },
            { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
            { id: 'api', label: 'API Keys', icon: <Laptop size={18} /> },
          ].map((item) => (
            <button key={item.id} className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
              item.id === 'profile' ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            )}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe size={20} className="text-cyan-400" />
                Public Profile
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Username</label>
                  <input type="text" defaultValue="sofoniyas_t" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
                  <input type="email" defaultValue="sofoniyas@agency.io" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500/50" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bio</label>
                <textarea className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500/50 h-32" defaultValue="Founder @ AIWave. Scaling future voice-first agencies."></textarea>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield size={20} className="text-cyan-400" />
                Login Sessions & Identity
              </h3>
              <div className="space-y-3">
                {[
                  { device: 'macOS - Brave Browser', ip: '192.168.1.1', status: 'Current Session' },
                  { device: 'iPhone 15 Pro - Safari', ip: '172.20.10.4', status: '2 hours ago' },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-4">
                       <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                         <Laptop size={16} />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-white">{session.device}</p>
                         <p className="text-[10px] text-slate-500 font-mono">{session.ip}</p>
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{session.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield size={20} className="text-cyan-400" />
                System Preferences
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Voice Over Autopilot', desc: 'Allow AI to speak naturally with adaptive latency.', active: true },
                  { label: 'Real-time Dashboards', desc: 'Update analytics as calls happen (uses more bandwidth).', active: true },
                  { label: 'Call Transcriptions', desc: 'Automatically generate text versions of every conversation.', active: false },
                ].map((pref, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                    <div>
                       <p className="text-sm font-bold text-white">{pref.label}</p>
                       <p className="text-[10px] text-slate-500">{pref.desc}</p>
                    </div>
                    <div className={cn(
                      "w-10 h-6 rounded-full p-1 transition-colors cursor-pointer",
                      pref.active ? "bg-cyan-500" : "bg-slate-700"
                    )}>
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full transition-transform",
                        pref.active ? "translate-x-4" : "translate-x-0"
                      )}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
               <button className="btn-primary flex items-center gap-2 px-8">
                 <Save size={18} /> Save Changes
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
