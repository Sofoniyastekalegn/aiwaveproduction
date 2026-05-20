import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Filter, Settings2, Mic, Globe, FilePen,
  Pencil, Trash2, ExternalLink, Loader2, ShieldCheck,
  ChevronDown, MessageSquare,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import AgentChatPanel from './AgentChatPanel';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Agent {
  id: string;
  name: string;
  industry: string;
  status: 'Live' | 'Draft' | 'Paused';
  voice?: string;
  language?: string;
  calls_today?: number;
  knowledge_pct?: number;
  created_at: string;
  user_id?: string;
}

// ── Status badge config ───────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  Live: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Draft: 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Paused: 'bg-zinc-100 dark:bg-zinc-500/10 text-zinc-500 dark:text-zinc-400',
};

const STATUS_ICON_BG: Record<string, string> = {
  Live: 'bg-emerald-50 dark:bg-emerald-500/[0.06]',
  Draft: 'bg-amber-50 dark:bg-amber-500/[0.06]',
  Paused: 'bg-zinc-50 dark:bg-zinc-500/[0.06]',
};

const STATUS_ICON_COLOR: Record<string, string> = {
  Live: 'text-emerald-500',
  Draft: 'text-amber-500',
  Paused: 'text-zinc-400',
};

// ── Seed agents (shown when Supabase table is empty / not yet set up) ─────────
const SEED_AGENTS: Agent[] = [
  { id: 'seed-1', name: 'Medical Front Desk', industry: 'Healthcare', status: 'Live', voice: 'Rachel', language: 'en-US', calls_today: 42, knowledge_pct: 96, created_at: '2026-03-31T10:00:00Z' },
  { id: 'seed-2', name: 'Booking Assistant', industry: 'Hospitality', status: 'Live', voice: 'Antoni', language: 'en-US', calls_today: 28, knowledge_pct: 92, created_at: '2026-03-31T10:00:00Z' },
  { id: 'seed-3', name: 'Barber Shop AI', industry: 'Barber Shop', status: 'Live', voice: 'Clyde', language: 'en-US', calls_today: 18, knowledge_pct: 91, created_at: '2026-03-31T10:00:00Z' },
  { id: 'seed-4', name: 'Real Estate Qualifier', industry: 'Real Estate', status: 'Live', voice: 'Rachel', language: 'en-US', calls_today: 56, knowledge_pct: 98, created_at: '2026-03-31T10:00:00Z' },
  { id: 'seed-5', name: 'Dental Clinic Agent', industry: 'Dental', status: 'Live', voice: 'Nicole', language: 'en-US', calls_today: 31, knowledge_pct: 94, created_at: '2026-03-31T10:00:00Z' },
  { id: 'seed-6', name: 'Salon Receptionist', industry: 'Beauty', status: 'Paused', language: 'en-US', calls_today: 15, knowledge_pct: 89, created_at: '2026-03-31T10:00:00Z' },
];

