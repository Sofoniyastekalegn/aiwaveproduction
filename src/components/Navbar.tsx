import React from 'react';
import { Waves, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavbarProps {
  onNavigate: (page: 'landing' | 'dashboard') => void;
  currentPage: string;
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => onNavigate('landing')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Waves className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">AIWave<span className="text-cyan-400">Agency</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors">Solutions</a>
            <a href="#industries" className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors">Industries</a>
            <a href="#pricing" className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors">Pricing</a>
            <button 
              onClick={() => onNavigate('dashboard')}
              className={cn(
                "btn-secondary py-2 px-5 text-sm border-slate-700 text-white hover:bg-slate-800",
                currentPage === 'dashboard' && "bg-white/10"
              )}
            >
              Login
            </button>
            <button 
               onClick={() => onNavigate('dashboard')}
              className="btn-primary py-2 px-6 text-sm"
            >
              Book Demo
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-b border-white/10 px-4 pt-2 pb-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          <a href="#features" className="text-lg font-medium text-slate-300">Features</a>
          <a href="#industries" className="text-lg font-medium text-slate-300">Industries</a>
          <a href="#pricing" className="text-lg font-medium text-slate-300">Pricing</a>
          <div className="flex flex-col gap-2 pt-4">
            <button onClick={() => onNavigate('dashboard')} className="btn-secondary w-full">Sign In</button>
            <button onClick={() => onNavigate('dashboard')} className="btn-primary w-full">Start Free Trial</button>
          </div>
        </div>
      )}
    </nav>
  );
}
