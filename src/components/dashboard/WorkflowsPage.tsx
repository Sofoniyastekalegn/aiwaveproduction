import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Play, Search, X, Zap, Database, Mail, Phone,
  MessageSquare, Globe, Calendar, FileSpreadsheet, Bot,
  Webhook, GitBranch, Loader2, CheckCircle2, AlertCircle,
  Trash2, Save, LayoutGrid, Mic, Key, Upload, Download, FileJson,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { INTEGRATIONS, CATEGORIES, getIntegration } from './workflow/integrations';
import { fetchWorkflows, saveWorkflow, deleteWorkflow, executeWorkflow } from './workflow/workflowService';
import { exportToN8n, importFromN8n, SAMPLE_MEDICAL_SPA_N8N } from './workflow/n8nFormat';
import { downloadJsonFile, readJsonFile } from '../../lib/dashboardStorage';
import NodeConfigPanel from './workflow/NodeConfigPanel';
import type { Workflow, WorkflowNode, WorkflowEdge } from './workflow/types';

// ── Icon map ──────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ReactNode> = {
  Bot: <Bot size={16} />, Database: <Database size={16} />, Mail: <Mail size={16} />,
  Phone: <Phone size={16} />, MessageSquare: <MessageSquare size={16} />, Globe: <Globe size={16} />,
  Calendar: <Calendar size={16} />, FileSpreadsheet: <FileSpreadsheet size={16} />,
  Webhook: <Webhook size={16} />, GitBranch: <GitBranch size={16} />, Zap: <Zap size={16} />,
  LayoutGrid: <LayoutGrid size={16} />, Mic: <Mic size={16} />,
};

function getIcon(name: string) { return ICON_MAP[name] ?? <Zap size={16} />; }

// ── Seed workflows (shown before Supabase loads) ──────────────────────────────
function makeSeedWorkflows(): Workflow[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'local-seed-1', name: 'Medical Spa Appointment', active: true, runs: 142,
      last_run: '2 mins ago', created_at: now, updated_at: now,
      nodes: [
        { id: 'n1', integrationId: 'webhook', label: 'Incoming Call', type: 'trigger', x: 80, y: 200, credentials: {}, configured: true, operation: 'Listen for Events' },
        { id: 'n2', integrationId: 'n8n-ai-agent', label: 'AI Voice Agent', type: 'action', x: 320, y: 200, credentials: {}, configured: false, operation: 'Run Agent' },
        { id: 'n3', integrationId: 'supabase', label: 'Save to DB', type: 'action', x: 560, y: 120, credentials: {}, configured: false, operation: 'Insert Row' },
        { id: 'n4', integrationId: 'gmail', label: 'Send Confirmation', type: 'action', x: 560, y: 280, credentials: {}, configured: false, operation: 'Send Email' },
      ],
      edges: [
        { id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2' },
        { id: 'e2', sourceNodeId: 'n2', targetNodeId: 'n3' },
        { id: 'e3', sourceNodeId: 'n2', targetNodeId: 'n4' },
      ],
    },
    {
      id: 'local-seed-2', name: 'Lead Qualification', active: false, runs: 87,
      last_run: '1 hour ago', created_at: now, updated_at: now,
      nodes: [
        { id: 'n1', integrationId: 'webhook', label: 'New Lead', type: 'trigger', x: 80, y: 200, credentials: {}, configured: true },
        { id: 'n2', integrationId: 'openai', label: 'Qualify Lead', type: 'action', x: 320, y: 200, credentials: {}, configured: false },
        { id: 'n3', integrationId: 'slack', label: 'Notify Team', type: 'action', x: 560, y: 200, credentials: {}, configured: false },
      ],
      edges: [
        { id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2' },
        { id: 'e2', sourceNodeId: 'n2', targetNodeId: 'n3' },
      ],
    },
  ];
}

// ── Canvas Node component ─────────────────────────────────────────────────────
const NODE_W = 180;
const NODE_H = 72;

