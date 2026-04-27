import React from 'react';
import { 
  BarChart3, Users, Bot, PhoneOutgoing, 
  Settings, LayoutDashboard, Calendar, 
  Workflow, History, Zap, MessageSquare, 
  ChevronRight, LogOut, Bell, Waves, Share2,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';

const MENU_ITEMS = [
  { group: 'Main', items: [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'agents', label: 'AI Agents', icon: <Bot size={18} /> },
    { id: 'campaigns', label: 'Campaigns', icon: <Zap size={18} /> },
    { id: 'contacts', label: 'Contacts', icon: <Users size={18} /> },
    { id: 'history', label: 'Call History', icon: <History size={18} /> },
  ]},
  { group: 'Automation', items: [
    { id: 'workflows', label: 'Workflows', icon: <Workflow size={18} /> },
    { id: 'integrations', label: 'Integrations', icon: <Share2 size={18} /> },
  ]},
  { group: 'Intelligence', items: [
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ]}
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  return (
    <aside className="w-64 glass-dark border-r border-white/5 h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <div 
          className="flex items-center gap-3 mb-8 px-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onLogout()}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
             <Waves className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">AIWave <span className="text-cyan-400">Agency</span></span>
        </div>

        <nav className="space-y-8">
          {MENU_ITEMS.map((group) => (
            <div key={group.group}>
              <h4 className="text-[10px] uppercase font-bold text-slate-600 tracking-widest mb-4 px-3">
                {group.group}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group border border-transparent",
                      activeTab === item.id 
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" 
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {activeTab === item.id && <div className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all border border-transparent"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Site</span>
        </button>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
        
        <div className="pt-4 border-t border-white/5">
           <div className="flex items-center gap-3 px-3 py-2">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border border-white/10" />
             <div className="flex-1 overflow-hidden">
               <p className="text-sm font-bold text-white truncate">Sofoniyas</p>
               <p className="text-[10px] text-slate-500 truncate">Pro Account</p>
             </div>
           </div>
        </div>
      </div>
    </aside>
  );
}
