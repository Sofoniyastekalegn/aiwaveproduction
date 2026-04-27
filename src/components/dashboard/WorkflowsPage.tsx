import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Zap, Settings, ArrowRight, Database, Mail, Phone, MessageSquare, ExternalLink, Activity, Cloud } from 'lucide-react';
import { cn } from '../../lib/utils';
import { triggerN8nWorkflow } from '../../services/n8nService';

const NODES = [
  { id: '1', type: 'trigger', label: 'Incoming Call', icon: <Phone size={18} />, pos: { x: 50, y: 150 } },
  { id: '2', type: 'action', label: 'AI Voice Agent', icon: <Zap size={18} />, pos: { x: 300, y: 150 } },
  { id: '3', type: 'branch', label: 'Booking Success?', icon: <Settings size={18} />, pos: { x: 550, y: 150 } },
  { id: '4', type: 'action', label: 'Send SMS', icon: <MessageSquare size={18} />, pos: { x: 800, y: 50 } },
  { id: '5', type: 'action', label: 'Update CRM', icon: <Database size={18} />, pos: { x: 800, y: 250 } },
];

export default function WorkflowsPage() {
  const [isTriggeing, setIsTriggering] = useState(false);
  const [lastTriggerResult, setLastTriggerResult] = useState<any>(null);

  const handleTestTrigger = async () => {
    setIsTriggering(true);
    const result = await triggerN8nWorkflow({
      agentId: 'workflow-test-01',
      eventType: 'lead_captured',
      data: {
        test: true,
        source: 'AIWave Dashboard'
      }
    });
    setLastTriggerResult(result);
    setIsTriggering(false);
    setTimeout(() => setLastTriggerResult(null), 5000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Automation Workflows</h1>
          <p className="text-slate-400">Design self-healing logic for your AI agents via n8n.</p>
        </div>
        <div className="flex gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#FF6C37]/5 border border-[#FF6C37]/20 rounded-lg text-[10px] font-bold text-[#FF6C37] uppercase tracking-widest">
            <Cloud size={14} /> n8n Cloud Sync: Enabled
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} /> New Workflow
          </button>
        </div>
      </div>

      <div className="relative h-[600px] w-full bg-slate-950 rounded-[32px] border border-slate-800 overflow-hidden group">
        {/* Dot Grid Background */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#22d3ee 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="absolute top-6 left-6 z-10 flex gap-2">
           <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white flex items-center gap-2">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             Flow: "Medical Spa Appointment" - ACTIVE
           </div>
        </div>

        {/* Workflow Nodes */}
        <div className="relative w-full h-full p-10">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path d="M150,185 L300,185" stroke="#1e293b" strokeWidth="2" fill="none" />
            <path d="M400,185 L550,185" stroke="#1e293b" strokeWidth="2" fill="none" />
            <path d="M650,165 Q725,165 725,100 L800,100" stroke="#1e293b" strokeWidth="2" fill="none" />
            <path d="M650,205 Q725,205 725,270 L800,270" stroke="#1e293b" strokeWidth="2" fill="none" />
          </svg>

          {NODES.map((node) => (
            <motion.div
              key={node.id}
              drag
              dragMomentum={false}
              style={{ left: node.pos.x, top: node.pos.y }}
              className="absolute w-44 bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl cursor-move hover:border-cyan-500/50 transition-colors shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn(
                  "p-2 rounded-lg",
                  node.type === 'trigger' ? "bg-emerald-500/20 text-emerald-400" :
                  node.type === 'action' ? "bg-cyan-500/20 text-cyan-400" : "bg-purple-500/20 text-purple-400"
                )}>
                  {node.icon}
                </div>
                <span className="text-xs font-bold text-white">{node.label}</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-full bg-cyan-500/30"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-6 right-6 flex items-center gap-4">
          <AnimatePresence>
            {lastTriggerResult && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest",
                  lastTriggerResult.success ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                )}
              >
                {lastTriggerResult.success ? 'Workflow Triggered' : 'Trigger Failed (Check Config)'}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex gap-2">
            <button className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors">
              <Settings size={20} />
            </button>
            <button 
              onClick={handleTestTrigger}
              disabled={isTriggeing}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {isTriggeing ? <Activity size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
              Test n8n Flow
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4">Live Execution Log</h3>
          <div className="space-y-3 font-mono text-[10px]">
            {[
              { time: '17:42:01', msg: 'Trigger: Incoming call from +1...5829', status: 'success' },
              { time: '17:42:05', msg: 'Calling ElevenLabs API for Voice synthesis', status: 'info' },
              { time: '17:43:12', msg: 'Booking JSON payload generated', status: 'success' },
              { time: '17:43:14', msg: 'n8n Webhook: GHL Integration Active', status: 'success' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 p-2 bg-black/20 rounded border border-white/5">
                <span className="text-slate-500">{log.time}</span>
                <span className={cn(
                  log.status === 'success' ? "text-emerald-400" : "text-cyan-400"
                )}>{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center items-center text-center space-y-4">
           <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400">
             <Zap size={32} />
           </div>
           <div>
             <h4 className="text-white font-bold">Autopilot Mode</h4>
             <p className="text-slate-500 text-sm">Self-learning agents update these flows automatically based on successful outcomes.</p>
           </div>
           <button className="btn-secondary py-2 px-6 text-xs">Configure AI Learning</button>
        </div>
      </div>
    </div>
  );
}
