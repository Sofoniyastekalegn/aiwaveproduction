import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/landing/Hero';
import VoiceDemo from './components/landing/VoiceDemo';
import VideoSection from './components/landing/VideoSection';
import BookingWidget from './components/landing/BookingWidget';
import DemoSection from './components/landing/DemoSection';
import Pricing from './components/landing/Pricing';
import Sidebar from './components/dashboard/Sidebar';

// Lazy load dashboard components for speed
const DashboardHome = lazy(() => import('./components/dashboard/DashboardHome'));
const AgentsPage = lazy(() => import('./components/dashboard/AgentsPage'));
const WorkflowsPage = lazy(() => import('./components/dashboard/WorkflowsPage'));
const ContactsPage = lazy(() => import('./components/dashboard/ContactsPage'));
const CampaignsPage = lazy(() => import('./components/dashboard/CampaignsPage'));
const CallHistoryPage = lazy(() => import('./components/dashboard/CallHistoryPage'));
const IntegrationsPage = lazy(() => import('./components/dashboard/IntegrationsPage'));
const AnalyticsPage = lazy(() => import('./components/dashboard/AnalyticsPage'));
const SettingsPage = lazy(() => import('./components/dashboard/SettingsPage'));

import { Waves, Bot, Zap, Shield, Target, ArrowRight, MessageSquare, Phone, Calendar, Mail, Workflow, Activity, Search, Bell, Loader2 } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const [dashboardTab, setDashboardTab] = useState('dashboard');

  const industries = [
    { name: 'Medical Spas', icon: <Bot className="w-8 h-8" />, desc: 'Handle Botox bookings and follow-ups.' },
    { name: 'Dental Clinics', icon: <Target className="w-8 h-8" />, desc: 'Automate appointment setting and patient reminders.' },
    { name: 'Barber Shops', icon: <Zap className="w-8 h-8" />, desc: 'Manage walk-ins and direct seat bookings.' },
    { name: 'Real Estate', icon: <Target className="w-8 h-8" />, desc: 'Qualify leads and schedule property tours.' },
  ];

  if (isDashboard) {
    return (
      <div className="flex bg-[#020617] text-white min-h-screen">
        <Sidebar 
          activeTab={dashboardTab} 
          setActiveTab={(tab) => {
            setDashboardTab(tab);
            navigate(`/dashboard/${tab}`);
          }} 
          onLogout={() => navigate('/')} 
        />
        <main className="flex-1 ml-64 p-10 min-h-screen overflow-y-auto">
          <header className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
             <div className="flex items-center gap-4 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Universal search (cmd+k)" 
                  className="bg-slate-900 border border-slate-800 rounded-xl px-12 py-3 text-sm w-96 outline-none focus:border-cyan-500/50 transition-all font-medium" 
                />
             </div>
             <div className="flex items-center gap-6">
                <div className="hidden xl:flex items-center gap-4">
                   <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sys Load</span>
                      <div className="flex items-center gap-1.5">
                         <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 w-[64%]" />
                         </div>
                         <span className="text-[10px] font-bold text-white">64%</span>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Mem</span>
                      <div className="flex items-center gap-1.5">
                         <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[42%]" />
                         </div>
                         <span className="text-[10px] font-bold text-white">42%</span>
                      </div>
                   </div>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <button className="relative p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all group">
                   <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#020617] group-hover:scale-125 transition-transform" />
                   <Bell size={20} />
                </button>
                <div className="h-8 w-px bg-slate-800" />
                <div className="flex items-center gap-4">
                   <div className="text-right">
                     <p className="text-sm font-bold text-white tracking-tight">Sofoniyas</p>
                     <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Agency Owner</p>
                   </div>
                   <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-400/20 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-cyan-500/10">
                     S
                   </div>
                </div>
             </div>
          </header>
          
          <Suspense fallback={<div className="flex items-center justify-center p-20"><Loader2 className="animate-spin text-cyan-500" /></div>}>
            <Routes>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/dashboard/dashboard" element={<DashboardHome />} />
              <Route path="/dashboard/agents" element={<AgentsPage />} />
              <Route path="/dashboard/workflows" element={<WorkflowsPage />} />
              <Route path="/dashboard/contacts" element={<ContactsPage />} />
              <Route path="/dashboard/campaigns" element={<CampaignsPage />} />
              <Route path="/dashboard/history" element={<CallHistoryPage />} />
              <Route path="/dashboard/integrations" element={<IntegrationsPage />} />
              <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#020617] text-white overflow-hidden scroll-smooth">
      <Navbar onNavigate={(page) => navigate(page === 'dashboard' ? '/dashboard' : '/')} currentPage={isDashboard ? 'dashboard' : 'landing'} />
      
      <main>
        {/* Hero Section */}
        <Hero onStart={() => navigate('/dashboard')} />

        {/* Video Introduction Section */}
        <VideoSection />

        {/* AI Voice Demo Section */}
        <VoiceDemo />

        {/* Demo Section */}
        <DemoSection />

        {/* Booking Widget Section */}
        <BookingWidget />

        {/* Pricing Section */}
        <Pricing />

        {/* Industries Section */}
        <section id="industries" className="py-24 bg-slate-950/50 relative border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-16">
               <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Tailored for Every Industry</h2>
               <p className="text-slate-400 text-lg">Our AI solutions integrate seamlessly into your specific workflow.</p>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
               {industries.map((item, i) => (
                 <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[32px] group hover:border-cyan-500/50 hover:bg-cyan-600/5 transition-all duration-300">
                    <div className="p-4 bg-cyan-500/10 rounded-2xl w-fit text-cyan-400 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{item.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                  <h2 className="text-4xl font-extrabold tracking-tight">Enterprise-Grade <span className="text-gradient">AI Automation</span></h2>
                  <div className="space-y-6">
                    {[
                      { title: 'Human-like Voice Engines', icon: <Phone />, desc: 'AI that sounds, breathes, and reacts just like a human assistant.' },
                      { title: 'Workflow Orchestration', icon: <Workflow />, desc: 'Automate post-call actions like CRM updates, SMS follow-ups, and email notifications.' },
                      { title: 'Security & Compliance', icon: <Shield />, desc: 'SOC2 and HIPAA compliant data handling for absolute peace of mind.' },
                    ].map((feature, i) => (
                      <div key={i} className="flex gap-6 group">
                        <div className="flex-shrink-0 w-12 h-12 bg-slate-800 border border-slate-700 group-hover:border-blue-500/50 rounded-xl flex items-center justify-center text-blue-400 transition-colors">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold mb-1 text-white">{feature.title}</h4>
                          <p className="text-slate-400 text-sm">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-1.5 rounded-[40px] shadow-2xl relative overflow-hidden group">
                    <img 
                      src="https://images.unsplash.com/photo-1551288049-bbda33a0f9ad?auto=format&fit=crop&q=80&w=2000" 
                      alt="AI Dashboard" 
                      className="rounded-[36px] opacity-60 group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-transparent" />
                    
                    <div className="absolute bottom-8 left-8 right-8 glass p-6 rounded-2xl border border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center animate-pulse">
                           <Activity size={20} className="text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">System Status: Optimal</p>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">99.9% Uptime Verified</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-bold mb-4 tracking-tight">Simple, Transparent Pricing</h2>
               <p className="text-slate-400">Scale your automation with plans that fit your growth.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Trial', price: '$0', desc: 'Test the waters for 3 days', features: ['1 project', '2 agents', '3 free call minutes', 'Standard support'] },
                { name: 'Pro', price: '$199', desc: 'For growing businesses', features: ['5 projects', '10 agents', 'Advanced analytics', 'Cal.com integration'], featured: true },
                { name: 'Enterprise', price: 'Custom', desc: 'Maximum scale & control', features: ['Unlimited projects', 'Unlimited agents', 'Dedicated manager', 'Custom integrations'] },
              ].map((plan, i) => (
                <div key={i} className={cn(
                  "p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden",
                  plan.featured 
                    ? "glass-dark border-blue-500 shadow-2xl shadow-blue-500/10 scale-105 z-10" 
                    : "glass border-white/5 hover:border-white/20"
                )}>
                  {plan.featured && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest -rotate-0 rounded-bl-xl">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-slate-500 text-sm font-medium">/mo</span>}
                  </div>
                  <p className="text-slate-400 text-sm mb-8">{plan.desc}</p>
                  
                  <div className="space-y-4 mb-8">
                    {plan.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-3 text-sm text-slate-300">
                        <CheckCircle2 size={16} className="text-blue-400 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setCurrentPage('dashboard')}
                    className={cn(
                      "w-full py-4 rounded-xl font-bold transition-all",
                      plan.featured ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="relative glass-dark rounded-[40px] border border-white/5 py-24 px-8 overflow-hidden text-center">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-600/10 blur-[100px] rounded-full" />
              
              <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                 <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to Automate Your Business?</h2>
                 <p className="text-slate-400 text-lg">Join hundreds of agencies already scaling their operations with AIWave.</p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button onClick={() => setCurrentPage('dashboard')} className="btn-primary px-10 py-4 text-lg w-full sm:w-auto">Start Free Trial</button>
                    <button className="btn-secondary px-10 py-4 text-lg w-full sm:w-auto">Talk to an Expert</button>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 glass-dark">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
               <div className="space-y-6">
                 <div className="flex items-center gap-2">
                    <Waves className="text-blue-500 w-8 h-8" />
                    <span className="text-xl font-bold tracking-tight text-white uppercase">AIWave Agency</span>
                 </div>
                 <p className="text-slate-500 text-sm leading-relaxed">
                   The world’s first enterprise-grade AI voice and workflow platform tailored for the service industry.
                 </p>
               </div>
               <div>
                  <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Solution</h4>
                  <ul className="space-y-4 text-slate-500 text-sm">
                    <li><a href="#" className="hover:text-blue-400 transition-colors">AI Voice Agents</a></li>
                    <li><a href="#" className="hover:text-blue-400 transition-colors">Chatbot Automation</a></li>
                    <li><a href="#" className="hover:text-blue-400 transition-colors">Booking Systems</a></li>
                    <li><a href="#" className="hover:text-blue-400 transition-colors">Workflow Automation</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Resources</h4>
                  <ul className="space-y-4 text-slate-500 text-sm">
                    <li><a href="#" className="hover:text-blue-400 transition-colors">API Documentation</a></li>
                    <li><a href="#" className="hover:text-blue-400 transition-colors">Integrations</a></li>
                    <li><a href="#" className="hover:text-blue-400 transition-colors">Case Studies</a></li>
                    <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Contact</h4>
                  <ul className="space-y-4 text-slate-500 text-sm">
                    <li className="flex items-center gap-2"><Mail size={16} /> support@sofoniyas.aiwaveagency.com</li>
                    <li>San Francisco, CA</li>
                    <li>Twitter</li>
                    <li>LinkedIn</li>
                  </ul>
               </div>
            </div>
            
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs font-medium uppercase tracking-widest">
               <p>© 2026 AIWave Agency. All rights reserved.</p>
               <div className="flex gap-8">
                 <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                 <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                 <a href="#" className="hover:text-white transition-colors">Cookies</a>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}

// Helper icons needed in file
function CheckCircle2({ size, className }: { size: number, className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M9 12L11 14L15 10"/></svg>;
}
