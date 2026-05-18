import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { format, addDays, startOfToday } from 'date-fns';

const TIMES = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'];

export default function BookingWidget() {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedTime, setSelectedTime] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const days = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));

  if (isBooked) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-12 rounded-[40px] text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 mx-auto shadow-[0_0_40px_rgba(16,185,129,0.3)]">
          <Check size={40} strokeWidth={3} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Meeting Scheduled!</h3>
          <p className="text-slate-400">Our team will reach out at {selectedTime} on {format(selectedDate, 'MMM do')}.</p>
        </div>
        <button onClick={() => setIsBooked(false)} className="btn-secondary px-8">Schedule Another</button>
      </div>
    );
  }

  return (
    <section className="py-24 bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="badge-cyan">Instant Access</div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mt-4 mb-6">
              Ready to <span className="text-gradient">automate</span> your business?
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              Skip the sales queue. Record your agency's needs and book a direct onboarding call with our technical team.
            </p>
            
            <div className="space-y-6">
               {[
                 { title: 'Personalized Demo', desc: 'See how AIWave handles your specific business logic.' },
                 { title: 'Technical Roadmap', desc: 'Get a clear deployment timeline for your AI workforce.' },
                 { title: 'ROI Analysis', desc: 'Calculate exactly how much overhead you could eliminate.' },
               ].map((item, i) => (
                 <div key={i} className="flex gap-4">
                   <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-1">
                      <Check size={14} strokeWidth={3} />
                   </div>
                   <div>
                     <h4 className="font-bold text-white mb-1">{item.title}</h4>
                     <p className="text-slate-500 text-sm">{item.desc}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[40px] shadow-2xl">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white">
                   <Calendar size={20} />
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cal.com Integration</p>
                   <h4 className="text-white font-bold">15 Min Discovery Call</h4>
                </div>
             </div>

             <div className="space-y-8">
                <div>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Select Date</p>
                   <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {days.map((day) => (
                        <button
                          key={day.toString()}
                          onClick={() => setSelectedDate(day)}
                          className={cn(
                            "flex flex-col items-center min-w-[70px] p-4 rounded-2xl border transition-all",
                            format(selectedDate, 'd') === format(day, 'd')
                              ? "bg-cyan-500 border-cyan-400 text-slate-950 font-bold"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600"
                          )}
                        >
                          <span className="text-[10px] uppercase">{format(day, 'EEE')}</span>
                          <span className="text-lg">{format(day, 'd')}</span>
                        </button>
                      ))}
                   </div>
                </div>

                <div>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Available Slots ({format(selectedDate, 'MMM d')})</p>
                   <div className="grid grid-cols-2 gap-3">
                      {TIMES.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "p-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2",
                            selectedTime === time
                              ? "bg-slate-100 border-white text-slate-950 shadow-lg"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"
                          )}
                        >
                          <Clock size={14} /> {time}
                        </button>
                      ))}
                   </div>
                </div>

                <button 
                  disabled={!selectedTime}
                  onClick={() => setIsBooked(true)}
                  className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale transition-all"
                >
                  Confirm Appointment <ChevronRight size={20} />
                </button>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
