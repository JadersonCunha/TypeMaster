/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, Trophy, BookOpen, BarChart3, Settings, Cpu, Search, Sparkles } from 'lucide-react';
import { TypingEngine } from './components/TypingEngine';
import { LevelSelector } from './components/LevelSelector';
import { PeripheralsModal } from './components/PeripheralsModal';
import { KeyboardExpertModal } from './components/KeyboardExpertModal';
import { LEVELS } from './constants/curriculum';
import { Challenge, UserProgress, TypingStats } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [isPeripheralsOpen, setIsPeripheralsOpen] = useState(false);
  const [isExpertOpen, setIsExpertOpen] = useState(false);
  const [expertQuery, setExpertQuery] = useState('');
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('typemaster_progress');
    if (saved) return JSON.parse(saved);
    return {
      currentLevel: 1,
      completedChallenges: [],
      bestWpm: 0
    };
  });

  useEffect(() => {
    localStorage.setItem('typemaster_progress', JSON.stringify(progress));
  }, [progress]);

  const handleChallengeFinish = (stats: TypingStats) => {
    if (!activeChallenge) return;

    const success = stats.wpm >= activeChallenge.minWpm && stats.accuracy >= activeChallenge.minAccuracy;

    if (success) {
      setProgress(prev => {
        const alreadyCompleted = prev.completedChallenges.includes(activeChallenge.id);
        const newCompleted = alreadyCompleted 
          ? prev.completedChallenges 
          : [...prev.completedChallenges, activeChallenge.id];
        
        // Determine if we should unlock next level
        const currentLevelObj = LEVELS.find(l => l.id === prev.currentLevel);
        const allCompletedInLevel = currentLevelObj?.challenges.every(c => 
          newCompleted.includes(c.id) || c.id === activeChallenge.id
        );

        let nextLevel = prev.currentLevel;
        if (allCompletedInLevel && prev.currentLevel < LEVELS.length) {
          nextLevel = prev.currentLevel + 1;
        }

        return {
          currentLevel: nextLevel,
          completedChallenges: newCompleted,
          bestWpm: Math.max(prev.bestWpm, stats.wpm)
        };
      });
    }

    // Immediately close the challenge since it's now triggered by user confirmation in the modal
    setActiveChallenge(null);
  };

  const totalChallenges = LEVELS.reduce((acc, level) => acc + level.challenges.length, 0);
  const completionPercentage = Math.round((progress.completedChallenges.length / totalChallenges) * 100);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-gray-100 font-sans antialiased relative overflow-x-hidden">
      {/* Background Orbs & Grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-yellow-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Header / Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] group hover:scale-105 transition-transform duration-500">
              <Keyboard className="w-7 h-7 text-black group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter uppercase leading-[0.8] text-white">TYPE<span className="text-yellow-500">MASTER</span></span>
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mt-1">Industrial Intelligence</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-3 group cursor-help">
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  className="h-full bg-yellow-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                />
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{completionPercentage}% Concluído</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden xl:block">
              <input 
                type="text"
                placeholder="Dúvida? Pergunte ao Especialista..."
                value={expertQuery}
                onChange={(e) => setExpertQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && expertQuery.trim()) {
                    setIsExpertOpen(true);
                  }
                }}
                className="bg-white/10 border border-white/20 rounded-2xl py-2.5 px-11 text-xs text-white placeholder-gray-400 w-72 outline-none focus:border-yellow-500/60 focus:bg-white/[0.12] focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
              />
              <Search className="w-4 h-4 text-yellow-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:scale-110 transition-transform" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/10 rounded-md border border-yellow-500/20">
                <Sparkles className="w-2.5 h-2.5 text-yellow-500" />
                <span className="text-[8px] font-black text-yellow-500 uppercase tracking-tighter">AI</span>
              </div>
            </div>

            <button
              onClick={() => setIsPeripheralsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-gray-400 hover:text-white"
            >
              <Cpu className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Guia de Hardware</span>
            </button>
            <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-500 uppercase leading-none">Recorde</span>
                <span className="text-sm font-black tabular-nums">{progress.bestWpm} WPM</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-16 px-6">
        <AnimatePresence mode="wait">
          {!activeChallenge ? (
            <motion.div
              key="selector"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <LevelSelector 
                levels={LEVELS} 
                progress={progress} 
                onSelectChallenge={setActiveChallenge} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="engine"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="py-4"
            >
              <div className="mb-16 text-center">
                <h2 className="text-[11px] font-black text-yellow-500 uppercase tracking-[0.4em] mb-4">Módulo de Treinamento</h2>
                <h1 className="text-5xl font-black tracking-tighter text-white">{activeChallenge.title}</h1>
              </div>
              <TypingEngine 
                challenge={activeChallenge} 
                onFinish={handleChallengeFinish}
                onCancel={() => setActiveChallenge(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Peripherals Guide Modal */}
      <PeripheralsModal isOpen={isPeripheralsOpen} onClose={() => setIsPeripheralsOpen(false)} />

      {/* Keyboard Expert AI Modal */}
      <KeyboardExpertModal 
        isOpen={isExpertOpen} 
        onClose={() => {
          setIsExpertOpen(false);
          setExpertQuery('');
        }} 
        initialQuery={expertQuery}
      />

      {/* Footer Branding */}
      <footer className="py-20 border-t border-white/5 text-center">
        <div className="flex flex-col items-center gap-4 opacity-30 hover:opacity-100 transition-opacity duration-500">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <Keyboard className="w-4 h-4 text-white" />
          </div>
          <p className="text-[10px] uppercase font-black tracking-[0.5em]">2026 Engine • TypeMaster Pro</p>
        </div>
      </footer>
    </div>
  );
}
