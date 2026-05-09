import GameCanvas from '@/components/GameCanvas';
import HUD from '@/components/HUD';
import TouchControls from '@/components/TouchControls';
import { createInputState } from '@/game/input';
import { useRef } from 'react';

export default function Game() {
  const inputRef = useRef(createInputState());

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-2 px-2">
      <HUD />
      <GameCanvas inputRef={inputRef} />
      <TouchControls input={inputRef} />
    </div>
  );
}
