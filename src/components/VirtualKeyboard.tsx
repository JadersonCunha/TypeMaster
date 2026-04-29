import React, { useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '../lib/utils';

interface VirtualKeyboardProps {
  activeKey: string | null;
  nextKey: string | null;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeKey, nextKey }) => {
  const [zoom, setZoom] = useState(1);

  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', ';'],
    ['space']
  ];

  const getKeyLabel = (key: string) => {
    if (key === 'space') return 'Espaço';
    return key.toUpperCase();
  };

  return (
    <div className="flex flex-col gap-3 p-10 bg-[#0F0F11] rounded-[56px] border border-white/[0.08] select-none shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] backdrop-blur-3xl relative overflow-hidden">
      {/* Decorative inner glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Zoom Control */}
      <div className="flex items-center justify-end gap-3 mb-6 px-4">
        <ZoomOut className="w-4 h-4 text-white/20" />
        <input 
          type="range" 
          min="0.8" 
          max="2.5" 
          step="0.1" 
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="w-32 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
        <ZoomIn className="w-4 h-4 text-white/20" />
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-2">Zoom Letras: {Math.round(zoom * 100)}%</span>
      </div>
      
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-3">
          {row.map((key) => {
            const isKeyPressing = activeKey?.toLowerCase() === key || (key === 'space' && activeKey === ' ');
            const isNext = nextKey?.toLowerCase() === key || (key === 'space' && nextKey === ' ');

            return (
              <div
                key={key}
                className={cn(
                  "flex items-center justify-center rounded-2xl font-black transition-all duration-75 uppercase tracking-widest",
                  "bg-[#202023] border-b-[5px] border-[#0A0A0B] text-white/50 h-16 shadow-[0_4px_10px_rgba(0,0,0,0.3)]",
                  key === 'space' ? "w-[460px]" : "w-16",
                  
                  // Next key highlight (Target)
                  isNext && !isKeyPressing && "border-yellow-500/80 text-yellow-400 bg-yellow-500/[0.05] ring-2 ring-yellow-500/30 animate-pulse shadow-[0_0_30px_rgba(234,179,8,0.3)]",
                  
                  // Active key press (Feedback)
                  isKeyPressing && "bg-white border-b-0 text-black translate-y-[5px] h-16 shadow-[0_0_50px_rgba(255,255,255,0.4)] scale-[0.96] border-t border-white/20"
                )}
                style={{ fontSize: `${11 * zoom}px` }}
              >
                {getKeyLabel(key)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