const INDUSTRIES = ['All', 'Healthcare', 'Hospitality', 'Barber Shop', 'Real Estate', 'Dental', 'Beauty', 'Medical Spa'];
const SORT_OPTIONS = ['Newest First', 'Oldest First', 'Name A–Z', 'Most Calls'];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Agent Card ────────────────────────────────────────────────────────────────
function AgentCard({
  agent,
  onDelete,
  onChat,
}: {
  agent: Agent;
  onDelete: (id: string) => void;
  onChat: (agent: Agent) => void;
}) {
  const iconBg = STATUS_ICON_BG[agent.status] ?? STATUS_ICON_BG.Draft;
  const iconColor = STATUS_ICON_COLOR[agent.status] ?? STATUS_ICON_COLOR.Draft;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="group bg-white dark:bg-[#111118] rounded-xl border border-zinc-200/60 dark:border-white/[0.06] p-5 hover:border-zinc-300 dark:hover:border-white/[0.1] hover:shadow-sm transition-all cursor-pointer"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-xl', iconBg)}>
            <FilePen className={cn('h-4.5 w-4.5', iconColor)} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">
              {agent.name}
            </h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">{agent.industry}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className={cn('px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider', STATUS_STYLES[agent.status])}>
            {agent.status}
          </span>

          {/* Action buttons — visible on hover */}
          <div className="flex items-center gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors"
              title="Chat with agent"
              onClick={() => onChat(agent)}
            >
              <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
            </button>
            <button
              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors"
              title="Edit in builder"
            >
              <Pencil className="h-3.5 w-3.5 text-zinc-400" />
            </button>
            <button
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              title="Delete agent"
              onClick={() => onDelete(agent.id)}
            >
              <Trash2 className="h-3.5 w-3.5 text-zinc-400 hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Mic className="h-3 w-3 text-zinc-300 dark:text-zinc-600" />
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{agent.voice ?? '—'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="h-3 w-3 text-zinc-300 dark:text-zinc-600" />
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{agent.language ?? 'en-US'}</span>
          </div>
          {agent.calls_today !== undefined && (
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[11px] text-zinc-400 font-medium">{agent.calls_today} calls today</span>
            </div>
          )}
        </div>

        {/* Knowledge bar */}
        {agent.knowledge_pct !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>Knowledge</span>
              <span className="font-semibold text-zinc-400">{agent.knowledge_pct}%</span>
            </div>
            <div className="h-1 bg-zinc-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${agent.knowledge_pct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className={cn(
                  'h-full rounded-full',
                  agent.knowledge_pct >= 95 ? 'bg-emerald-500' : agent.knowledge_pct >= 90 ? 'bg-cyan-500' : 'bg-amber-500'
                )}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100 dark:border-white/[0.04]">
        <span className="text-[10px] text-zinc-400">Created {formatDate(agent.created_at)}</span>
        <span className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          View Details <ExternalLink className="h-2.5 w-2.5" />
        </span>
      </div>
    </motion.div>
  );
}

