'use client';

import { useEffect, useState } from 'react';

type ChatItem = {
  title: string;
  messages: any[];
};

export default function HistoryPanel() {
  const [visible, setVisible] = useState(false);
  const [history, setHistory] = useState<ChatItem[]>([]);

  useEffect(() => {
    const openHandler = () => {
      const saved = localStorage.getItem('alchemist-chat-history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      } else {
        setHistory([]); // if nothing found
      }
      setVisible(true);
    };

    const clearHandler = () => setHistory([]); // 🧹 on clear, wipe state too

    window.addEventListener('open-history', openHandler);
    window.addEventListener('history-cleared', clearHandler); // ✅ listens to event

    return () => {
      window.removeEventListener('open-history', openHandler);
      window.removeEventListener('history-cleared', clearHandler);
    };
  }, []);

  const loadChat = (chat: ChatItem) => {
    localStorage.setItem('alchemist-chat', JSON.stringify(chat.messages));
    window.dispatchEvent(new CustomEvent('chat-loaded'));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-[#0e1d31] text-white shadow-2xl border-l border-neonCyan z-50 p-4 overflow-y-auto backdrop-blur">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-neonCyan">🔮 Chat History</h2>
        <button onClick={() => setVisible(false)} className="text-white text-lg hover:text-red-400">×</button>
      </div>
      <div className="space-y-2">
        {history.length > 0 ? history.map((chat, i) => (
          <button
            key={i}
            onClick={() => loadChat(chat)}
            className="w-full text-left bg-[#1f4e78] hover:bg-neonCyan/20 rounded-md p-2 transition"
          >
            {chat.title || `Chat #${i + 1}`}
          </button>
        )) : (
          <p className="text-white/70">No saved chats found.</p>
        )}
      </div>
    </div>
  );
}
