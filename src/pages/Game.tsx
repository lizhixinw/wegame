import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import GameCanvas from '../components/GameCanvas';
import HUD from '../components/HUD';
import MessageLog from '../components/MessageLog';
import MiniMap from '../components/MiniMap';
import TouchControls from '../components/TouchControls';

export default function Game() {
  const phase = useGameStore(s => s.phase);
  const movePlayer = useGameStore(s => s.movePlayer);
  const waitTurn = useGameStore(s => s.waitTurn);
  const useInventoryItem = useGameStore(s => s.useInventoryItem);
  const descendStairs = useGameStore(s => s.descendStairs);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (phase !== 'playing') return;
    e.preventDefault();

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        movePlayer(0, -1);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        movePlayer(0, 1);
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        movePlayer(-1, 0);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        movePlayer(1, 0);
        break;
      case ' ':
      case '.':
        waitTurn();
        break;
      case '>':
      case 'Shift':
        if (e.key === '>') descendStairs();
        break;
      case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8':
        useInventoryItem(parseInt(e.key) - 1);
        break;
    }
  }, [phase, movePlayer, waitTurn, useInventoryItem, descendStairs]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (phase === 'menu') return null;
  if (phase === 'gameover') return null;

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center p-2 md:p-4">
      <div className="flex flex-col md:flex-row gap-3 items-start">
        <div className="flex flex-col items-center">
          <GameCanvas />
          <TouchControls />
        </div>
        <div className="flex flex-col gap-2">
          <HUD />
          <MiniMap />
        </div>
      </div>
      <div className="w-full max-w-[500px] md:max-w-[700px] mt-2">
        <MessageLog />
      </div>
    </div>
  );
}
