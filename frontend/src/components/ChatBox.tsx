'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('alchemist-chat');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const saveHandler = () => {
      const firstUserMessage = messages.find(msg => msg.role === 'user');
      const title = firstUserMessage ? firstUserMessage.content.slice(0, 50) : 'Untitled Chat';

      const current = localStorage.getItem('alchemist-chat-history');
      const history = current ? JSON.parse(current) : [];

      history.push({
        title,
        messages,
      });

      localStorage.setItem('alchemist-chat-history', JSON.stringify(history));
      localStorage.setItem('alchemist-chat', JSON.stringify(messages));
      alert(`✅ Chat saved as "${title}"`);
    };

    const clearHandler = () => {
      localStorage.removeItem('alchemist-chat');
      setMessages([]);
    };

    const regenHandler = () => {
      const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
      if (lastUserMessage) {
        sendMessage(new Event('submit') as unknown as React.FormEvent, lastUserMessage.content);
      }
    };

    const restoreHandler = () => {
      const saved = localStorage.getItem('alchemist-chat');
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    };

    window.addEventListener('save-chat', saveHandler);
    window.addEventListener('clear-chat', clearHandler);
    window.addEventListener('regenerate-chat', regenHandler);
    window.addEventListener('chat-loaded', restoreHandler);

    return () => {
      window.removeEventListener('save-chat', saveHandler);
      window.removeEventListener('clear-chat', clearHandler);
      window.removeEventListener('regenerate-chat', regenHandler);
      window.removeEventListener('chat-loaded', restoreHandler);
    };
  }, [messages]);

  const sendMessage = async (e: React.FormEvent, promptOverride?: string) => {
    e.preventDefault();
    const userPrompt = promptOverride || input.trim();
    if (!userPrompt) return;

    const newMessage: Message = { role: 'user', content: userPrompt };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantReply = '';

      const streamMessage: Message = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, streamMessage]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantReply += chunk;

        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.findIndex(msg => msg.role === 'assistant' && msg.content === '');
          if (lastIndex !== -1) updated[lastIndex].content = assistantReply;
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
        style={{
          background: 'radial-gradient(ellipse at top left, #0e1d31, #1f4e78)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
        }}
      >
        {/* Tagline */}
        <div className="text-center text-sm text-neonCyan mb-4 tracking-wide font-semibold italic">
          Alchemy meets AI — Ask away.
        </div>

        {/* Messages */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end flex-row-reverse' : 'justify-start'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              {msg.role === 'assistant' ? (
                <>
                  <div className="text-xs text-neonCyan font-bold tracking-wide">AlChemist</div>
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-md border border-neonCyan">
                    <Image
                      src="/avatars/assistant.png"
                      alt="AlChemist Avatar"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                </>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center font-semibold text-white">
                  👤
                </div>
              )}
            </div>

            <div
              className={`max-w-2xl px-4 py-3 rounded-xl whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#1f1f1f] text-white text-right font-bold'
                  : 'bg-cyan-100 text-black border border-neonCyan/40 shadow-sm'
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3 justify-start">
            <div className="flex flex-col items-center gap-1">
              <div className="text-xs text-neonCyan font-bold tracking-wide">AlChemist</div>
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-md border border-neonCyan">
                <Image
                  src="/avatars/assistant.png"
                  alt="AlChemist Avatar"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="max-w-2xl px-4 py-3 rounded-xl bg-cyan-100 text-black animate-pulse">
              AlChemist is thinking<span className="dot-flash ml-1">...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex items-center p-4 bg-white border-t border-gray-200 gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neonCyan text-black placeholder-gray-500"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-[#1f4e78] hover:bg-[#245a8c] text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Send
        </button>
      </form>
    </div>
  );
}
