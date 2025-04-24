'use client';

export default function SidebarButtons() {
  const emit = (name: string) => window.dispatchEvent(new CustomEvent(name));

  return (
    <div className="space-y-3 mt-6">
      <button
        onClick={() => emit('save-chat')}
        className="w-full bg-[#1f4e78] hover:bg-[#245a8c] text-white py-2 px-4 rounded-md font-medium transition"
      >
        Save Chat
      </button>
      <button
        onClick={() => emit('clear-chat')}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition"
      >
        Clear Chat
      </button>
      <button
        onClick={() => emit('regenerate-chat')}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md font-medium transition"
      >
        Regenerate
      </button>
    </div>
  );
}
