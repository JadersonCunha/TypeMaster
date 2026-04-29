import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Search, MessageSquare, Plus, Bot, User, Loader2, Globe } from 'lucide-react';
import { getAiResponse, ChatMessage, Conversation } from '../services/geminiService';
import { cn } from '../lib/utils';

interface KeyboardExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const KeyboardExpertModal: React.FC<KeyboardExpertModalProps> = ({ isOpen, onClose, initialQuery }) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('typemaster_chats');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('typemaster_chats', JSON.stringify(conversations));
  }, [conversations]);

  // Handle initial query from search field
  useEffect(() => {
    if (isOpen && initialQuery && initialQuery.trim() !== '') {
      createNewChat(initialQuery);
    }
  }, [isOpen]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversations, activeChatId]);

  const activeChat = conversations.find(c => c.id === activeChatId);

  const createNewChat = async (firstMessage?: string) => {
    const newChat: Conversation = {
      id: Date.now().toString(),
      title: firstMessage ? (firstMessage.length > 20 ? firstMessage.substring(0, 20) + '...' : firstMessage) : 'Nova Conversa',
      messages: [],
      timestamp: Date.now()
    };
    
    setConversations(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    
    if (firstMessage) {
      await handleSend(firstMessage, newChat.id);
    }
  };

  const handleSend = async (text: string, chatId?: string) => {
    const targetChatId = chatId || activeChatId;
    if (!text.trim() || !targetChatId || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text };
    
    // Update local state immediately
    setConversations(prev => prev.map(c => 
      c.id === targetChatId 
        ? { ...c, messages: [...c.messages, userMessage], title: c.messages.length === 0 ? (text.substring(0, 30) + (text.length > 30 ? '...' : '')) : c.title }
        : c
    ));

    setInput('');
    setIsLoading(true);

    try {
      const chat = conversations.find(c => c.id === targetChatId);
      const history = chat ? chat.messages : [];
      const aiText = await getAiResponse(text, history);
      
      const aiMessage: ChatMessage = { role: 'model', text: aiText };
      
      setConversations(prev => prev.map(c => 
        c.id === targetChatId 
          ? { ...c, messages: [...c.messages, aiMessage] }
          : c
      ));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 lg:p-12 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-7xl h-full flex bg-[#0F0F11] border border-white/10 rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]"
        >
          {/* Sidebar: History */}
          <aside className="w-80 border-r border-white/5 flex flex-col bg-black/20">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-black text-white tracking-tighter uppercase">Conversas</h2>
              <button 
                onClick={() => createNewChat()}
                className="w-10 h-10 bg-yellow-500 hover:bg-yellow-400 rounded-xl flex items-center justify-center text-black transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 opacity-20 px-8 text-center text-xs font-bold uppercase tracking-widest leading-relaxed">
                  Sem conversas ainda.
                </div>
              ) : (
                conversations.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={cn(
                      "w-full p-4 rounded-2xl flex items-center gap-4 transition-all text-left group border border-transparent",
                      activeChatId === chat.id 
                        ? "bg-white/5 border-white/10 shadow-lg" 
                        : "hover:bg-white/[0.02] hover:border-white/5"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      activeChatId === chat.id ? "bg-yellow-500 text-black" : "bg-white/5 text-gray-500 group-hover:text-yellow-500"
                    )}>
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-bold truncate transition-colors",
                        activeChatId === chat.id ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                      )}>
                        {chat.title}
                      </p>
                      <p className="text-[10px] text-gray-600 font-medium">
                        {new Date(chat.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>

          {/* Main Chat Area */}
          <main className="flex-1 flex flex-col relative">
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#0F0F11]/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-500">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Especialista do Teclado</h1>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-green-500/80 uppercase tracking-widest">Agente Online com Busca na Web</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex items-center justify-center text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12 custom-scrollbar"
            >
              {!activeChatId ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
                  <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center text-yellow-500/50 mb-8">
                    <Bot className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Olá, Aluno!</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    Eu sou o seu Especialista do Teclado. Pergunte-me qualquer coisa sobre atalhos, layouts, teclados mecânicos ou dicas de postura.
                  </p>
                  <button 
                    onClick={() => createNewChat()}
                    className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-yellow-500/10"
                  >
                    Iniciar Nova Conversa
                  </button>
                </div>
              ) : activeChat?.messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
                  <Globe className="w-12 h-12 mb-4 animate-spin-slow" />
                  <p className="text-xs font-black uppercase tracking-[0.3em]">Aguardando sua pergunta...</p>
                </div>
              ) : (
                activeChat?.messages.map((m, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "flex gap-6 max-w-4xl",
                      m.role === 'user' ? "flex-row-reverse ml-auto items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                      m.role === 'user' ? "bg-white/10 text-white" : "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                    )}>
                      {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={cn(
                      "flex flex-col gap-2",
                      m.role === 'user' ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "p-6 rounded-[32px] text-sm leading-relaxed font-medium whitespace-pre-wrap transition-colors",
                        m.role === 'user' 
                          ? "bg-white/5 text-gray-200 rounded-tr-none border border-white/10" 
                          : "bg-[#1A1A1D] text-gray-300 rounded-tl-none border border-white/5"
                      )}>
                        {m.text}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 px-2">
                        {m.role === 'user' ? 'Você' : 'Especialista'}
                      </span>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex gap-6 items-start">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-yellow-500 text-black flex items-center justify-center animate-pulse">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                  <div className="bg-[#1A1A1D] border border-white/5 p-6 rounded-[32px] rounded-tl-none">
                    <div className="flex gap-1.5 h-4 items-center">
                      <div className="w-1.5 h-1.5 bg-yellow-500/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-yellow-500/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-yellow-500/50 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-8 border-t border-white/5 bg-[#0F0F11]/80 backdrop-blur-md">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!activeChatId) createNewChat(input);
                  else handleSend(input);
                }}
                className="max-w-4xl mx-auto flex items-center gap-4 relative"
              >
                <div className="relative flex-1 group">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={activeChatId ? "Pergunte sobre atalhos, equipamentos..." : "O que você quer aprender hoje?"}
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-yellow-500/50 rounded-[28px] py-6 px-8 text-white placeholder-gray-600 outline-none transition-all pr-20 font-medium"
                    disabled={isLoading}
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    <Search className="w-5 h-5 text-gray-600 group-focus-within:text-yellow-500/50 transition-colors" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-[72px] h-[72px] bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:hover:bg-yellow-500 text-black rounded-full flex items-center justify-center transition-all shadow-xl shadow-yellow-500/10 active:scale-95"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                </button>
              </form>
              <p className="text-center mt-4 text-[10px] font-black text-gray-600 uppercase tracking-widest select-none">
                Pressione Enter para enviar • O Especialista pode usar informações da internet
              </p>
            </div>
          </main>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
