import React from 'react';
import { Check, Zap, Crown, Rocket, ShieldCheck, CreditCard } from 'lucide-react';
import { cn } from '../../lib/utils';

const PLANS = [
  {
    name: 'Starter',
    price: '99',
    description: 'Perfect for small local businesses.',
    features: [
      '2 Active AI Agents',
      '500 Monthly Minutes',
      'Standard Voice Library',
      'n8n Basic Integration',
      'Email Support'
    ],
    button: 'Start for Free',
    highlight: false
  },
  {
    name: 'Agency',
    price: '299',
    description: 'Our most popular plan for scaling agencies.',
    features: [
      '10 Active AI Agents',
      '2,500 Monthly Minutes',
      'Ultra-Low Latency Nodes',
      'Custom n8n Workflows',
      'Priority Support',
      'CRM Lead Sync'
    ],
    button: 'Scale Now',
    highlight: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Built for high-volume call centers.',
    features: [
      'Unlimited AI Agents',
      'Custom Minute Volume',
      'Dedicated Cloud Node',
      'White-label Dashboard',
      '24/7 Account Manager',
      'Custom Voice Cloning'
    ],
    button: 'Contact Sales',
    highlight: false
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="badge-cyan mx-auto">Transparent Pricing</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Predictable costs for <span className="text-gradient">unlimited growth.</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            No hidden fees. Scale your AI workforce one node at a time with enterprise-grade security.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div 
              key={plan.name}
              className={cn(
                "relative bg-slate-900/40 backdrop-blur-xl border p-8 rounded-[40px] flex flex-col transition-all duration-300 group",
                plan.highlight 
                  ? "border-cyan-500/50 shadow-[0_0_40px_rgba(34,211,238,0.1)] scale-105 z-20" 
                  : "border-slate-800 hover:border-slate-700 z-10"
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Recommended for Scale
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    {plan.price !== 'Custom' ? `$${plan.price}` : plan.price}
                  </span>
                  {plan.price !== 'Custom' && (
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">/ month</span>
                  )}
                </div>
                <p className="text-slate-500 text-sm mt-4 leading-relaxed">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={cn(
                "w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2",
                plan.highlight 
                  ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400" 
                  : "bg-slate-800 text-white hover:bg-slate-700"
              )}>
                {plan.highlight ? <Zap size={18} fill="currentColor" /> : <Rocket size={18} />}
                {plan.button}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Integration Footer */}
        <div className="mt-20 flex flex-col items-center gap-8">
           <div className="flex items-center gap-3 px-6 py-3 bg-slate-900 shadow-inner border border-slate-800 rounded-2xl">
              <ShieldCheck className="text-emerald-400" size={20} />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Secure checkout processed via <span className="text-white">Stripe API</span>
              </span>
           </div>

           <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {/* Using stylized text/icons for major payment brands */}
              <div className="flex items-center gap-2">
                 <div className="w-8 h-5 bg-[#635BFF] rounded-sm flex items-center justify-center text-[10px] font-black text-white italic">stripe</div>
                 <span className="text-xs font-bold text-white tracking-tight">Stripe Ready</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-8 h-5 bg-[#1A1F71] rounded-sm flex items-center justify-center text-[8px] font-black text-[#F7B600] italic">VISA</div>
                 <span className="text-xs font-bold text-white tracking-tight">USA Cards</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-8 h-5 bg-[#003087] rounded-sm flex items-center justify-center text-[8px] font-black text-white italic">PayPal</div>
                 <span className="text-xs font-bold text-white tracking-tight">Express Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                 <CreditCard className="text-white" size={20} />
                 <span className="text-xs font-bold text-white tracking-tight">Amex & Discover</span>
              </div>
           </div>

           <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] max-w-xs text-center leading-relaxed">
             256-bit SSL encrypted payments. Your data is protected by industry-standard security protocols.
           </p>
        </div>
      </div>
    </section>
  );
}
