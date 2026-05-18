import React from 'react';
import { Search, Plus, Filter, MoreVertical, Mail, Phone, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

const CONTACTS = [
  { id: 1, name: 'Jessica Miller', email: 'jess.m@example.com', phone: '+1 (555) 0123', status: 'Converted', tags: ['Medical Spa', 'High Value'], memory: 'Prefers afternoon appointments, interested in Botox series.' },
  { id: 2, name: 'Robert Wilson', email: 'rwilson@outlook.com', phone: '+1 (555) 4567', status: 'Lead', tags: ['Real Estate'], memory: 'Looking for 3-bed in Bole area, budget ~80k.' },
  { id: 3, name: 'Sarah Chen', email: 'sarah.c@tech.io', phone: '+1 (555) 8901', status: 'Meeting Set', tags: ['Dental', 'Referral'], memory: 'Anxious about needles, requires extra numbing gel.' },
  { id: 4, name: 'Mike Thompson', email: 'mike@construction.biz', phone: '+1 (555) 2345', status: 'Lost', tags: ['Barber Shop'], memory: 'Classic fade fan, was unhappy with previous wait times.' },
];

export default function ContactsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">CRM Contacts</h1>
          <p className="text-slate-400">Manage your leads and automated outreach targets.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">Import CSV</button>
          <button className="btn-primary flex items-center gap-2"><Plus size={18} /> New Contact</button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search contacts..." 
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-cyan-500/50 transition-colors" 
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-slate-800/40 border border-slate-700 rounded-xl text-slate-300">
          <Filter size={18} />
          <span className="text-sm">Filter</span>
        </button>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/20">
              <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest pl-8">Name</th>
              <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Contact</th>
              <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Status</th>
              <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">AI Context Memory</th>
              <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Tags</th>
              <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest text-right pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {CONTACTS.map((contact) => (
              <tr key={contact.id} className="group hover:bg-slate-800/20 transition-colors">
                <td className="p-4 pl-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-sm font-bold text-white border border-slate-700">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-bold text-white text-sm">{contact.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Mail size={12} /> {contact.email}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Phone size={12} /> {contact.phone}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-xs font-medium">
                  <span className={cn(
                    "px-2 py-1 rounded-full",
                    contact.status === 'Converted' ? "bg-emerald-500/10 text-emerald-400" :
                    contact.status === 'Lead' ? "bg-cyan-500/10 text-cyan-400" :
                    contact.status === 'Meeting Set' ? "bg-blue-500/10 text-blue-400" : "bg-slate-700 text-slate-400"
                  )}>
                    {contact.status}
                  </span>
                </td>
                <td className="p-4">
                  <p className="text-[10px] text-slate-500 max-w-[200px] leading-relaxed italic line-clamp-2">
                    "{contact.memory}"
                  </p>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {contact.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-right pr-8">
                  <button className="p-2 text-slate-500 hover:text-white transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
