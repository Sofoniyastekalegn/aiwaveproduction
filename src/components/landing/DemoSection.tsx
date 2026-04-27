import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MessageSquare, Calendar, Bot, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const DEMOS = [
  {
    category: 'Barbershop',
    title: 'Male Receptionist',
    icon: <Bot className="w-5 h-5" />,
    dialogue: [
      { role: 'user', text: 'I need a haircut today. Are you available?' },
      { role: 'ai', text: 'Absolutely. We have a spot at 2 PM or 4 PM. Which works for you?' },
      { role: 'user', text: '2 PM sounds good.' },
      { role: 'ai', text: 'Perfect. May I have your name please?' },
      { role: 'user', text: 'Daniel.' },
      { role: 'ai', text: 'Great, Daniel. You’re booked for 2 PM. See you soon looking fresh.' },
    ]
  },
  {
    category: 'Hotel',
    title: 'Male Receptionist',
    icon: <Calendar className="w-5 h-5" />,
    dialogue: [
      { role: 'user', text: 'I’d like to book a room for tonight.' },
      { role: 'ai', text: 'Certainly sir. We have deluxe and standard rooms available. Which would you prefer?' },
      { role: 'user', text: 'Deluxe please.' },
      { role: 'ai', text: 'Excellent choice. May I have your full name?' },
      { role: 'user', text: 'Michael James.' },
      { role: 'ai', text: 'Thank you Mr. James. Your deluxe room is reserved. We look forward to hosting you.' },
    ]
  },
  {
    category: 'Real Estate',
    title: 'Male Receptionist',
    icon: <Phone className="w-5 h-5" />,
    dialogue: [
      { role: 'user', text: 'I’m looking for a two-bedroom apartment.' },
      { role: 'ai', text: 'Great choice. Which area are you interested in?' },
      { role: 'user', text: 'Around Bole.' },
      { role: 'ai', text: 'Perfect. We have a few great options. Would you like to schedule a viewing today or tomorrow?' },
      { role: 'user', text: 'Tomorrow.' },
      { role: 'ai', text: 'Done. I’ll arrange the best listings for you.' },
    ]
  },
  {
    category: 'Dental Clinic',
    title: 'Female Receptionist',
    icon: <Bot className="w-5 h-5" />,
    dialogue: [
       { role: 'user', text: 'I have tooth pain and need an appointment.' },
       { role: 'ai', text: 'I’m sorry to hear that. We can see you today at 3 PM or 5 PM. Which works for you?' },
       { role: 'user', text: '3 PM please.' },
       { role: 'ai', text: 'Of course. May I have your name please?' },
       { role: 'user', text: 'Hana.' },
       { role: 'ai', text: 'Thank you Hana. You’re booked for 3 PM. We’ll take good care of you.' },
    ]
  }
];

export default function DemoSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setCurrentStep(0);
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % (DEMOS[activeTab].dialogue.length + 1));
    }, 2500);
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Experience <span className="text-gradient">AIWave</span> in Action</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">See how our AI agents handle complex bookings and inquiries effortlessly across industries.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            {DEMOS.map((demo, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={cn(
                  "w-full flex items-start gap-4 p-6 rounded-2xl transition-all duration-300 text-left border",
                  activeTab === idx 
                    ? "glass-dark border-blue-500/50 shadow-2xl shadow-blue-500/10 scale-[1.02]" 
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl",
                  activeTab === idx ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
                )}>
                  {demo.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{demo.category}</h3>
                  <p className="text-slate-400 text-sm">{demo.title}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="relative">
            <div className="glass-dark border border-white/10 rounded-3xl p-8 aspect-square flex flex-col shadow-2xl relative overflow-hidden">
               {/* Phone Frame Decoration */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl border-x border-b border-white/10 z-10" />
               
               <div className="flex-1 space-y-6 pt-10 overflow-y-auto">
                 <AnimatePresence mode="popLayout">
                   {DEMOS[activeTab].dialogue.slice(0, currentStep).map((msg, i) => (
                     <motion.div
                       key={i}
                       initial={{ opacity: 0, y: 20, scale: 0.9 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.9 }}
                       className={cn(
                         "max-w-[80%] p-4 rounded-2xl text-sm relative leading-relaxed",
                         msg.role === 'user' 
                          ? "ml-auto bg-slate-800 text-white rounded-tr-none" 
                          : "mr-auto bg-blue-600 text-white rounded-tl-none"
                       )}
                     >
                        <div className="flex items-center gap-2 mb-1 opacity-70 text-[10px] uppercase font-bold tracking-wider">
                          {msg.role === 'user' ? 'Client' : 'AI Assistant'}
                        </div>
                        {msg.text}
                        {msg.role === 'ai' && i === currentStep - 1 && (
                          <motion.div 
                            className="absolute -right-1 -bottom-1 bg-white text-blue-600 rounded-full p-0.5 shadow-lg"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <CheckCircle2 size={12} />
                          </motion.div>
                        )}
                     </motion.div>
                   ))}
                 </AnimatePresence>
                 {currentStep < DEMOS[activeTab].dialogue.length && (
                   <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2 items-center text-slate-500 text-xs pl-2 italic"
                   >
                     <motion.span
                       animate={{ opacity: [0.3, 1, 0.3] }}
                       transition={{ repeat: Infinity, duration: 1 }}
                     >
                       AI is thinking...
                     </motion.span>
                   </motion.div>
                 )}
               </div>
               
               <div className="mt-6 pt-6 border-t border-white/10 flex gap-4">
                 <div className="flex-1 bg-slate-800/50 rounded-full h-12 flex items-center px-6 text-slate-500 text-sm italic">
                   Type a message...
                 </div>
                 <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                   <MessageSquare size={20} />
                 </div>
               </div>
            </div>

            {/* Background Accents */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -z-10" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-cyan-600/20 blur-[100px] rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
