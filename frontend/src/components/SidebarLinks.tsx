'use client';

export default function SidebarLinks() {
  const buttonBase =
    "w-full text-left flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 font-medium";

  const glowHover =
    "hover:border-neonCyan border border-transparent hover:bg-[#163c5a]";

  const clearAll = () => {
    const confirmClear = confirm('Are you sure you want to permanently delete all saved chats and history?');
    if (confirmClear) {
      localStorage.removeItem('alchemist-chat-history'); // all saved sessions
      localStorage.removeItem('alchemist-chat');         // current session
      window.dispatchEvent(new CustomEvent('history-cleared'));
      alert('🗑️ All saved chats and history cleared!');
    }
  };

  return (
    <nav className="space-y-3 text-sm font-medium text-white mb-6">
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('clear-chat'))}
        className={`${buttonBase} ${glowHover}`}
      >
        <span className="text-lg">➕</span>
        <span>New Chat</span>
      </button>

      <button
        onClick={() => window.dispatchEvent(new CustomEvent('open-history'))}
        className={`${buttonBase} ${glowHover}`}
      >
        <span className="text-lg">🕘</span>
        <span>History</span>
      </button>

      <button
        onClick={clearAll}
        className={`${buttonBase} ${glowHover} text-red-400 hover:text-red-500`}
      >
        <span className="text-lg">🗑️</span>
        <span>Clear History</span>
      </button>
    </nav>
  );
}
