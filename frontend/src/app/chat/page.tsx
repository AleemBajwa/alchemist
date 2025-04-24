'use client';

import { useEffect, useRef, useState } from 'react';

export default function ChatPage() {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<{ question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('alchemist-history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage when history changes
  useEffect(() => {
    localStorage.setItem('alchemist-history', JSON.stringify(history));
  }, [history]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      const answer = res.ok ? (data.response || 'No response content') : (data.error || 'Something went wrong');

      const updated = [...history, { question, answer }];
      setHistory(updated);
      setQuestion('');
    } catch (err) {
      console.error(err);
      setHistory([...history, { question, answer: 'Something went wrong' }]);
    }

    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: 'auto',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>🔮 Ask AlChemist</h1>

      <textarea
        placeholder="Ask your question here..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={4}
        style={{
          width: '100%',
          padding: '1rem',
          fontSize: '1rem',
          marginBottom: '1rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '2rem'
        }}
      >
        {loading ? 'Thinking...' : 'Ask'}
      </button>

      <div style={{
        background: '#f4f4f4',
        padding: '1rem',
        borderRadius: '5px',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {history.map((entry, idx) => (
          <div key={idx} style={{ marginBottom: '1.5rem' }}>
            <p><strong>🟡 You:</strong> {entry.question}</p>
            <p><strong>🧙 AlChemist:</strong> {entry.answer}</p>
          </div>
        ))}
        {history.length === 0 && <p>No questions yet.</p>}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
