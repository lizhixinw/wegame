import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export default function MessageLog() {
  const messages = useGameStore(s => s.messages);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  const recentMessages = messages.slice(-50);

  return (
    <div
      ref={logRef}
      className="bg-[#1a1a2e]/90 border border-[#2a2a4a] rounded-lg p-2 h-32 overflow-y-auto scrollbar-thin"
    >
      {recentMessages.map(msg => (
        <div
          key={msg.id}
          className="text-xs font-mono leading-5"
          style={{ color: msg.color }}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}