// ── Deploy Modal ──────────────────────────────────────────────────────────────
function DeployModal({ onClose, onDeploy }: { onClose: () => void; onDeploy: (a: Omit<Agent, 'id' | 'created_at'>) => void }) {
  const [form, setForm] = useState({ name: '', industry: 'Healthcare', status: 'Draft' as Agent['status'], voice: '', language: 'en-US' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onDeploy(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111118] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <h2 className="text-lg font-bold text-zinc-100 mb-5">Deploy New Agent</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Agent Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Front Desk Agent"
              className="mt-1.5 w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-cyan-500/50 transition-colors"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Industry</label>
              <select
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className="mt-1.5 w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-500/50 transition-colors"
              >
                {INDUSTRIES.filter((i) => i !== 'All').map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Agent['status'] })}
                className="mt-1.5 w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-500/50 transition-colors"
              >
                <option value="Draft">Draft</option>
                <option value="Live">Live</option>
                <option value="Paused">Paused</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Voice</label>
              <input
                value={form.voice}
                onChange={(e) => setForm({ ...form, voice: e.target.value })}
                placeholder="Rachel, Nicole…"
                className="mt-1.5 w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Language</label>
              <input
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                placeholder="en-US"
                className="mt-1.5 w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-zinc-400 hover:text-zinc-200 text-sm font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400 transition-colors">
              Deploy Agent
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterIndustry, setFilterIndustry] = useState('All');
  const [sortBy, setSortBy] = useState('Newest First');
  const [showDeploy, setShowDeploy] = useState(false);
  const [chatAgent, setChatAgent] = useState<Agent | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // ── Load agents from Supabase ───────────────────────────────────────────────
  const loadAgents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        // Fall back to seed data if table doesn't exist yet or is empty
        setAgents(SEED_AGENTS);
      } else {
        setAgents(data as Agent[]);
      }
    } catch {
      setAgents(SEED_AGENTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAgents(); }, [loadAgents]);

  // ── Deploy new agent ────────────────────────────────────────────────────────
  const handleDeploy = async (form: Omit<Agent, 'id' | 'created_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    const newAgent: Omit<Agent, 'id'> = {
      ...form,
      calls_today: 0,
      knowledge_pct: 0,
      created_at: new Date().toISOString(),
      user_id: user?.id,
    };

    const { data, error } = await supabase.from('agents').insert([newAgent]).select().single();

    if (error || !data) {
      // Optimistic local add if Supabase table not ready
      setAgents((prev) => [{ ...newAgent, id: `local-${Date.now()}` }, ...prev]);
    } else {
      setAgents((prev) => [data as Agent, ...prev]);
    }
    setShowDeploy(false);
  };

  // ── Delete agent ────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
    if (!id.startsWith('seed-') && !id.startsWith('local-')) {
      await supabase.from('agents').delete().eq('id', id);
    }
  };

  // ── Filter + sort ───────────────────────────────────────────────────────────
  const displayed = agents
    .filter((a) => filterIndustry === 'All' || a.industry === filterIndustry)
    .sort((a, b) => {
      if (sortBy === 'Newest First') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'Oldest First') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'Name A–Z') return a.name.localeCompare(b.name);
      if (sortBy === 'Most Calls') return (b.calls_today ?? 0) - (a.calls_today ?? 0);
      return 0;
    });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Active AI Workforce</h1>
          <p className="text-slate-400 text-sm">Deploy and manage specialized agents for every business function.</p>
        </div>
        <button
          onClick={() => setShowDeploy(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus size={16} /> Deploy New Agent
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status filter pills */}
        <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
          {(['All', 'Live', 'Draft', 'Paused'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterIndustry(s === 'All' ? 'All' : s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all',
                (s === 'All' && filterIndustry === 'All') || filterIndustry === s
                  ? 'bg-white/[0.08] text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Industry dropdown */}
        <div className="relative">
          <button
            onClick={() => { setFilterOpen((v) => !v); setSortOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 uppercase tracking-wider transition-colors"
          >
            <Filter size={13} /> {filterIndustry === 'All' ? 'Filter By Industry' : filterIndustry}
            <ChevronDown size={12} className={cn('transition-transform', filterOpen && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute top-full mt-1.5 left-0 bg-[#111118] border border-white/[0.08] rounded-xl shadow-xl z-20 min-w-[160px] py-1 overflow-hidden"
              >
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => { setFilterIndustry(ind); setFilterOpen(false); }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-[12px] transition-colors',
                      filterIndustry === ind ? 'text-cyan-400 bg-cyan-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                    )}
                  >
                    {ind}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort dropdown */}
        <div className="relative ml-auto">
          <button
            onClick={() => { setSortOpen((v) => !v); setFilterOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 uppercase tracking-wider transition-colors"
          >
            <Settings2 size={13} /> {sortBy}
            <ChevronDown size={12} className={cn('transition-transform', sortOpen && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute top-full mt-1.5 right-0 bg-[#111118] border border-white/[0.08] rounded-xl shadow-xl z-20 min-w-[160px] py-1 overflow-hidden"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setSortOpen(false); }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-[12px] transition-colors',
                      sortBy === opt ? 'text-cyan-400 bg-cyan-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-cyan-500 w-6 h-6" />
        </div>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {displayed.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onDelete={handleDelete}
                onChat={(a) => setChatAgent(a)}
              />
            ))}
          </AnimatePresence>

          {/* Deploy placeholder */}
          <motion.button
            layout
            onClick={() => setShowDeploy(true)}
            className="border-2 border-dashed border-white/[0.06] rounded-xl p-5 flex flex-col items-center justify-center gap-3 hover:border-cyan-500/30 hover:bg-cyan-500/[0.02] transition-all min-h-[180px] group"
          >
            <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:border-cyan-500/30 transition-all">
              <Plus size={20} className="text-zinc-600 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-[12px] font-semibold text-zinc-500 group-hover:text-zinc-300 transition-colors">Deploy New Agent</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">Scale your capacity instantly</p>
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* Security banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Advanced Safety Safeguards</h3>
            <p className="text-slate-400 text-sm mt-0.5 max-w-md">All agents are secured with PII masking and SOC2-compliant data handling by default.</p>
          </div>
        </div>
        <button className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors w-full lg:w-auto">
          Review Security Logs
        </button>
      </div>

      {/* Modals / Panels */}
      <AnimatePresence>
        {showDeploy && <DeployModal onClose={() => setShowDeploy(false)} onDeploy={handleDeploy} />}
      </AnimatePresence>

      <AnimatePresence>
        {chatAgent && <AgentChatPanel agent={chatAgent} onClose={() => setChatAgent(null)} />}
      </AnimatePresence>
    </div>
  );
}
