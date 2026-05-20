import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Play, Settings, Search, X, ChevronRight,
  Zap, Database, Mail, Phone, MessageSquare, Globe,
  Calendar, FileSpreadsheet, Bot, Webhook, GitBranch,
  Loader2, CheckCircle2, AlertCircle, Trash2, ArrowRight,
  LayoutGrid, List, ExternalLink,
} from 'lucide-react';
import axios from 'axios';
import { cn } from '../../lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
}

interface WorkflowNode {
  id: string;
  integrationId: string;
  label: string;
  type: 'trigger' | 'action' | 'condition';
  x: number;
  y: number;
  icon: React.ReactNode;
  color: string;
}

interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  active: boolean;
  lastRun?: string;
  runs: number;
}

// ── Integration catalog (767 integrations — showing key ones) ─────────────────
const INTEGRATIONS: Integration[] = [
  { id: 'n8n-ai-agent', name: 'AI Agent', description: 'Autonomous AI agent node', category: 'AI', icon: <Bot size={18} />, color: '#a855f7', badge: 'Popular' },
  { id: 'openai', name: 'OpenAI', description: 'GPT-4, DALL·E, Whisper models', category: 'AI', icon: <Bot size={18} />, color: '#10a37f', badge: 'Popular' },
  { id: 'gemini', name: 'Google Gemini', description: 'Gemini AI assistant & models', category: 'AI', icon: <Bot size={18} />, color: '#4285f4' },
  { id: 'anthropic', name: 'Anthropic', description: 'Claude models for reasoning', category: 'AI', icon: <Bot size={18} />, color: '#d97706' },
  { id: 'elevenlabs', name: 'ElevenLabs', description: 'AI voice synthesis & cloning', category: 'AI', icon: <Phone size={18} />, color: '#06b6d4' },
  { id: 'webhook', name: 'Webhook', description: 'Receive HTTP requests', category: 'Core', icon: <Webhook size={18} />, color: '#f59e0b', badge: 'Popular' },
  { id: 'http', name: 'HTTP Request', description: 'Make any HTTP/REST call', category: 'Core', icon: <Globe size={18} />, color: '#64748b', badge: 'Popular' },
  { id: 'supabase', name: 'Supabase', description: 'Open-source Firebase alternative', category: 'Database', icon: <Database size={18} />, color: '#3ecf8e' },
  { id: 'postgres', name: 'PostgreSQL', description: 'Advanced relational database', category: 'Database', icon: <Database size={18} />, color: '#336791' },
  { id: 'mysql', name: 'MySQL', description: 'Open-source relational DB', category: 'Database', icon: <Database size={18} />, color: '#00758f' },
  { id: 'mongodb', name: 'MongoDB', description: 'Document-oriented database', category: 'Database', icon: <Database size={18} />, color: '#47a248' },
  { id: 'redis', name: 'Redis', description: 'In-memory key-value store', category: 'Database', icon: <Database size={18} />, color: '#dc382d' },
  { id: 'gmail', name: 'Gmail', description: 'Send & receive emails via Gmail', category: 'Email', icon: <Mail size={18} />, color: '#ea4335', badge: 'Popular' },
  { id: 'sendgrid', name: 'SendGrid', description: 'Cloud email delivery service', category: 'Email', icon: <Mail size={18} />, color: '#1a82e2' },
  { id: 'send-email', name: 'Send Email', description: 'Generic SMTP email sender', category: 'Email', icon: <Mail size={18} />, color: '#6366f1' },
  { id: 'google-sheets', name: 'Google Sheets', description: 'Read/write spreadsheet data', category: 'Productivity', icon: <FileSpreadsheet size={18} />, color: '#34a853', badge: 'Popular' },
  { id: 'excel', name: 'Microsoft Excel', description: 'Excel 365 spreadsheet ops', category: 'Productivity', icon: <FileSpreadsheet size={18} />, color: '#217346' },
  { id: 'notion', name: 'Notion', description: 'All-in-one workspace & DB', category: 'Productivity', icon: <LayoutGrid size={18} />, color: '#ffffff' },
  { id: 'airtable', name: 'Airtable', description: 'Flexible database & spreadsheet', category: 'Productivity', icon: <LayoutGrid size={18} />, color: '#fcb400' },
  { id: 'google-calendar', name: 'Google Calendar', description: 'Schedule & manage events', category: 'Productivity', icon: <Calendar size={18} />, color: '#4285f4' },
  { id: 'todoist', name: 'Todoist', description: 'Task management & to-do lists', category: 'Productivity', icon: <CheckCircle2 size={18} />, color: '#db4035' },
  { id: 'slack', name: 'Slack', description: 'Team messaging & collaboration', category: 'Communication', icon: <MessageSquare size={18} />, color: '#4a154b', badge: 'Popular' },
  { id: 'telegram', name: 'Telegram', description: 'Messaging & bot automation', category: 'Communication', icon: <MessageSquare size={18} />, color: '#0088cc', badge: 'Popular' },
  { id: 'discord', name: 'Discord', description: 'Community & team chat', category: 'Communication', icon: <MessageSquare size={18} />, color: '#5865f2' },
  { id: 'twilio', name: 'Twilio', description: 'SMS, voice & WhatsApp API', category: 'Communication', icon: <Phone size={18} />, color: '#f22f46' },
  { id: 'whatsapp', name: 'WhatsApp', description: 'WhatsApp Business messaging', category: 'Communication', icon: <MessageSquare size={18} />, color: '#25d366' },
  { id: 'github', name: 'GitHub', description: 'Code repos & CI/CD automation', category: 'Dev', icon: <GitBranch size={18} />, color: '#ffffff' },
  { id: 'jira', name: 'Jira Software', description: 'Project & issue tracking', category: 'Dev', icon: <GitBranch size={18} />, color: '#0052cc' },
  { id: 'clickup', name: 'ClickUp', description: 'All-in-one project management', category: 'Dev', icon: <CheckCircle2 size={18} />, color: '#7b68ee' },
  { id: 'trello', name: 'Trello', description: 'Visual kanban boards', category: 'Dev', icon: <LayoutGrid size={18} />, color: '#0052cc' },
  { id: 'aws-s3', name: 'AWS S3', description: 'Scalable object storage', category: 'Cloud', icon: <Database size={18} />, color: '#ff9900' },
  { id: 'google-drive', name: 'Google Drive', description: 'Cloud file storage & sync', category: 'Cloud', icon: <Database size={18} />, color: '#4285f4' },
  { id: 'baserow', name: 'Baserow', description: 'Open-source no-code database', category: 'Database', icon: <Database size={18} />, color: '#5190ef' },
  { id: 'mautic', name: 'Mautic', description: 'Open-source marketing automation', category: 'Marketing', icon: <Zap size={18} />, color: '#4e5e9e' },
  { id: 'woocommerce', name: 'WooCommerce', description: 'WordPress e-commerce platform', category: 'E-commerce', icon: <Zap size={18} />, color: '#96588a' },
  { id: 'spreadsheet-file', name: 'Spreadsheet File', description: 'Read/write local spreadsheets', category: 'Productivity', icon: <FileSpreadsheet size={18} />, color: '#22c55e' },
  { id: 'pushover', name: 'Pushover', description: 'Real-time push notifications', category: 'Communication', icon: <MessageSquare size={18} />, color: '#249df1' },
  { id: 'openweather', name: 'OpenWeatherMap', description: 'Live weather data & forecasts', category: 'Data', icon: <Globe size={18} />, color: '#eb6e4b' },
  { id: 'cal-com', name: 'Cal.com', description: 'Open-source scheduling & booking', category: 'Productivity', icon: <Calendar size={18} />, color: '#292929' },
  { id: 'ms-sql', name: 'Microsoft SQL', description: 'SQL Server database management', category: 'Database', icon: <Database size={18} />, color: '#cc2927' },
];

