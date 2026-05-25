import React, { useState, useEffect } from 'react';
import {
  Database, Calendar, MessageSquare, Phone, Globe, Lock, Share2, Layers,
  Webhook, CheckCircle2, X, Loader2,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { loadJson, saveJson } from '../../lib/dashboardStorage';
import { INTEGRATIONS } from './workflow/integrations';
import { executeWorkflow } from './workflow/workflowService';
import type { Workflow } from './workflow/types';

type IntegrationState = Record<string, { connected: boolean; apiKey?: string; webhookUrl?: string }>;

const DEFAULT_APPS = [
  { id: 'calcom', name: 'Cal.com', desc: 'Booking widget & scheduling', icon: <Calendar size={24} />, category: 'Scheduling', envKey: 'VITE_CAL_LINK' },
  { id: 'twilio', name: 'Twilio', desc: 'Phone numbers & calling', icon: <Phone size={24} />, category: 'Telecom', envKey: 'VITE_TWILIO_PHONE_NUMBER' },
  { id: 'elevenlabs', name: 'ElevenLabs', desc: 'High-fidelity voice synthesis', icon: <Layers size={24} />, category: 'AI Voice', envKey: 'VITE_ELEVEN_LABS_API_KEY' },
  { id: 'n8n', name: 'n8n', desc: 'Workflow automation webhooks', icon: <Webhook size={24} />, category: 'Automation', envKey: 'VITE_N8N_WEBHOOK_URL' },
  { id: 'ghl', name: 'GoHighLevel', desc: 'CRM & pipeline management', icon: <Database size={24} />, category: 'CRM' },
  { id: 'slack', name: 'Slack', desc: 'Real-time notifications', icon: <MessageSquare size={24} />, category: 'Communication' },
  { id: 'webhooks', name: 'Webhooks', desc: 'Custom HTTP automation', icon: <Globe size={24} />, category: 'Developer' },
  { id: 'stripe', name: 'Stripe', desc: 'Handle payments in calls', icon: <Lock size={24} />, category: 'Finance' },
];

function envConfigured(envKey?: string): boolean {
  if (!envKey) return false;
  const val = import.meta.env[envKey as keyof ImportMetaEnv];
  return Boolean(val && String(val).length > 0);
}

export default function IntegrationsPage() {
  const [state, setState] = useState<IntegrationState>(() => loadJson('integrations', {}));
  const [configId, setConfigId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testMsg, setTestMsg] = useState<string | null>(null);

  useEffect(() => {
    saveJson('integrations', state);
  }, [state]);

  const toggleConnect = (id: string) => {
    setState((prev) => ({
      ...prev,
      [id]: { ...prev[id], connected: !prev[id]?.connected },
    }));
  };

  const saveCredentials = (id: string) => {
    setState((prev) => ({
      ...prev,
      [id]: { connected: true, apiKey: formKey },
    }));
    setConfigId(null);
    setFormKey('');
  };

  const testN8nWebhook = async () => {
    setTesting(true);
    setTestMsg(null);
    const stub: Workflow = {
      id: 'test',
      name: 'Integration Test',
      nodes: [{ id: 'n1', integrationId: 'webhook', label: 'Test', type: 'trigger', x: 0, y: 0, credentials: {}, configured: true }],
      edges: [],
      active: true,
      runs: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const result = await executeWorkflow(stub);
    setTestMsg(result.success ? 'n8n webhook responded successfully' : result.message);
    setTesting(false);
    setTimeout(() => setTestMsg(null), 5000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Integrations</h1>
          <p className="text-slate-400">Connect your stack — same nodes available in the Workflow builder ({INTEGRATIONS.length}+ apps).</p>
        </div>
        <button
          type="button"
          onClick={testN8nWebhook}
          disabled={testing}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6C37]/10 border border-[#FF6C37]/30 text-[#FF6C37] rounded-xl text-sm font-bold hover:bg-[#FF6C37]/20 transition-all self-start"
        >
          {testing ? <Loader2 size={16} className="animate-spin" /> : <Webhook size={16} />}
          Test n8n Webhook
        </button>
      </div>

      {testMsg && (
        <div className="px-4 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm">{testMsg}</div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {DEFAULT_APPS.map((app) => {
          const connected = state[app.id]?.connected || envConfigured(app.envKey);
          return (
            <div key={app.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl group hover:border-cyan-500/50 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className={cn(
                  'p-3 rounded-2xl border',
                  connected ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                )}>
                  {app.icon}
                </div>
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight',
                  connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                )}>
                  {connected ? 'Active' : 'Not Linked'}
                </span>
              </div>
              <div className="mb-6">
                <h4 className="text-white font-bold mb-1">{app.name}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{app.desc}</p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{app.category}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (connected && app.id !== 'n8n') toggleConnect(app.id);
                    else setConfigId(app.id);
                  }}
                  className={cn(
                    'text-xs font-bold transition-all',
                    connected ? 'text-slate-500 hover:text-white' : 'text-cyan-400 hover:text-cyan-300'
                  )}
                >
                  {connected ? 'Configure' : 'Connect'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900/60 border border-dashed border-slate-700 p-8 rounded-3xl">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Share2 size={20} className="text-cyan-400" /> Workflow builder integrations
        </h3>
        <div className="flex flex-wrap gap-2">
          {INTEGRATIONS.slice(0, 16).map((i) => (
            <span key={i.id} className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {i.name}
            </span>
          ))}
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            +{INTEGRATIONS.length - 16} more in Workflows
          </span>
        </div>
      </div>

      {configId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setConfigId(null)}>
          <div className="bg-[#111118] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Connect {DEFAULT_APPS.find((a) => a.id === configId)?.name}</h3>
              <button type="button" onClick={() => setConfigId(null)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">API Key / Webhook URL</label>
            <input
              type="password"
              value={formKey}
              onChange={(e) => setFormKey(e.target.value)}
              placeholder={configId === 'n8n' ? 'https://your-n8n.app/webhook/...' : 'Paste API key'}
              className="mt-2 w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500/50"
            />
            <p className="text-[10px] text-zinc-600 mt-2">Stored locally in your browser. For production, also set env vars in Hostinger.</p>
            <button
              type="button"
              onClick={() => saveCredentials(configId)}
              className="mt-4 w-full py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:bg-cyan-400 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} /> Save & Connect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
