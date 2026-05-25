import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Shield, CreditCard, Laptop, Globe, Save, Key, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { getGeminiApiKey, setGeminiApiKey, isGeminiConfigured } from '../../services/geminiService';
import { loadJson, saveJson } from '../../lib/dashboardStorage';

type TabId = 'profile' | 'notifications' | 'security' | 'billing' | 'api';

interface Prefs {
  voiceAutopilot: boolean;
  realtimeDashboards: boolean;
  callTranscriptions: boolean;
}

const DEFAULT_PREFS: Prefs = {
  voiceAutopilot: true,
  realtimeDashboards: true,
  callTranscriptions: false,
};

export default function SettingsPage() {
  const [tab, setTab] = useState<TabId>('profile');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('Founder @ AIWave. Scaling future voice-first agencies.');
  const [geminiKey, setGeminiKey] = useState('');
  const [n8nUrl, setN8nUrl] = useState('');
  const [prefs, setPrefs] = useState<Prefs>(() => loadJson('settings_prefs', DEFAULT_PREFS));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email ?? '');
        setFullName(
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          ''
        );
      }
    });
    setGeminiKey(getGeminiApiKey() ? '••••••••' + getGeminiApiKey().slice(-4) : '');
    const storedN8n = localStorage.getItem('aiwave_n8n_webhook');
    if (storedN8n) setN8nUrl(storedN8n);
    else setN8nUrl(String(import.meta.env.VITE_N8N_WEBHOOK_URL ?? ''));
  }, []);

  const handleSave = () => {
    if (geminiKey && !geminiKey.startsWith('••')) {
      setGeminiApiKey(geminiKey);
    }
    if (n8nUrl) localStorage.setItem('aiwave_n8n_webhook', n8nUrl);
    saveJson('settings_prefs', prefs);
    saveJson('settings_profile', { fullName, bio });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
    { id: 'api', label: 'API Keys', icon: <Key size={18} /> },
  ];

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Settings</h1>
        <p className="text-slate-400">Profile, API keys for Gemini & n8n, and system preferences.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          <CheckCircle2 size={16} /> Settings saved
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="space-y-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                tab === item.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl space-y-8">
            {tab === 'profile' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe size={20} className="text-cyan-400" /> Public Profile
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
                    <input type="email" value={email} readOnly className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-zinc-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bio</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500/50 h-32" />
                </div>
              </div>
            )}

            {tab === 'api' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Key size={20} className="text-cyan-400" /> API Keys
                </h3>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gemini API Key</label>
                  <input
                    type="password"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIza..."
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500/50 font-mono text-sm"
                  />
                  <p className={cn('text-[10px]', isGeminiConfigured() ? 'text-emerald-400' : 'text-amber-400')}>
                    {isGeminiConfigured() ? 'Gemini is configured — agent chat will work' : 'Required for Medical Front Desk chat'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">n8n Webhook URL</label>
                  <input
                    type="url"
                    value={n8nUrl}
                    onChange={(e) => setN8nUrl(e.target.value)}
                    placeholder="https://your-n8n.app/webhook/..."
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500/50 font-mono text-sm"
                  />
                  <p className="text-[10px] text-zinc-600">Used when you click Execute on Workflows or Test Webhook on Integrations.</p>
                </div>
              </div>
            )}

            {(tab === 'notifications' || tab === 'security' || tab === 'billing') && (
              <div className="space-y-4 text-slate-400 text-sm">
                {tab === 'notifications' && <p>Email alerts for campaign completion and workflow failures — coming soon.</p>}
                {tab === 'security' && (
                  <div className="space-y-3">
                    {[
                      { device: 'Current browser session', ip: 'Active now', status: 'Current Session' },
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><Laptop size={16} /></div>
                          <div>
                            <p className="text-sm font-bold text-white">{session.device}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{session.ip}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{session.status}</span>
                      </div>
                    ))}
                  </div>
                )}
                {tab === 'billing' && <p>Pro plan billing is managed via Hostinger / Stripe — contact support@sofoniyas.aiwaveagency.com</p>}
              </div>
            )}

            {tab === 'profile' && (
              <div className="space-y-4 pt-8 border-t border-white/5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield size={20} className="text-cyan-400" /> System Preferences
                </h3>
                {[
                  { key: 'voiceAutopilot' as const, label: 'Voice Over Autopilot', desc: 'Allow AI to speak naturally with adaptive latency.' },
                  { key: 'realtimeDashboards' as const, label: 'Real-time Dashboards', desc: 'Update analytics as calls happen.' },
                  { key: 'callTranscriptions' as const, label: 'Call Transcriptions', desc: 'Generate text versions of every conversation.' },
                ].map((pref) => (
                  <div key={pref.key} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                    <div>
                      <p className="text-sm font-bold text-white">{pref.label}</p>
                      <p className="text-[10px] text-slate-500">{pref.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPrefs((p) => ({ ...p, [pref.key]: !p[pref.key] }))}
                      className={cn('w-10 h-6 rounded-full p-1 transition-colors', prefs[pref.key] ? 'bg-cyan-500' : 'bg-slate-700')}
                    >
                      <div className={cn('w-4 h-4 bg-white rounded-full transition-transform', prefs[pref.key] ? 'translate-x-4' : 'translate-x-0')} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button type="button" onClick={handleSave} className="btn-primary flex items-center gap-2 px-8">
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
