import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Zap, Target, RotateCcw, AlertTriangle, Trophy } from 'lucide-react';
import { TypingStats, Challenge } from '../types';
import { cn } from '../lib/utils';
import { VirtualKeyboard } from './VirtualKeyboard';

interface TypingEngineProps {
  challenge: Challenge;
  onFinish: (stats: TypingStats) => void;
  onCancel: () => void;
}

export const TypingEngine: React.FC<TypingEngineProps> = ({ challenge, onFinish, onCancel }) => {
  const [userInput, setUserInput] = useState('');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    timeElapsed: 0,
    isFinished: false
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateStats = useCallback((input: string) => {
    if (!startTime) return;
    
    const now = Date.now();
    const timeElapsedSec = (now - startTime) / 1000;
    const timeElapsedMin = timeElapsedSec / 60;
    
    const charCount = input.length;
    const wpm = Math.round((charCount / 5) / (timeElapsedMin || 0.01));
    
    let errors = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== challenge.content[i]) {
        errors++;
      }
    }
    
    const accuracy = charCount === 0 ? 100 : Math.round(((charCount - errors) / charCount) * 100);
    
    setStats({
      wpm,
      accuracy,
      errors,
      timeElapsed: Math.round(timeElapsedSec),
      isFinished: input.length === challenge.content.length
    });

    if (input.length === challenge.content.length) {
      setStats(prev => ({ ...prev, isFinished: true }));
    }
  }, [startTime, challenge.content]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      setActiveKey(e.key);
    };
    const handleGlobalKeyUp = () => {
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('keyup', handleGlobalKeyUp);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('keyup', handleGlobalKeyUp);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > challenge.content.length) return;
    
    if (!startTime) {
      setStartTime(Date.now());
    }
    
    setUserInput(value);
    calculateStats(value);
  };

  const reset = () => {
    setUserInput('');
    setStartTime(null);
    setStats({
      wpm: 0,
      accuracy: 100,
      errors: 0,
      timeElapsed: 0,
      isFinished: false
    });
    if (inputRef.current) inputRef.current.focus();
  };

  const nextKey = userInput.length < challenge.content.length ? challenge.content[userInput.length] : null;

  return (
    <div className="flex flex-col gap-10 w-full max-w-6xl mx-auto" ref={containerRef} onClick={() => inputRef.current?.focus()}>
      {/* Header Info */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Zap className="w-5 h-5 text-yellow-500" />} label="Velocidade" value={`${stats.wpm} WPM`} />
        <StatCard icon={<Target className="w-5 h-5 text-blue-500" />} label="Precisão" value={`${stats.accuracy}%`} />
        <StatCard icon={<AlertTriangle className="w-5 h-5 text-red-500" />} label="Erros" value={stats.errors} />
        <StatCard icon={<Timer className="w-5 h-5 text-green-500" />} label="Cronômetro" value={`${stats.timeElapsed}s`} />
      </div>

      {/* Typing Board */}
      <div className="relative p-16 bg-white/[0.02] border border-white/5 rounded-[48px] shadow-[inset_0_4px_30px_rgba(0,0,0,0.5)] overflow-hidden font-mono text-4xl leading-relaxed select-none group/board">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 pointer-events-none"
          value={userInput}
          onChange={handleInputChange}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
        
        <div className="flex flex-wrap gap-x-[0.1em] relative z-10 transition-transform duration-500">
          {challenge.content.split('').map((char, idx) => {
            let state: 'pending' | 'correct' | 'wrong' = 'pending';
            if (idx < userInput.length) {
              state = userInput[idx] === char ? 'correct' : 'wrong';
            }

            return (
              <span
                key={idx}
                className={cn(
                  "relative transition-all duration-100",
                  state === 'pending' && "text-white/10",
                  state === 'correct' && "text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]",
                  state === 'wrong' && "text-red-500 bg-red-500/20 rounded-lg px-0.5",
                  idx === userInput.length && "text-yellow-500"
                )}
              >
                {char === ' ' ? '\u00A0' : char}
                {idx === userInput.length && (
                  <motion.div 
                    layoutId="caret"
                    className="absolute -bottom-1 left-0 w-full h-1 bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.6)]"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Virtual Keyboard */}
      <div className="hidden lg:block">
        <VirtualKeyboard activeKey={activeKey} nextKey={nextKey} />
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center bg-white/[0.02] p-6 rounded-[32px] border border-white/5">
        <button
          onClick={onCancel}
          className="px-8 py-3 text-gray-500 hover:text-white transition-all font-black text-xs uppercase tracking-[0.3em]"
        >
          Encerrar Sessão
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-3 px-10 py-4 bg-white text-black rounded-[24px] font-black uppercase text-sm transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          Reiniciar Ciclo
        </button>
      </div>

      {/* Result Modal Overlay */}
      <AnimatePresence>
        {stats.isFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#111113] rounded-[64px] p-16 shadow-[0_0_100px_rgba(0,0,0,1)] max-w-2xl w-full text-center border border-white/5"
            >
              <div className="w-24 h-24 bg-yellow-500 rounded-[32px] flex items-center justify-center mx-auto mb-10 text-black rotate-3 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                <Trophy className="w-12 h-12" />
              </div>
              <h3 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase italic">Desempenho Elite</h3>
              <p className="text-gray-500 mb-12 text-xl font-medium">Os dados confirmam sua evolução técnica contínua.</p>
              
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="p-10 bg-white shadow-xl rounded-[48px]">
                  <span className="block text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black mb-2">Velocidade Final</span>
                  <span className="text-5xl font-black text-black tracking-tighter">{stats.wpm} <span className="text-xl">WPM</span></span>
                </div>
                <div className="p-10 bg-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.3)] rounded-[48px]">
                  <span className="block text-[10px] uppercase tracking-[0.4em] text-black/40 font-black mb-2">Precisão Final</span>
                  <span className="text-5xl font-black text-black tracking-tighter">{stats.accuracy}%</span>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <button
                  onClick={() => onFinish(stats)}
                  className="w-full py-6 bg-white hover:bg-gray-200 text-black rounded-[32px] font-black text-2xl transition-all shadow-xl hover:shadow-2xl active:scale-95 uppercase tracking-tighter"
                >
                  Confirmar Progressão
                </button>
                <button
                  onClick={reset}
                  className="w-full py-6 text-gray-500 hover:text-white rounded-[32px] font-black text-lg transition-all uppercase tracking-widest"
                >
                  Repetir Módulo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] flex items-center gap-6 transition-all hover:bg-white/[0.05] hover:border-white/20 group">
    <div className="p-5 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
      {icon}
    </div>
    <div>
      <span className="block text-[10px] uppercase tracking-[0.3em] font-black text-gray-500 mb-2 leading-none">{label}</span>
      <span className="text-3xl font-black text-white leading-none tracking-tighter">{value}</span>
    </div>
  </div>
);

