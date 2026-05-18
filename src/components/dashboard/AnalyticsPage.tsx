import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { Download, Calendar, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const DATA = [
  { name: 'Mon', calls: 400, conv: 240 },
  { name: 'Tue', calls: 300, conv: 139 },
  { name: 'Wed', calls: 200, conv: 980 },
  { name: 'Thu', calls: 278, conv: 390 },
  { name: 'Fri', calls: 189, conv: 480 },
  { name: 'Sat', calls: 239, conv: 380 },
  { name: 'Sun', calls: 349, conv: 430 },
];

const COLORS = ['#22d3ee', '#3b82f6', '#10b981', '#f59e0b'];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">System Analytics</h1>
          <p className="text-slate-400">Granular performance data across your entire AI workforce.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors">
            <Calendar size={18} /> <span className="text-sm">Apr 1 - Apr 27</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download size={18} /> Export Results
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Calls', value: '4,284', trend: '+12.5%', isUp: true },
          { label: 'Success Rate', value: '94.2%', trend: '+3.1%', isUp: true },
          { label: 'Minutes Saved', value: '12,400', trend: '+24%', isUp: true },
          { label: 'Cost Avoided', value: '$18.4k', trend: '-2.4%', isUp: false },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{stat.label}</p>
            <div className="flex justify-between items-end">
               <p className="text-2xl font-bold text-white">{stat.value}</p>
               <div className={cn(
                 "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full",
                 stat.isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
               )}>
                 {stat.isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                 {stat.trend}
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 p-8 rounded-[32px]">
          <h3 className="text-lg font-bold text-white mb-8">Performance Over Time</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="calls" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorCalls)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[32px]">
          <h3 className="text-lg font-bold text-white mb-8">Call Outcomes</h3>
          <div className="h-[250px] w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Booked', value: 400 },
                    { name: 'Follow-up', value: 300 },
                    { name: 'Transferred', value: 100 },
                    { name: 'Other', value: 200 },
                  ]}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
             {['Booked', 'Follow-up', 'Transferred', 'Other'].map((label, i) => (
               <div key={i} className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                   <span className="text-slate-400">{label}</span>
                 </div>
                 <span className="text-white font-bold">{[40, 30, 10, 20][i]}%</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