function CanvasNode({
  node, selected, onSelect, onRemove, onConfigure,
}: {
  node: WorkflowNode;
  selected: boolean;
  onSelect: () => void;
  onRemove: (id: string) => void;
  onConfigure: (node: WorkflowNode) => void;
}) {
  const integration = getIntegration(node.integrationId);
  const color = integration?.color ?? '#64748b';
  const typeLabel = { trigger: 'Trigger', action: 'Action', condition: 'Condition', output: 'Output' }[node.type];
  const typeDot = { trigger: 'bg-amber-400', action: 'bg-cyan-400', condition: 'bg-purple-400', output: 'bg-emerald-400' }[node.type];

  return (
    <motion.div
      drag dragMomentum={false}
      onDragEnd={(_e, info) => {
        // position is managed by parent via onDragEnd — handled in canvas
        void info;
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      style={{ left: node.x, top: node.y, width: NODE_W, position: 'absolute' }}
      className={cn(
        'group cursor-pointer select-none',
        selected && 'z-20'
      )}
      // clicking anywhere on the node body opens the config panel
      onClick={(e) => { e.stopPropagation(); onSelect(); onConfigure(node); }}
    >
      <div className={cn(
        'rounded-xl border shadow-lg transition-all duration-150',
        selected
          ? 'border-cyan-500/60 shadow-cyan-500/20 shadow-xl ring-1 ring-cyan-500/20'
          : 'border-white/[0.08] hover:border-white/[0.22] hover:shadow-lg',
        'bg-[#13182e]'
      )}>
        {/* Top accent bar */}
        <div className="h-0.5 rounded-t-xl" style={{ background: color }} />

        <div className="px-3 py-2.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}20`, border: `1px solid ${color}35` }}>
                <span style={{ color }}>{getIcon(integration?.iconName ?? 'Zap')}</span>
              </div>
              <span className="text-[11px] font-semibold text-zinc-200 leading-tight truncate max-w-[90px]">
                {node.label}
              </span>
            </div>
            {/* Only show delete on hover — clicking node body opens config */}
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(node.id); }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-all"
              title="Remove node"
            >
              <X size={11} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className={cn('w-1.5 h-1.5 rounded-full', typeDot)} />
              <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">{typeLabel}</span>
            </div>
            {node.configured ? (
              <span className="flex items-center gap-0.5 text-[9px] text-emerald-400 font-semibold">
                <CheckCircle2 size={9} /> Connected
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-[9px] text-amber-400 font-semibold animate-pulse">
                <Key size={9} /> Setup
              </span>
            )}
          </div>

          {node.operation && (
            <div className="mt-1.5 px-2 py-0.5 bg-white/[0.03] rounded-md">
              <span className="text-[9px] text-zinc-500 truncate block">{node.operation}</span>
            </div>
          )}
        </div>

        {/* Output port */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full border-2 border-zinc-600 bg-[#13182e] hover:border-cyan-400 hover:bg-cyan-400/20 transition-colors cursor-crosshair z-10" />
        {/* Input port */}
        {node.type !== 'trigger' && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-zinc-600 bg-[#13182e] hover:border-cyan-400 hover:bg-cyan-400/20 transition-colors cursor-crosshair z-10" />
        )}
      </div>
    </motion.div>
  );
}

// ── SVG Edges ─────────────────────────────────────────────────────────────────
function WorkflowEdges({ nodes, edges }: { nodes: WorkflowNode[]; edges: WorkflowEdge[] }) {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#334155" />
        </marker>
        <marker id="arrowhead-active" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#06b6d4" />
        </marker>
      </defs>
      {edges.map((edge) => {
        const src = nodeMap[edge.sourceNodeId];
        const tgt = nodeMap[edge.targetNodeId];
        if (!src || !tgt) return null;
        const x1 = src.x + NODE_W;
        const y1 = src.y + NODE_H / 2;
        const x2 = tgt.x;
        const y2 = tgt.y + NODE_H / 2;
        const cx = (x1 + x2) / 2;
        const bothConfigured = src.configured && tgt.configured;
        return (
          <g key={edge.id}>
            <path
              d={`M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`}
              stroke={bothConfigured ? '#06b6d4' : '#1e293b'}
              strokeWidth={bothConfigured ? 2 : 1.5}
              fill="none"
              strokeDasharray={bothConfigured ? 'none' : '5 4'}
              markerEnd={bothConfigured ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
              opacity={0.8}
            />
            {bothConfigured && (
              <circle r="3" fill="#06b6d4" opacity="0.6">
                <animateMotion dur="2s" repeatCount="indefinite"
                  path={`M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`} />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Integrations Drawer ───────────────────────────────────────────────────────
function IntegrationsDrawer({
  onAdd, onClose,
}: {
  onAdd: (integrationId: string) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = INTEGRATIONS.filter((i) => {
    const matchCat = category === 'All' || i.category === category;
    const q = search.toLowerCase();
    return matchCat && (i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-stretch justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="w-[420px] bg-[#0a0f1e] border-l border-white/[0.06] flex flex-col shadow-2xl"
      >
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-100">Add Node</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">{INTEGRATIONS.length} integrations available</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-200 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} autoFocus
              placeholder="Search integrations..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-8 pr-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-cyan-500/40 transition-colors" />
          </div>
        </div>

        <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all border',
                category === cat
                  ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25'
                  : 'text-zinc-500 hover:text-zinc-300 border-transparent hover:border-white/[0.06]'
              )}>
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
          {filtered.length === 0 && (
            <div className="text-center py-10 text-zinc-600 text-sm">No integrations found</div>
          )}
          {filtered.map((integration) => (
            <button key={integration.id} onClick={() => onAdd(integration.id)}
              className="group w-full flex items-start gap-3 p-3 rounded-xl border border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all text-left">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${integration.color}18`, border: `1px solid ${integration.color}30` }}>
                <span style={{ color: integration.color }}>{getIcon(integration.iconName)}</span>
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
                {integration.operations && (
                  <p className="text-[9px] text-zinc-600 mt-0.5 truncate">{integration.operations.slice(0, 3).join(' · ')}</p>
                )}
              </div>
              <Plus size={14} className="text-zinc-600 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-1" />
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(makeSeedWorkflows());
  const [activeWf, setActiveWf] = useState<Workflow>(makeSeedWorkflows()[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [configNode, setConfigNode] = useState<WorkflowNode | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodeCounter, setNodeCounter] = useState(200);
  const [wfName, setWfName] = useState(activeWf.name);
  const [editingName, setEditingName] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Load from Supabase on mount
  useEffect(() => {
    fetchWorkflows().then((data) => {
      if (data.length > 0) {
        setWorkflows(data);
        setActiveWf(data[0]);
        setWfName(data[0].name);
      }
      setLoading(false);
    });
  }, []);

  // Keep wfName in sync when switching workflows
  useEffect(() => { setWfName(activeWf.name); }, [activeWf.id]);

  const updateActive = useCallback((updated: Workflow) => {
    setActiveWf(updated);
    setWorkflows((prev: Workflow[]) => prev.map((w: Workflow) => w.id === updated.id ? updated : w));
  }, []);

  // ── Add node from drawer ────────────────────────────────────────────────────
  const handleAddNode = (integrationId: string) => {
    const integration = getIntegration(integrationId);
    if (!integration) return;
    const idx = activeWf.nodes.length;
    const newNode: WorkflowNode = {
      id: `n-${nodeCounter}`,
      integrationId,
      label: integration.name,
      type: idx === 0 ? 'trigger' : integration.defaultNodeType,
      x: 80 + (idx % 4) * 220,
      y: 160 + Math.floor(idx / 4) * 160,
      credentials: {},
      configured: false,
      operation: integration.operations?.[0],
    };
    // Auto-connect to last node
    const newEdges: WorkflowEdge[] = [...activeWf.edges];
    if (activeWf.nodes.length > 0) {
      const lastNode = activeWf.nodes[activeWf.nodes.length - 1];
      newEdges.push({ id: `e-${nodeCounter}`, sourceNodeId: lastNode.id, targetNodeId: newNode.id });
    }
    setNodeCounter((c: number) => c + 1);
    const updated = { ...activeWf, nodes: [...activeWf.nodes, newNode], edges: newEdges };
    updateActive(updated);
    setShowDrawer(false);
    // Immediately open config panel for the new node
    setConfigNode(newNode);
  };

  // ── Remove node ─────────────────────────────────────────────────────────────
  const handleRemoveNode = (nodeId: string) => {
    const updated = {
      ...activeWf,
      nodes: activeWf.nodes.filter((n: WorkflowNode) => n.id !== nodeId),
      edges: activeWf.edges.filter((e: WorkflowEdge) => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId),
    };
    updateActive(updated);
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  // ── Save credentials from config panel ─────────────────────────────────────
  const handleSaveNodeConfig = (updatedNode: WorkflowNode) => {
    const updated = {
      ...activeWf,
      nodes: activeWf.nodes.map((n: WorkflowNode) => n.id === updatedNode.id ? updatedNode : n),
    };
    updateActive(updated);
    setConfigNode(null);
  };

  // ── Save workflow to Supabase ───────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    const toSave = { ...activeWf, name: wfName };
    const result = await saveWorkflow(toSave);
    setSaving(false);
    if (result) {
      updateActive(result);
      setSaveMsg({ ok: true, text: 'Workflow saved' });
    } else {
      // Optimistic local save
      updateActive(toSave);
      setSaveMsg({ ok: true, text: 'Saved locally (Supabase table not set up yet)' });
    }
    setTimeout(() => setSaveMsg(null), 3000);
  };

  // ── Execute workflow ────────────────────────────────────────────────────────
  const handleRun = async () => {
    setRunning(true);
    setRunResult(null);
    const result = await executeWorkflow(activeWf);
    setRunning(false);
    setRunResult(result);
    if (result.success) {
      updateActive({ ...activeWf, runs: activeWf.runs + 1, last_run: 'Just now' });
    }
    setTimeout(() => setRunResult(null), 5000);
  };

  // ── New workflow ────────────────────────────────────────────────────────────
  const handleNewWorkflow = () => {
    const now = new Date().toISOString();
    const wf: Workflow = {
      id: `local-${Date.now()}`,
      name: `Workflow ${workflows.length + 1}`,
      nodes: [], edges: [], active: false, runs: 0,
      created_at: now, updated_at: now,
    };
    setWorkflows((prev: Workflow[]) => [wf, ...prev]);
    setActiveWf(wf);
    setWfName(wf.name);
    setShowDrawer(true);
  };

  // ── Delete workflow ─────────────────────────────────────────────────────────
  const handleExportN8n = () => {
    const n8nJson = exportToN8n(activeWf);
    downloadJsonFile(`${activeWf.name.replace(/\s+/g, '-').toLowerCase()}-n8n.json`, n8nJson);
    setSaveMsg({ ok: true, text: 'n8n workflow downloaded — import this file in n8n or re-upload here' });
    setTimeout(() => setSaveMsg(null), 4000);
  };

  const handleDownloadSample = () => {
    downloadJsonFile('medical-spa-sample-n8n.json', SAMPLE_MEDICAL_SPA_N8N);
    setSaveMsg({ ok: true, text: 'Sample n8n workflow downloaded' });
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const handleImportN8n = async (file: File) => {
    try {
      const json = await readJsonFile(file);
      const imported = importFromN8n(json);
      if (!imported) {
        setSaveMsg({ ok: false, text: 'Invalid n8n workflow JSON' });
        return;
      }
      setWorkflows((prev) => [imported, ...prev]);
      setActiveWf(imported);
      setWfName(imported.name);
      setSaveMsg({ ok: true, text: `Imported "${imported.name}" (${imported.nodes.length} nodes)` });
    } catch {
      setSaveMsg({ ok: false, text: 'Could not parse JSON file' });
    }
    setTimeout(() => setSaveMsg(null), 4000);
  };

  const handleLoadSampleOnCanvas = () => {
    const imported = importFromN8n(SAMPLE_MEDICAL_SPA_N8N, `local-${Date.now()}`);
    if (!imported) return;
    setWorkflows((prev) => [imported, ...prev]);
    setActiveWf(imported);
    setWfName(imported.name);
    setSaveMsg({ ok: true, text: 'Sample Medical Spa workflow loaded' });
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const handleDeleteWorkflow = async (id: string) => {
    await deleteWorkflow(id);
    const remaining = workflows.filter((w: Workflow) => w.id !== id);
    setWorkflows(remaining);
    if (activeWf.id === id) {
      const next = remaining[0] ?? makeSeedWorkflows()[0];
      setActiveWf(next);
      setWfName(next.name);
    }
  };

  const unconfiguredCount = activeWf.nodes.filter((n: WorkflowNode) => !n.configured).length;

  return (
    <div className="flex flex-col h-full space-y-0 animate-in fade-in duration-500">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Automation Workflows</h1>
          <p className="text-slate-400 text-sm mt-0.5">n8n-powered automations · {INTEGRATIONS.length}+ integrations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#FF6C37]/5 border border-[#FF6C37]/20 rounded-lg text-[10px] font-bold text-[#FF6C37] uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6C37] animate-pulse" /> n8n
          </div>
          <button onClick={handleNewWorkflow}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-colors shadow-lg shadow-cyan-500/20">
            <Plus size={15} /> New Workflow
          </button>
        </div>
      </div>

      <div className="flex gap-5" style={{ height: 'calc(100vh - 220px)', minHeight: 520 }}>
        {/* Sidebar */}
        <div className="w-52 flex-shrink-0 flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 px-1">Workflows</p>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="animate-spin text-zinc-600" size={18} /></div>
            ) : (
              workflows.map((wf: Workflow) => (
                <div key={wf.id}
                  className={cn(
                    'group relative px-3 py-2.5 rounded-xl border cursor-pointer transition-all',
                    activeWf.id === wf.id
                      ? 'bg-cyan-500/10 border-cyan-500/20'
                      : 'border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.02]'
                  )}
                  onClick={() => { setActiveWf(wf); setWfName(wf.name); setSelectedNodeId(null); }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-zinc-200 truncate max-w-[110px]">{wf.name}</span>
                    <div className="flex items-center gap-1.5">
                      <div className={cn('w-1.5 h-1.5 rounded-full', wf.active ? 'bg-emerald-400' : 'bg-zinc-600')} />
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteWorkflow(wf.id); }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-all">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-600">
                    <span>{wf.nodes.length} nodes</span>
                    <span>·</span>
                    <span>{wf.runs} runs</span>
                  </div>
                  {wf.last_run && (
                    <p className="text-[9px] text-zinc-700 mt-0.5 truncate">Last: {wf.last_run}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Canvas area */}
        <div className="flex-1 flex flex-col gap-0 min-w-0">
          {/* Canvas toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1224] border border-white/[0.06] rounded-t-2xl border-b-0">
            <div className="flex items-center gap-3">
              {editingName ? (
                <input
                  autoFocus
                  value={wfName}
                  onChange={(e) => setWfName(e.target.value)}
                  onBlur={() => { setEditingName(false); updateActive({ ...activeWf, name: wfName }); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { setEditingName(false); updateActive({ ...activeWf, name: wfName }); } }}
                  className="bg-transparent border-b border-cyan-500/50 text-sm font-semibold text-zinc-100 outline-none px-1 w-48"
                />
              ) : (
                <button onClick={() => setEditingName(true)}
                  className="flex items-center gap-2 text-sm font-semibold text-zinc-200 hover:text-white transition-colors group">
                  <div className={cn('w-2 h-2 rounded-full', activeWf.active ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600')} />
                  {wfName}
                  <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400 transition-colors">click to rename</span>
                </button>
              )}
              {unconfiguredCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  <Key size={10} /> {unconfiguredCount} node{unconfiguredCount > 1 ? 's' : ''} need credentials
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <input
                ref={importInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImportN8n(file);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => importInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 transition-all"
                title="Import n8n workflow JSON"
              >
                <Upload size={12} /> Import
              </button>
              <button
                type="button"
                onClick={handleExportN8n}
                disabled={activeWf.nodes.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 transition-all disabled:opacity-40"
                title="Export as n8n-compatible JSON"
              >
                <Download size={12} /> Export n8n
              </button>
              <button
                type="button"
                onClick={handleDownloadSample}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6C37]/10 border border-[#FF6C37]/25 rounded-lg text-[11px] font-semibold text-[#FF6C37] hover:bg-[#FF6C37]/20 transition-all"
              >
                <FileJson size={12} /> Sample JSON
              </button>
              <button
                type="button"
                onClick={handleLoadSampleOnCanvas}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 transition-all"
              >
                Load Sample
              </button>
              <button onClick={() => setShowDrawer(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 hover:border-white/[0.14] transition-all">
                <Plus size={13} /> Add Node
              </button>
              <button
                onClick={() => updateActive({ ...activeWf, active: !activeWf.active })}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border',
                  activeWf.active
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-white/[0.03] border-white/[0.08] text-zinc-500 hover:text-zinc-300'
                )}>
                {activeWf.active ? '● Active' : '○ Inactive'}
              </button>
              <div className="w-px h-5 bg-white/[0.06]" />
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 transition-all disabled:opacity-50">
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                Save
              </button>
              <button onClick={handleRun} disabled={running || activeWf.nodes.length === 0}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20">
                {running ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                Execute
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div
            ref={canvasRef}
            className="flex-1 relative bg-[#080c18] border border-white/[0.06] rounded-b-2xl overflow-hidden"
            onClick={() => setSelectedNodeId(null)}
          >
            {/* Dot grid */}
            <div className="absolute inset-0 opacity-[0.12]"
              style={{ backgroundImage: 'radial-gradient(#334155 0.8px, transparent 0.8px)', backgroundSize: '22px 22px' }} />

            {/* Status toast */}
            <AnimatePresence>
              {(saveMsg || runResult) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    'absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold border shadow-xl',
                    (saveMsg?.ok || runResult?.success)
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/15 border-red-500/30 text-red-300'
                  )}>
                  {(saveMsg?.ok || runResult?.success) ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  {saveMsg?.text || runResult?.message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state */}
            {activeWf.nodes.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <Zap size={28} className="text-zinc-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-zinc-400">Empty workflow</p>
                  <p className="text-[11px] text-zinc-600 mt-1">Add a trigger node to get started</p>
                </div>
                <button onClick={() => setShowDrawer(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl text-sm font-semibold hover:bg-cyan-500/20 transition-colors">
                  <Plus size={14} /> Browse {INTEGRATIONS.length} Integrations
                </button>
              </div>
            )}

            {/* Edges + Nodes */}
            <div className="absolute inset-0">
              <WorkflowEdges nodes={activeWf.nodes} edges={activeWf.edges} />
              <AnimatePresence>
                {activeWf.nodes.map((node: WorkflowNode) => (
                  <React.Fragment key={node.id}>
                    <CanvasNode
                      node={node}
                      selected={selectedNodeId === node.id}
                      onSelect={() => setSelectedNodeId(node.id)}
                      onRemove={handleRemoveNode}
                      onConfigure={(n) => setConfigNode(n)}
                    />
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </div>

            {/* Bottom-right: node count */}
            <div className="absolute bottom-3 left-4 flex items-center gap-3 text-[10px] text-zinc-700">
              <span>{activeWf.nodes.length} nodes</span>
              <span>·</span>
              <span>{activeWf.edges.length} connections</span>
              {activeWf.runs > 0 && <><span>·</span><span>{activeWf.runs} executions</span></>}
            </div>
          </div>
        </div>
      </div>

      {/* Integrations drawer */}
      <AnimatePresence>
        {showDrawer && <IntegrationsDrawer onAdd={handleAddNode} onClose={() => setShowDrawer(false)} />}
      </AnimatePresence>

      {/* Node config panel */}
      <AnimatePresence>
        {configNode && (
          <NodeConfigPanel
            node={configNode}
            onSave={handleSaveNodeConfig}
            onClose={() => setConfigNode(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