const CATEGORIES = ['All', 'AI', 'Core', 'Database', 'Email', 'Productivity', 'Communication', 'Dev', 'Cloud', 'Marketing', 'E-commerce', 'Data'];

// ── n8n API via axios ─────────────────────────────────────────────────────────
const n8nApi = axios.create({
  baseURL: import.meta.env.VITE_N8N_WEBHOOK_URL || '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

async function triggerWorkflow(payload: object): Promise<{ success: boolean; message: string }> {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  if (!webhookUrl) return { success: false, message: 'n8n webhook URL not configured in .env' };
  try {
    await n8nApi.post('', { ...payload, timestamp: new Date().toISOString(), source: 'AIWave Dashboard' });
    return { success: true, message: 'Workflow triggered successfully' };
  } catch (err: any) {
    const msg = err?.response?.data?.message || err?.message || 'Unknown error';
    return { success: false, message: msg };
  }
}

// ── Seed workflows ────────────────────────────────────────────────────────────
const SEED_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-1', name: 'Medical Spa Appointment', active: true, runs: 142, lastRun: '2 mins ago',
    nodes: [
      { id: 'n1', integrationId: 'webhook', label: 'Incoming Call', type: 'trigger', x: 60, y: 160, icon: <Webhook size={16} />, color: '#f59e0b' },
      { id: 'n2', integrationId: 'n8n-ai-agent', label: 'AI Voice Agent', type: 'action', x: 260, y: 160, icon: <Bot size={16} />, color: '#a855f7' },
      { id: 'n3', integrationId: 'supabase', label: 'Save to DB', type: 'action', x: 460, y: 80, icon: <Database size={16} />, color: '#3ecf8e' },
      { id: 'n4', integrationId: 'gmail', label: 'Send Confirmation', type: 'action', x: 460, y: 240, icon: <Mail size={16} />, color: '#ea4335' },
    ],
  },
  {
    id: 'wf-2', name: 'Lead Qualification Flow', active: false, runs: 87, lastRun: '1 hour ago',
    nodes: [
      { id: 'n1', integrationId: 'webhook', label: 'New Lead', type: 'trigger', x: 60, y: 160, icon: <Webhook size={16} />, color: '#f59e0b' },
      { id: 'n2', integrationId: 'openai', label: 'Qualify Lead', type: 'action', x: 260, y: 160, icon: <Bot size={16} />, color: '#10a37f' },
      { id: 'n3', integrationId: 'slack', label: 'Notify Team', type: 'action', x: 460, y: 160, icon: <MessageSquare size={16} />, color: '#4a154b' },
    ],
  },
];

