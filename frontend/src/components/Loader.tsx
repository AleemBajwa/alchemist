'use client';

import { useState, useEffect } from 'react';

export default function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000); // You can adjust the time
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-orb">🧪</div>
      <div className="loader-text">AlChemist is initializing...</div>
    </div>
  );
}
