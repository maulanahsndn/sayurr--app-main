import { useState, useCallback, useRef, useEffect } from 'react';
import { sendToGemini, type ChatMsg } from '@/services/aiService';

export interface ChatMessage { id: string; role: 'user' | 'bot'; text: string; time: string; }

const SUGGESTIONS = ["Pok ada apa aja?", "Cabai berapa?", "Mau bikin soto", "Pesan sayuran", "Warung rame ga?", "Alamat warung"];

function ts() { return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: uid(), role: 'bot', text: 'Halo Bunda! 👋 Mpok Ris di sini~\n\nMau belanja apa hari ini? Tinggal ngobrol aja ya, Mpok bantu cariin! 😊\n\n🗣️ "Cabainya berapa pok?"\n🗣️ "Mau bikin soto, butuh apa?"\n🗣️ "Ada sayur seger ga?"', time: ts() }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const [streamingText, setStreamingText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<ChatMsg[]>([]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping, streamingText]);

  useEffect(() => { if (isOpen) setUnread(0); }, [isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: uid(), role: 'user', text: text.trim(), time: ts() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setStreamingText('');

    // Add to Gemini history
    historyRef.current.push({ role: 'user', parts: [{ text: text.trim() }] });

    try {
      const reply = await sendToGemini(text.trim(), historyRef.current.slice(0, -1));

      // Simulate streaming effect
      setIsTyping(false);
      let displayed = '';
      const chars = reply.split('');
      for (let i = 0; i < chars.length; i++) {
        displayed += chars[i];
        setStreamingText(displayed);
        await new Promise(r => setTimeout(r, 8));
      }
      setStreamingText('');

      const botMsg: ChatMessage = { id: uid(), role: 'bot', text: reply, time: ts() };
      setMessages(prev => [...prev, botMsg]);

      // Add to history
      historyRef.current.push({ role: 'model', parts: [{ text: reply }] });

      // Keep history manageable
      if (historyRef.current.length > 20) historyRef.current = historyRef.current.slice(-16);

      if (!isOpen) setUnread(prev => prev + 1);
    } catch (error) {
      setIsTyping(false);
      setStreamingText('');
      setMessages(prev => [...prev, { id: uid(), role: 'bot', text: 'Aduh maaf Bun, Mpok lagi error. Coba lagi ya! 🙏', time: ts() }]);
    }
  }, [isOpen]);

  return { messages, isOpen, setIsOpen, isTyping, unread, sendMessage, scrollRef, suggestions: SUGGESTIONS, streamingText };
}
