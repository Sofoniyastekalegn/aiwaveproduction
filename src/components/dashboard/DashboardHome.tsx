import React from 'react';
import { 
  PhoneCall, Users, CalendarCheck, DollarSign, 
  TrendingUp, Activity, Zap, Play, ArrowRight,
  Clock, CheckCircle2, AlertCircle, Workflow
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const CHART_DATA = [
  { time: '00:00', calls: 12 }, { time: '04:00', calls: 8 },
  { time: '08:00', calls: 45 }, { time: '12:00', calls: 110 },
  { time: '16:00', calls: 85 }, { time: '20:00', calls: 32 },
  { time: '23:59', calls: 15 },
];

const AGENTS = [
  { img: '🏠', name: 'Leads Qualifier', industry: 'Real Estate', status: 'Live', efficiency: '94%', calls: 156, color: 'cyan' },
  { img: '✂️', name: 'Barber Receptionist', industry: 'Barber Shop', status: 'Live', efficiency: '91%', calls: 67, color: 'blue' },
  { img: '🏥', name: 'Front Desk Agent', industry: 'Medical Spa', status: 'Live', efficiency: '98%', calls: 124, color: 'emerald' },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center ">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">System Overview</h1>
          <p className="text-slate-400 font-medium">Your global AI workforce is performing at peak efficiency.</p>
        </div>
        <div className="flex gap-4">
           <div className="hidden lg:flex items-center gap-3 px-4 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Live Ops Node: US-EAST-1</span>
           </div>
           <button className="btn-primary flex items-center gap-2">
             <Zap size={18} fill="currentColor" /> Deploy Agent
           </button>
        </div>
      </div>

      {/* Integrations & n8n Workflows */}
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl flex flex-col justify-between">
           <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 bg-[#FF6C37]/10 rounded-xl flex items-center justify-center text-[#FF6C37]">
                 <Workflow size={20} />
              </div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 rounded-full">Connected</span>
           </div>
           <div>
              <h4 className="text-white font-bold text-sm">n8n Workflow Hub</h4>
              <p className="text-[10px] text-slate-500 mt-1">12 Active Automations</p>
           </div>
           <div className="mt-4 flex gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 border border-white/5 hover:border-[#FF6C37]/50 transition-colors cursor-pointer">
                 <Zap size={14} />
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 border border-white/5 hover:border-[#FF6C37]/50 transition-colors cursor-pointer">
                 <Activity size={14} />
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 border border-white/5 hover:border-[#FF6C37]/50 transition-colors cursor-pointer">
                 <Clock size={14} />
              </div>
           </div>
        </div>

        <div className="lg:col-span-3 bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl overflow-hidden relative group">
           <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-white font-bold text-sm">Live n8n API Stream</h4>
                <p className="text-[10px] text-slate-500">Processing real-time webhooks from your Agency stack.</p>
              </div>
              <button className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">View API Logs</button>
           </div>
           <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { name: 'GHL-Lead-Sync', status: 'Success', time: '1s ago' },
                { name: 'Calendar-Push', status: 'Success', time: '12s ago' },
                { name: 'Stripe-Invoice', status: 'Success', time: '1m ago' },
                { name: 'CRM-Update', status: 'Success', time: '3m ago' },
                { name: 'Slack-Notify', status: 'Success', time: '5m ago' },
              ].map((job, i) => (
                <div key={i} className="min-w-[140px] p-3 bg-slate-950/50 border border-slate-800 rounded-xl flex flex-col gap-2">
                   <div className="flex justify-between items-center">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                     <span className="text-[8px] font-bold text-slate-600 uppercase">{job.time}</span>
                   </div>
                   <p className="text-[10px] font-bold text-slate-300 truncate">{job.name}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Calls', value: '1,284', trend: '+12%', icon: <PhoneCall />, color: 'cyan' },
          { label: 'Active Agents', value: '12', trend: 'Healthy', icon: <Users />, color: 'blue' },
          { label: 'Bookings', value: '452', trend: '+18%', icon: <CalendarCheck />, color: 'emerald' },
          { label: 'Revenue', value: '$24,400', trend: '+24%', icon: <DollarSign />, color: 'purple' },
        ].map((card, i) => (
          <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl group hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={cn(
                "p-3 rounded-xl transition-colors",
                card.color === 'cyan' ? "bg-cyan-500/10 text-cyan-400" :
                card.color === 'blue' ? "bg-blue-500/10 text-blue-400" :
                card.color === 'emerald' ? "bg-emerald-500/10 text-emerald-400" : "bg-purple-500/10 text-purple-400"
              )}>
                {card.icon}
              </div>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <TrendingUp size={12} /> {card.trend}
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cluster Load / Load Balancing Visualization */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[32px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Neural Cluster Load</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 rounded-full">Balanced</span>
            </div>
          </div>
          <div className="space-y-6">
            {[
              { id: 'Node-1 (US-East)', load: 82, status: 'High' },
              { id: 'Node-2 (EU-West)', load: 45, status: 'Optimal' },
              { id: 'Node-3 (Asia-SE)', load: 12, status: 'Idle' },
            ].map((node) => (
              <div key={node.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-400">{node.id}</span>
                  <span className={cn(
                    "text-[10px] font-mono",
                    node.load > 80 ? "text-amber-400" : "text-emerald-400"
                  )}>{node.load}% Capacity</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${node.load}%` }}
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      node.load > 80 ? "bg-amber-500" : "bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800/50">
             <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
               <span>Total Cloud Memory</span>
               <span className="text-white">12.4 TB / 20 TB</span>
             </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[32px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white">Live Call Traffic</h3>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-slate-800 rounded-lg text-[10px] font-bold text-slate-400">Total: 842 mins</div>
              <select className="bg-slate-800 text-slate-300 text-[10px] font-bold px-3 py-1 rounded-lg border border-slate-700 outline-none uppercase tracking-widest">
                <option>Today</option>
                <option>Yesterday</option>
              </select>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="calls" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorCalls)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Feed */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[32px]">
          <h3 className="text-lg font-bold text-white mb-6">Live Activity</h3>
          <div className="space-y-6">
            {[
              { type: 'call', msg: 'Call ended with James C.', result: 'Success', time: 'Just now' },
              { type: 'booking', msg: 'Dental appt booked: May 4', result: 'New', time: '2m ago' },
              { type: 'alert', msg: 'Agent threshold reached', result: 'Notice', time: '5m ago' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 relative">
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                  item.type === 'call' ? "bg-cyan-500/10 text-cyan-400" :
                  item.type === 'booking' ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                )}>
                   {item.type === 'call' ? <PhoneCall size={18} /> : item.type === 'booking' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                </div>
                <div>
                   <p className="text-sm font-bold text-white">{item.msg}</p>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-slate-500">{item.time}</span>
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded uppercase font-black tracking-tighter",
                        item.result === 'Success' ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"
                      )}>{item.result}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-slate-950/50 rounded-2xl border border-slate-800 relative overflow-hidden group border-dashed">
             <div className="relative z-10">
               <h4 className="text-white font-black text-xs uppercase tracking-widest mb-1">Workflow Insight</h4>
               <p className="text-[10px] text-slate-500 leading-relaxed mb-4">Your Dental Clinic agent is missing a "Follow-up SMS" node. Adding it could improve retention by <span className="text-cyan-400">14%</span>.</p>
               <button className="text-cyan-400 text-xs font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                 Apply Optimization <ArrowRight size={14} />
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Agents Row */}
      <div className="grid md:grid-cols-3 gap-6">
        {AGENTS.map((agent, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl group hover:border-cyan-500/30 transition-all">
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                   <div className="text-3xl p-3 bg-slate-950 rounded-2xl group-hover:scale-110 transition-transform">{agent.img}</div>
                   <div>
                      <h4 className="font-bold text-white leading-tight">{agent.name}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{agent.industry}</p>
                   </div>
                </div>
                <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                   <Activity size={16} />
                </button>
             </div>
             <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter mb-1">Efficiency</p>
                  <p className="text-lg font-black text-white">{agent.efficiency}</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter mb-1">Calls (24h)</p>
                  <p className="text-lg font-black text-white">{agent.calls}</p>
                </div>
             </div>
             <button className="w-full py-2.5 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition-all">
               Manage Flow
             </button>
          </div>
        ))}
      </div>
    </div>
  );
}
