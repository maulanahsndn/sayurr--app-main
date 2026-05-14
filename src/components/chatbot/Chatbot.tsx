import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, ChevronDown } from 'lucide-react';
import { useChatbot, type ChatMessage } from '@/hooks/useChatbot';

export function Chatbot() {
  const { messages, isOpen, setIsOpen, isTyping, unread, sendMessage, scrollRef, suggestions, streamingText } = useChatbot();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSend = () => { if (!input.trim()) return; sendMessage(input); setInput(''); };
  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } };
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 300); }, [isOpen]);

  return (
    <>
      {/* FLOATING BUBBLE */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[60] h-16 w-16 rounded-2xl flex items-center justify-center group overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #047857, #059669, #10b981, #34d399)', boxShadow: '0 0 30px rgba(16,185,129,0.5), 0 0 60px rgba(16,185,129,0.2)' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            <div className="absolute inset-1 rounded-xl border border-white/20 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="text-2xl drop-shadow-lg">🥬</div>
              <span className="text-[7px] font-black text-white/90 tracking-[0.2em] mt-0.5">MPOK</span>
            </div>
            <span className="absolute inset-0 rounded-2xl border-2 border-emerald-400/30 animate-ping pointer-events-none" style={{ animationDuration: '2.5s' }} />
            {unread > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-red-500/50 border-2 border-[#060608]">
                {unread}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-[70] w-full md:w-[400px] h-[100dvh] md:h-[580px] md:rounded-3xl overflow-hidden flex flex-col shadow-[0_20px_80px_rgba(0,0,0,0.6)] border border-white/[0.08]"
            style={{ background: 'rgba(6,8,10,0.97)', backdropFilter: 'blur(40px)' }}>

            {/* Header */}
            <div className="relative shrink-0 px-5 py-4 flex items-center justify-between border-b border-white/[0.06] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-emerald-500/10 to-transparent" />
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <div className="absolute -inset-2 bg-emerald-400/20 blur-xl rounded-2xl" />
                  <div className="relative h-12 w-12 rounded-xl flex items-center justify-center overflow-hidden border border-white/20"
                    style={{ background: 'linear-gradient(135deg, #047857, #059669, #10b981)', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
                    <span className="text-2xl drop-shadow-lg relative z-10">🥬</span>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/25 to-white/0 animate-pulse" style={{ animationDuration: '3s' }} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-[#060810]" style={{ boxShadow: '0 0 8px rgba(52,211,153,0.8)' }}>
                    <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" style={{ animationDuration: '2s' }} />
                  </span>
                </div>
                <div>
                  <p className="text-sm font-black text-white tracking-tight">Mpok Ris AI</p>
                  <p className="text-[10px] text-emerald-400/80 font-medium flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" /> Gemini AI · Online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90 relative z-10">
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar">
              {messages.map((msg, i) => (
                <MsgBubble key={msg.id} msg={msg} last={i === messages.length - 1} />
              ))}

              {/* Streaming text */}
              {streamingText && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
                  <BotAvatar />
                  <div className="max-w-[82%] px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-bl-md">
                    <p className="text-[13px] leading-relaxed whitespace-pre-line text-white/85">{streamingText}<span className="inline-block w-1.5 h-4 bg-emerald-400 animate-pulse ml-0.5 align-middle rounded-sm" /></p>
                  </div>
                </motion.div>
              )}

              {/* Typing dots */}
              {isTyping && !streamingText && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
                  <BotAvatar />
                  <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5 items-center">
                      <span className="text-[10px] text-emerald-400/60 mr-1">AI thinking</span>
                      {[0, 150, 300].map(d => (
                        <span key={d} className="h-2 w-2 rounded-full bg-emerald-400/60 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Suggestions */}
              {messages.length <= 1 && !isTyping && !streamingText && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="pt-2">
                  <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-2 ml-1">Coba tanyakan:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s: string) => (
                      <button key={s} onClick={() => sendMessage(s)}
                        className="text-[11px] font-medium text-emerald-400/80 bg-emerald-500/[0.08] border border-emerald-500/15 rounded-xl px-3 py-1.5 hover:bg-emerald-500/20 transition-all active:scale-95">
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="shrink-0 px-4 py-3 border-t border-white/[0.06] bg-black/40">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-2.5 focus-within:border-emerald-500/30 transition-all">
                  <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
                    placeholder="Ngobrol sama Mpok..." className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25 font-medium" />
                  <button className="text-white/20 hover:text-emerald-400 transition-colors ml-2 shrink-0"><Mic className="h-4 w-4" /></button>
                </div>
                <button onClick={handleSend} disabled={!input.trim() || isTyping}
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-black shadow-lg shadow-emerald-500/25 active:scale-90 transition-all disabled:opacity-30 shrink-0"
                  style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-center text-[9px] text-white/15 mt-2">Powered by Gemini AI · Mpok Ris 🥬</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function BotAvatar() {
  return (
    <div className="relative h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mb-0.5 overflow-hidden border border-emerald-400/20"
      style={{ background: 'linear-gradient(135deg, #047857, #10b981)', boxShadow: '0 0 10px rgba(16,185,129,0.3)' }}>
      <span className="text-sm drop-shadow">🥬</span>
    </div>
  );
}

function MsgBubble({ msg, last }: { msg: ChatMessage; last: boolean }) {
  const bot = msg.role === 'bot';
  return (
    <motion.div initial={last ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2 ${bot ? '' : 'flex-row-reverse'}`}>
      {bot && <BotAvatar />}
      <div className={`max-w-[82%] px-4 py-2.5 ${bot
        ? 'bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-bl-md'
        : 'rounded-2xl rounded-br-md shadow-lg shadow-emerald-500/15 border border-emerald-400/20'
      }`} style={bot ? {} : { background: 'linear-gradient(135deg, #059669, #10b981)' }}>
        <p className={`text-[13px] leading-relaxed whitespace-pre-line ${bot ? 'text-white/85' : 'text-black font-medium'}`}>{msg.text}</p>
        <p className={`text-[9px] mt-1 ${bot ? 'text-white/20' : 'text-black/40'}`}>{msg.time}</p>
      </div>
    </motion.div>
  );
}