// ── Integration Card ──────────────────────────────────────────────────────────
function IntegrationCard({ integration, onAdd }: { integration: Integration; onAdd: (i: Integration) => void }) {
  return (
    <button
      onClick={() => onAdd(integration)}
      className="group flex items-start gap-3 p-3 rounded-xl border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all text-left w-full"
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${integration.color}18`, border: `1px solid ${integration.color}30` }}>
        <span style={{ color: integration.color }}>{integration.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-semibold text-zinc-200 truncate">{integration.name}</span>
          {integration.badge && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0">
              {integration.badge}
            </span>
          )}
        </div>
        <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{integration.description}</p>
      </div>
      <Plus size={14} className="text-zinc-600 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-1" />
    </button>
  );
}

// ── Canvas Node ───────────────────────────────────────────────────────────────
function CanvasNode({ node, onRemove }: { node: WorkflowNode; onRemove: (id: string) => void }) {
  const typeColors = { trigger: '#f59e0b', action: '#06b6d4', condition: '#a855f7' };
  const typeBg = { trigger: 'bg-amber-500/10 border-amber-500/20', action: 'bg-cyan-500/10 border-cyan-500/20', condition: 'bg-purple-500/10 border-purple-500/20' };

  return (
    <motion.div
      drag dragMomentum={false}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ left: node.x, top: node.y, position: 'absolute' }}
      className="w-44 group cursor-move"
    >
      <div className={cn('bg-[#111118] border rounded-xl p-3 shadow-xl hover:shadow-2xl transition-shadow', typeBg[node.type])}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${node.color}20`, border: `1px solid ${node.color}40` }}>
              <span style={{ color: node.color }}>{node.icon}</span>
            </div>
            <span className="text-[11px] font-semibold text-zinc-200 leading-tight">{node.label}</span>
          </div>
          <button
            onClick={() => onRemove(node.id)}
            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-500/20 text-zinc-600 hover:text-red-400 transition-all"
          >
            <X size={11} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full" style={{ color: typeColors[node.type], backgroundColor: `${typeColors[node.type]}15` }}>
            {node.type}
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(SEED_WORKFLOWS);
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow>(SEED_WORKFLOWS[0]);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [intSearch, setIntSearch] = useState('');
  const [intCategory, setIntCategory] = useState('All');
  const [triggerStatus, setTriggerStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [triggering, setTriggering] = useState(false);
  const [nodeCounter, setNodeCounter] = useState(100);

  // Sync activeWorkflow into workflows list
  const updateActiveWorkflow = useCallback((updated: Workflow) => {
    setActiveWorkflow(updated);
    setWorkflows((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  }, []);

  const handleAddNode = (integration: Integration) => {
    const newNode: WorkflowNode = {
      id: `n-${nodeCounter}`,
      integrationId: integration.id,
      label: integration.name,
      type: activeWorkflow.nodes.length === 0 ? 'trigger' : 'action',
      x: 60 + (activeWorkflow.nodes.length % 4) * 200,
      y: 80 + Math.floor(activeWorkflow.nodes.length / 4) * 140,
      icon: integration.icon,
      color: integration.color,
    };
    setNodeCounter((c) => c + 1);
    updateActiveWorkflow({ ...activeWorkflow, nodes: [...activeWorkflow.nodes, newNode] });
    setShowIntegrations(false);
  };

  const handleRemoveNode = (nodeId: string) => {
    updateActiveWorkflow({ ...activeWorkflow, nodes: activeWorkflow.nodes.filter((n) => n.id !== nodeId) });
  };

  const handleNewWorkflow = () => {
    const wf: Workflow = {
      id: `wf-${Date.now()}`,
      name: `New Workflow ${workflows.length + 1}`,
      nodes: [],
      active: false,
      runs: 0,
    };
    setWorkflows((prev) => [...prev, wf]);
    setActiveWorkflow(wf);
    setShowIntegrations(true);
  };

  const handleTestTrigger = async () => {
    setTriggering(true);
    setTriggerStatus(null);
    const result = await triggerWorkflow({
      workflowId: activeWorkflow.id,
      workflowName: activeWorkflow.name,
      nodes: activeWorkflow.nodes.map((n) => n.integrationId),
      eventType: 'test_trigger',
    });
    setTriggerStatus(result);
    setTriggering(false);
    if (result.success) {
      updateActiveWorkflow({ ...activeWorkflow, runs: activeWorkflow.runs + 1, lastRun: 'Just now' });
    }
    setTimeout(() => setTriggerStatus(null), 5000);
  };

  const filteredIntegrations = INTEGRATIONS.filter((i) => {
    const matchCat = intCategory === 'All' || i.category === intCategory;
    const matchSearch = i.name.toLowerCase().includes(intSearch.toLowerCase()) || i.description.toLowerCase().includes(intSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Automation Workflows</h1>
          <p className="text-slate-400 text-sm">Build n8n-powered automations with 767+ integrations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#FF6C37]/5 border border-[#FF6C37]/20 rounded-lg text-[10px] font-bold text-[#FF6C37] uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6C37] animate-pulse" /> n8n Connected
          </div>
          <button
            onClick={handleNewWorkflow}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Plus size={16} /> New Workflow
          </button>
        </div>
      </div>

      <div className="flex gap-6 h-[620px]">
        {/* Workflow list sidebar */}
        <div className="w-56 flex-shrink-0 space-y-2">
          <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 px-1 mb-3">Your Workflows</p>
          {workflows.map((wf) => (
            <button
              key={wf.id}
              onClick={() => setActiveWorkflow(wf)}
              className={cn(
                'w-full text-left px-3 py-3 rounded-xl border transition-all',
                activeWorkflow.id === wf.id
                  ? 'bg-cyan-500/10 border-cyan-500/20 text-zinc-100'
                  : 'border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-semibold truncate">{wf.name}</span>
                <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', wf.active ? 'bg-emerald-500' : 'bg-zinc-600')} />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                <span>{wf.nodes.length} nodes</span>
                <span>·</span>
                <span>{wf.runs} runs</span>
              </div>
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div className="flex-1 relative bg-[#080c18] rounded-2xl border border-white/[0.06] overflow-hidden">
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#334155 0.8px, transparent 0.8px)', backgroundSize: '20px 20px' }} />

          {/* Canvas toolbar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-[#111118] border border-white/[0.08] rounded-lg text-[11px] font-semibold text-zinc-300 flex items-center gap-2">
                <div className={cn('w-1.5 h-1.5 rounded-full', activeWorkflow.active ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600')} />
                {activeWorkflow.name}
              </div>
              {activeWorkflow.lastRun && (
                <span className="text-[10px] text-zinc-600">Last run: {activeWorkflow.lastRun}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowIntegrations(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111118] border border-white/[0.08] rounded-lg text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 hover:border-white/[0.14] transition-all"
              >
                <Plus size={13} /> Add Node
              </button>
              <button
                onClick={() => updateActiveWorkflow({ ...activeWorkflow, active: !activeWorkflow.active })}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border',
                  activeWorkflow.active
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-white/[0.04] border-white/[0.08] text-zinc-400 hover:text-zinc-200'
                )}
              >
                {activeWorkflow.active ? 'Active' : 'Inactive'}
              </button>
            </div>
          </div>

          {/* Nodes */}
          <div className="relative w-full h-full">
            {/* SVG edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {activeWorkflow.nodes.slice(0, -1).map((node, i) => {
                const next = activeWorkflow.nodes[i + 1];
                const x1 = node.x + 176; const y1 = node.y + 36;
                const x2 = next.x; const y2 = next.y + 36;
                const mx = (x1 + x2) / 2;
                return (
                  <path key={`edge-${i}`} d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
                    stroke="#1e293b" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                );
              })}
            </svg>

            <AnimatePresence>
              {activeWorkflow.nodes.map((node) => (
                <React.Fragment key={node.id}>
                  <CanvasNode node={node} onRemove={handleRemoveNode} />
                </React.Fragment>
              ))}
            </AnimatePresence>

            {activeWorkflow.nodes.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <Zap size={28} className="text-zinc-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-400">Empty canvas</p>
                  <p className="text-[11px] text-zinc-600 mt-1">Click "Add Node" to pick an integration</p>
                </div>
                <button onClick={() => setShowIntegrations(true)} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl text-sm font-semibold hover:bg-cyan-500/20 transition-colors">
                  <Plus size={14} /> Browse 767 Integrations
                </button>
              </div>
            )}
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3 z-10">
            <AnimatePresence>
              {triggerStatus && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold border',
                    triggerStatus.success
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  )}
                >
                  {triggerStatus.success ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                  {triggerStatus.message}
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={handleTestTrigger}
              disabled={triggering || activeWorkflow.nodes.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {triggering ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} fill="currentColor" />}
              Test Flow
            </button>
          </div>
        </div>
      </div>

      {/* Integrations drawer */}
      <AnimatePresence>
        {showIntegrations && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-end"
            onClick={() => setShowIntegrations(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[480px] h-full bg-[#0a0f1e] border-l border-white/[0.06] flex flex-col shadow-2xl"
            >
              {/* Drawer header */}
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">Add Integration</h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">767 integrations available</p>
                </div>
                <button onClick={() => setShowIntegrations(false)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-200 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Search */}
              <div className="px-4 pt-4 pb-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input
                    value={intSearch}
                    onChange={(e) => setIntSearch(e.target.value)}
                    placeholder="Search integrations..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-cyan-500/40 transition-colors"
                    autoFocus
                  />
                </div>
              </div>

              {/* Category pills */}
              <div className="px-4 pb-3 flex gap-1.5 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setIntCategory(cat)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all',
                      intCategory === cat
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                        : 'text-zinc-500 hover:text-zinc-300 border border-transparent hover:border-white/[0.06]'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Integration list */}
              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
                {filteredIntegrations.length === 0 ? (
                  <div className="text-center py-12 text-zinc-600 text-sm">No integrations found</div>
                ) : (
                  filteredIntegrations.map((integration) => (
                    <React.Fragment key={integration.id}>
                      <IntegrationCard integration={integration} onAdd={handleAddNode} />
                    </React.Fragment>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
