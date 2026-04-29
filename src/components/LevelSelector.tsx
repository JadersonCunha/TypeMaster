import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Lock, CheckCircle2, BookOpen } from 'lucide-react';
import { Level, Challenge, UserProgress } from '../types';
import { cn } from '../lib/utils';

interface LevelSelectorProps {
  levels: Level[];
  progress: UserProgress;
  onSelectChallenge: (challenge: Challenge) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ levels, progress, onSelectChallenge }) => {
  return (
    <div className="flex flex-col gap-16 w-full max-w-5xl mx-auto py-8">
      <div className="space-y-4 max-w-2xl">
        <h2 className="text-6xl font-black text-white tracking-tighter leading-tight">CURRÍCULO DE MAESTRIA</h2>
        <p className="text-gray-500 text-xl leading-relaxed font-medium">Progressão técnica estruturada para atingir o nível industrial de digitação.</p>
      </div>

      <div className="grid gap-20">
        {levels.map((level, idx) => {
          const isUnlocked = level.id <= progress.currentLevel;
          
          return (
            <div key={level.id} className={cn("relative group", !isUnlocked && "opacity-40")}>
              {/* Level Header */}
              <div className="flex items-center gap-8 mb-10">
                <div className={cn(
                  "w-16 h-16 rounded-3xl flex items-center justify-center font-black text-2xl transition-all duration-500",
                  isUnlocked 
                    ? "bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.1)] group-hover:scale-110" 
                    : "bg-white/5 text-white/20 border border-white/5"
                )}>
                  {String(level.id).padStart(2, '0')}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-3xl font-black text-white tracking-tight uppercase group-hover:text-yellow-500 transition-colors">{level.title}</h3>
                    {isUnlocked && <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]" />}
                  </div>
                  <span className="text-[10px] font-black px-4 py-1.5 bg-white/5 text-gray-500 rounded-full border border-white/5 tracking-[0.2em] uppercase">
                    {level.difficulty}
                  </span>
                </div>
              </div>

              {/* Challenges Grid */}
              <div className="grid md:grid-cols-2 gap-8 pl-0 md:pl-24">
                {level.challenges.map((challenge) => {
                  const isCompleted = progress.completedChallenges.includes(challenge.id);
                  
                  return (
                    <button
                      key={challenge.id}
                      disabled={!isUnlocked}
                      onClick={() => onSelectChallenge(challenge)}
                      className={cn(
                        "group/card relative text-left p-8 rounded-[40px] border transition-all duration-700 overflow-hidden",
                        isUnlocked 
                          ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/20 hover:shadow-[0_20px_80px_-20px_rgba(0,0,0,0.5)] hover:-translate-y-2" 
                          : "bg-transparent border-white/5 cursor-not-allowed"
                      )}
                    >
                      {/* Completion Accent */}
                      {isCompleted && (
                        <div className="absolute top-0 right-0 p-6">
                           <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                             <CheckCircle2 className="w-5 h-5 text-green-500" />
                           </div>
                        </div>
                      )}

                      <div className="relative z-10">
                        <div className="mb-6">
                          <h4 className="font-black text-xl text-white mb-2 group-hover/card:text-yellow-500 transition-colors uppercase tracking-tight">{challenge.title}</h4>
                          <p className="text-gray-500 text-sm leading-relaxed font-medium line-clamp-2">{challenge.description}</p>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                          <div className="flex gap-6">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">REQ.Vel</span>
                              <span className="text-xs font-black text-white/60">{challenge.minWpm} WPM</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">REQ.Acc</span>
                              <span className="text-xs font-black text-white/60">{challenge.minAccuracy}%</span>
                            </div>
                          </div>
                          <div className={cn(
                              "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300",
                              isUnlocked ? "bg-white/5 text-white group-hover/card:bg-white group-hover/card:text-black" : "text-white/10"
                            )}>
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Tips Section */}
              {isUnlocked && level.tips.length > 0 && (
                <div className="mt-12 ml-0 md:ml-24 p-10 bg-gradient-to-br from-white/[0.03] to-transparent rounded-[48px] border border-white/5 relative overflow-hidden group/tips">
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover/tips:opacity-20 transition-opacity">
                    <BookOpen className="w-32 h-32 text-white" />
                  </div>
                  <h5 className="text-[11px] font-black text-yellow-500 mb-6 flex items-center gap-3 uppercase tracking-[0.4em]">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" /> Procedimentos Técnicos
                  </h5>
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
                    {level.tips.map((tip, idx) => (
                      <div key={idx} className="text-sm text-gray-400 font-medium leading-relaxed flex gap-4 items-start">
                        <span className="text-white/20 font-black tabular-nums">{String(idx + 1).padStart(2, '0')}</span>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
