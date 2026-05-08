import { InputState } from '../game/types';

export default function TouchControls({ input }: { input: React.MutableRefObject<InputState> }) {
  const btnClass = "w-14 h-14 bg-[#1a1a2e]/80 border-2 border-[#2a2a4a] rounded-xl flex items-center justify-center text-[#6a6a8c] font-mono text-lg active:bg-[#2a2a4a] active:border-[#4fc3f7] select-none touch-manipulation";

  const setKey = (key: keyof InputState, value: boolean) => {
    input.current[key] = value;
  };

  return (
    <div className="flex items-center justify-between w-full max-w-[800px] mt-2 md:hidden">
      <div className="grid grid-cols-3 gap-1">
        <div />
        <button
          className={btnClass}
          onPointerDown={() => setKey('up', true)}
          onPointerUp={() => setKey('up', false)}
          onPointerLeave={() => setKey('up', false)}
        >↑</button>
        <div />
        <button
          className={btnClass}
          onPointerDown={() => setKey('left', true)}
          onPointerUp={() => setKey('left', false)}
          onPointerLeave={() => setKey('left', false)}
        >←</button>
        <button
          className={btnClass}
          onPointerDown={() => setKey('down', true)}
          onPointerUp={() => setKey('down', false)}
          onPointerLeave={() => setKey('down', false)}
        >↓</button>
        <button
          className={btnClass}
          onPointerDown={() => setKey('right', true)}
          onPointerUp={() => setKey('right', false)}
          onPointerLeave={() => setKey('right', false)}
        >→</button>
      </div>

      <div className="flex gap-3">
        <button
          className="w-16 h-16 bg-[#2d5016]/80 border-2 border-[#4a8a22] rounded-full flex items-center justify-center text-white font-mono text-sm active:bg-[#4a8a22] select-none touch-manipulation"
          onPointerDown={() => setKey('jump', true)}
          onPointerUp={() => setKey('jump', false)}
          onPointerLeave={() => setKey('jump', false)}
        >跳</button>
        <button
          className="w-16 h-16 bg-[#8B0000]/80 border-2 border-[#ff4422] rounded-full flex items-center justify-center text-white font-mono text-sm active:bg-[#ff4422] select-none touch-manipulation"
          onPointerDown={() => setKey('shoot', true)}
          onPointerUp={() => setKey('shoot', false)}
          onPointerLeave={() => setKey('shoot', false)}
        >射</button>
      </div>
    </div>
  );
}
