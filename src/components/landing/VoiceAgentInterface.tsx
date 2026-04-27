import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Bot, Mic2, Volume2, Check, Phone, PhoneOff, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { industryPersonas, getChatResponse } from '../../services/chatService';
import { synthesizeSpeech } from '../../services/voiceService';

interface VoiceAgentInterfaceProps {
  initialIndustry?: keyof typeof industryPersonas;
  className?: string;
  hideHeader?: boolean;
}

export default function VoiceAgentInterface({ 
  initialIndustry = 'barber',
  className,
  hideHeader = false 
}: VoiceAgentInterfaceProps) {
  const [activeIndustry, setActiveIndustry] = useState<keyof typeof industryPersonas>(initialIndustry);
  const [status, setStatus] = useState<'idle' | 'calling' | 'connected'>('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setActiveIndustry(initialIndustry);
    setStatus('idle');
    setMessages([]);
  }, [initialIndustry]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startCall = async () => {
    setStatus('calling');
    
    // Simulate connection delay
    setTimeout(async () => {
      setStatus('connected');
      const persona = industryPersonas[activeIndustry];
      setMessages([{ role: 'model', content: persona.opening }]);
      
      try {
        const audioUrl = await synthesizeSpeech(persona.opening, persona.voiceId);
        if (audioUrl && audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play().catch(e => console.warn("Auto-play blocked"));
          setIsPlaying(true);
          audioRef.current.onended = () => setIsPlaying(false);
        }
      } catch (error) {
        console.error("Failed to play opening:", error);
      }
    }, 1500);
  };

  const endCall = () => {
    if (audioRef.current) audioRef.current.pause();
    setStatus('idle');
    setMessages([]);
    setIsPlaying(false);
  };

  // Effect to handle automatic listening after agent finishes speaking
  useEffect(() => {
    if (status === 'connected' && !isPlaying && !isLoading && !isListening) {
      // Small delay after agent finishes to prevent cutting off or overlap
      const timer = setTimeout(() => {
        if (status === 'connected' && !isPlaying && !isLoading) {
          try {
            recognitionRef.current?.start();
            setIsListening(true);
          } catch (e) {
            // Silently fail if already started or blocked
          }
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, isLoading, status, isListening]);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      let lastTranscript = '';
      let timer: any = null;

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }

        if (currentTranscript.trim() && !isLoading && !isPlaying) {
          // Debounce the speech to wait for the user to finish talking
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            if (currentTranscript.trim()) {
              handleSendMessageFromText(currentTranscript.trim());
              recognitionRef.current?.stop();
            }
          }, 1500); 
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.error('Speech recognition error:', event.error);
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, [activeIndustry, status]); // Re-init on industry or status change

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleSendMessageFromText = async (text: string) => {
    if (isLoading) return;

    // Check for hanging up keywords
    const lowerText = text.toLowerCase();
    const isGoodbye = lowerText.includes('goodbye') || 
                      lowerText.includes('bye bye') || 
                      lowerText.includes('hang up') ||
                      lowerText.includes('talk later');

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const response = await getChatResponse(activeIndustry, text, history);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
      
      const persona = industryPersonas[activeIndustry];
      const audioUrl = await synthesizeSpeech(response, persona.voiceId);
      
      // Auto-booking simulation logic
      const isBooking = lowerText.includes('book') || lowerText.includes('appointment') || lowerText.includes('schedule');
      const hasTime = lowerText.match(/\d/); // Simple check for numbers/time
      
      if (isBooking && hasTime) {
         console.log("Auto-booking triggered for:", text);
         // In a real app, we'd call a Cal.com API here
         // For demo, we'll suggest opening the booking widget
         setMessages(prev => [...prev, { role: 'model', content: "Checking my calendar... confirmed! I've reserved that slot for you. Rotating to Cal.com sync." }]);
      }

      if (audioUrl && audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(e => console.warn("Playback failed", e));
        setIsPlaying(true);
        audioRef.current.onended = () => {
          setIsPlaying(false);
          if (isGoodbye) {
            setTimeout(endCall, 1000);
          }
        };
      } else {
        setIsPlaying(false);
        if (isGoodbye) endCall();
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "I'm having a bit of a connection issue. Can you repeat that?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    handleSendMessageFromText(userMessage);
  };

  if (status === 'idle') {
    return (
      <div className={cn("bg-slate-900 border border-slate-800 rounded-[32px] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group", className)}>
         <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>
         <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-500">
            <Phone size={32} />
         </div>
         <h3 className="text-xl font-bold text-white mb-2">Test Live Voice Agent</h3>
         <p className="text-sm text-slate-500 mb-8 max-w-[240px]"> Experience a neural receptionist with sub-second latency.</p>
         <button 
           onClick={startCall}
           className="px-8 py-3 bg-cyan-500 text-slate-950 font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
         >
           Place Demo Call
         </button>
      </div>
    );
  }

  if (status === 'calling') {
    return (
      <div className={cn("bg-slate-950 border border-slate-800 rounded-[32px] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden", className)}>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#22d3ee08_0%,transparent_70%)] animate-pulse"></div>
         <div className="w-24 h-24 relative mb-8">
            <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute inset-0 bg-cyan-500 rounded-full"
            />
            <div className="absolute inset-2 bg-slate-900 rounded-full flex items-center justify-center text-cyan-500">
               <Bot size={40} className="animate-bounce" />
            </div>
         </div>
         <div className="space-y-2">
            <p className="text-cyan-400 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">Connecting to Node...</p>
            <p className="text-slate-500 text-xs">Industry: {industryPersonas[activeIndustry].name}</p>
         </div>
         <button 
           onClick={endCall}
           className="mt-12 w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
         >
           <PhoneOff size={20} />
         </button>
      </div>
    );
  }

  return (
    <div className={cn("bg-[#0b1121] border border-slate-800 rounded-[32px] overflow-hidden flex flex-col shadow-2xl transition-all relative", className)}>
      <audio ref={audioRef} className="hidden" />
      
      {/* Header */}
      {!hideHeader && (
        <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-slate-950 shadow-lg scale-90">
              <Bot size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white uppercase tracking-widest text-[9px]">{industryPersonas[activeIndustry].name}</span>
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-[9px] text-slate-500 font-medium">Neural Call In Progress...</p>
            </div>
          </div>
          <button 
            onClick={endCall}
            className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
          >
             <PhoneOff size={14} />
          </button>
        </div>
      )}

      {/* Waveform Visualization Overlay */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 flex items-end gap-1.5 h-12 z-20 pointer-events-none"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ height: [4, 48, 12, 36, 8] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.05 }}
                className="w-1 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-[size:15px_15px] bg-[radial-gradient(circle_at_center,_#ffffff01_1px,_transparent_1px)]"
      >
        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            key={i}
            className={cn(
              "flex flex-col max-w-[85%]",
              msg.role === 'user' ? "ml-auto items-end" : "items-start"
            )}
          >
             <div className="flex items-center gap-2 mb-1 opacity-40">
                {msg.role === 'model' ? <Bot size={10} className="text-cyan-400" /> : <User size={10} className="text-slate-400" />}
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                   {msg.role === 'model' ? 'Neural Node' : 'Caller'}
                </span>
             </div>
            <div className={cn(
              "px-4 py-3 rounded-2xl text-[12px] leading-relaxed shadow-sm",
              msg.role === 'user' 
                ? "bg-cyan-600 text-white rounded-tr-none" 
                : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/30"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-cyan-500/50 bg-cyan-500/5 px-3 py-2 rounded-full w-fit">
             <Loader2 size={10} className="animate-spin" />
             <span className="text-[8px] font-black uppercase tracking-[0.2em]">Neural Processing...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        <div className="mb-3 flex items-center justify-between">
           <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                 <Mic2 size={10} className="text-emerald-500" />
                 <span className="text-[8px] font-bold text-emerald-500/70 uppercase tracking-widest">Mic Active</span>
              </div>
           </div>
           <span className="text-[8px] font-bold text-slate-600 uppercase">Latency: 420ms</span>
        </div>
        <form onSubmit={handleSendMessage} className="relative flex gap-2">
          {recognitionRef.current && (
            <button 
              type="button"
              onClick={toggleListening}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0",
                isListening ? "bg-red-500 text-white animate-pulse" : "bg-slate-800 text-slate-400 hover:text-white"
              )}
            >
              <Mic2 size={16} />
            </button>
          )}
          <input 
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Speak or type your response..."}
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-500/30 transition-all placeholder:text-slate-600"
          />
          <button 
            type="submit"
            disabled={isLoading || !chatInput.trim()}
            className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-slate-950 hover:bg-cyan-400 disabled:opacity-50 transition-all shrink-0 shadow-lg shadow-cyan-500/20"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
