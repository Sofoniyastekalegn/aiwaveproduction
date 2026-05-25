import React, { useState, useEffect } from 'react';
import { Search, Plus, Mail, Phone, Trash2, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { loadJson, saveJson } from '../../lib/dashboardStorage';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Converted' | 'Lead' | 'Meeting Set' | 'Lost';
  tags: string[];
  memory: string;
}

const SEED: Contact[] = [
  { id: '1', name: 'Jessica Miller', email: 'jess.m@example.com', phone: '+1 (555) 0123', status: 'Converted', tags: ['Medical Spa', 'High Value'], memory: 'Prefers afternoon appointments, interested in Botox series.' },
  { id: '2', name: 'Robert Wilson', email: 'rwilson@outlook.com', phone: '+1 (555) 4567', status: 'Lead', tags: ['Real Estate'], memory: 'Looking for 3-bed in Bole area, budget ~80k.' },
  { id: '3', name: 'Sarah Chen', email: 'sarah.c@tech.io', phone: '+1 (555) 8901', status: 'Meeting Set', tags: ['Dental', 'Referral'], memory: 'Anxious about needles, requires extra numbing gel.' },
  { id: '4', name: 'Mike Thompson', email: 'mike@construction.biz', phone: '+1 (555) 2345', status: 'Lost', tags: ['Barber Shop'], memory: 'Classic fade fan, was unhappy with previous wait times.' },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(() => loadJson('contacts', SEED));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', status: 'Lead' as Contact['status'], memory: '' });

  useEffect(() => {
    saveJson('contacts', contacts);
  }, [contacts]);

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setContacts((prev) => [
      { id: `ct-${Date.now()}`, ...form, tags: ['Manual'], memory: form.memory || 'No AI context yet.' },
      ...prev,
    ]);
    setForm({ name: '', email: '', phone: '', status: 'Lead', memory: '' });
    setShowForm(false);
  };

  const removeContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const importCsv = () => {
    const extra: Contact = {
      id: `csv-${Date.now()}`,
      name: 'Imported Lead',
      email: 'import@example.com',
      phone: '+1 (555) 0000',
      status: 'Lead',
      tags: ['CSV Import'],
      memory: 'Imported via CSV — assign to campaign.',
    };
    setContacts((prev) => [extra, ...prev]);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">CRM Contacts</h1>
          <p className="text-slate-400">Leads for campaigns and AI agent memory — saved in your browser.</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={importCsv} className="btn-secondary flex items-center gap-2">Import CSV</button>
          <button type="button" onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2"><Plus size={18} /> New Contact</button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex items-center gap-2 px-4 py-3 bg-slate-800/40 border border-slate-700 rounded-xl text-slate-300 text-sm"
        >
          {['All', 'Lead', 'Meeting Set', 'Converted', 'Lost'].map((s) => (
            <option key={s} value={s}>{s === 'All' ? 'All statuses' : s}</option>
          ))}
        </select>
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
            {filtered.map((contact) => (
              <tr key={contact.id} className="group hover:bg-slate-800/20 transition-colors">
                <td className="p-4 pl-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-sm font-bold text-white border border-slate-700">
                      {contact.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="font-bold text-white text-sm">{contact.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400 text-xs"><Mail size={12} /> {contact.email}</div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs"><Phone size={12} /> {contact.phone}</div>
                  </div>
                </td>
                <td className="p-4 text-xs font-medium">
                  <span className={cn(
                    'px-2 py-1 rounded-full',
                    contact.status === 'Converted' ? 'bg-emerald-500/10 text-emerald-400' :
                    contact.status === 'Lead' ? 'bg-cyan-500/10 text-cyan-400' :
                    contact.status === 'Meeting Set' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700 text-slate-400'
                  )}>{contact.status}</span>
                </td>
                <td className="p-4">
                  <p className="text-[10px] text-slate-500 max-w-[200px] leading-relaxed italic line-clamp-2">&quot;{contact.memory}&quot;</p>
                </td>
                <td className="p-4">
                  <div className="flex gap-2 flex-wrap">
                    {contact.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-right pr-8">
                  <button type="button" onClick={() => removeContact(contact.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center py-12 text-slate-500 text-sm">No contacts match your search.</p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <form className="bg-[#111118] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md space-y-3" onClick={(e) => e.stopPropagation()} onSubmit={addContact}>
            <div className="flex justify-between">
              <h3 className="text-lg font-bold text-white">New Contact</h3>
              <button type="button" onClick={() => setShowForm(false)}><X className="text-zinc-500" size={18} /></button>
            </div>
            <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white" />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white" />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white" />
            <textarea placeholder="AI memory notes" value={form.memory} onChange={(e) => setForm({ ...form, memory: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white h-20" />
            <button type="submit" className="w-full py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl">Add Contact</button>
          </form>
        </div>
      )}
    </div>
  );
}
