import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MousePointer2, Keyboard, Monitor, Speaker, Headphones, Camera, HardDrive, Cpu } from 'lucide-react';

interface Peripheral {
  id: string;
  name: string;
  icon: React.ReactNode;
  port: string;
  description: string;
}

const PERIPHERALS: Peripheral[] = [
  {
    id: 'mouse',
    name: 'Mouse',
    icon: <MousePointer2 className="w-6 h-6" />,
    port: 'USB-A / USB-C',
    description: 'Dispositivo de entrada para navegação e interação com a interface.'
  },
  {
    id: 'keyboard',
    name: 'Teclado',
    icon: <Keyboard className="w-6 h-6" />,
    port: 'USB-A',
    description: 'Principal dispositivo de entrada de texto e comandos.'
  },
  {
    id: 'monitor',
    name: 'Monitor',
    icon: <Monitor className="w-6 h-6" />,
    port: 'HDMI / DisplayPort',
    description: 'Saída de vídeo principal para visualização do sistema.'
  },
  {
    id: 'speakers',
    name: 'Caixas de Som',
    icon: <Speaker className="w-6 h-6" />,
    port: 'P2 (3.5mm) / USB',
    description: 'Saída de áudio externa para som ambiente.'
  },
  {
    id: 'headphones',
    name: 'Headset',
    icon: <Headphones className="w-6 h-6" />,
    port: 'P2 (3.5mm) / USB',
    description: 'Dispositivo combinado de áudio e microfone.'
  },
  {
    id: 'webcam',
    name: 'Webcam',
    icon: <Camera className="w-6 h-6" />,
    port: 'USB-A',
    description: 'Câmera externa para vídeo chamadas e capturas.'
  },
  {
    id: 'extdrive',
    name: 'HD Externo',
    icon: <HardDrive className="w-6 h-6" />,
    port: 'USB 3.0 (Azul) / USB-C',
    description: 'Armazenamento adicional de alta velocidade.'
  },
  {
    id: 'power',
    name: 'Cabo de Força',
    icon: <Cpu className="w-6 h-6" />,
    port: 'Tomada AC (Traseira)',
    description: 'Alimentação elétrica para a fonte do gabinete.'
  }
];

interface PeripheralsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PeripheralsModal: React.FC<PeripheralsModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-[#111113] border border-white/10 rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]"
          >
            <div className="flex flex-col h-full max-h-[90vh]">
              {/* Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">Guia de Periféricos</h2>
                  <p className="text-gray-500 font-medium">Conheça os componentes e suas portas de conexão.</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {PERIPHERALS.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -5 }}
                      className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl group"
                    >
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-yellow-500 mb-6 group-hover:bg-yellow-500 group-hover:text-black transition-colors duration-500">
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">{item.name}</h3>
                      <div className="mb-4">
                        <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest block mb-1">Porta de Conexão</span>
                        <span className="text-xs font-bold text-gray-400">{item.port}</span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Cabinet Guide */}
                <div className="mt-12 p-10 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-[40px]">
                  <h4 className="text-xl font-black text-white mb-6 uppercase tracking-tight">Manual de Instalação no Gabinete</h4>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <div className="text-yellow-500 font-black italic text-2xl">01.</div>
                      <h5 className="font-bold text-white">Painel Traseiro (I/O)</h5>
                      <p className="text-sm text-gray-500 leading-relaxed">Local onde se encontram HDMI, DisplayPort e a maioria das portas USB 3.0 de alta velocidade.</p>
                    </div>
                    <div className="space-y-3">
                      <div className="text-yellow-500 font-black italic text-2xl">02.</div>
                      <h5 className="font-bold text-white">Painel Frontal</h5>
                      <p className="text-sm text-gray-500 leading-relaxed">Acesso rápido para Headphones (P2) e USB para pen drives ou periféricos temporários.</p>
                    </div>
                    <div className="space-y-3">
                      <div className="text-yellow-500 font-black italic text-2xl">03.</div>
                      <h5 className="font-bold text-white">Fonte de Energia</h5>
                      <p className="text-sm text-gray-500 leading-relaxed">Sempre conectada na parte inferior ou superior traseira, identificada por um encaixe de 3 pinos largos.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
