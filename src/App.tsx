import Home from "@/pages/Home";
import Game from "@/pages/Game";
import GameOver from "@/pages/GameOver";
import { useGameStore } from "@/store/gameStore";

export default function App() {
  const phase = useGameStore(s => s.phase);

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      {phase === 'menu' && <Home />}
      {phase === 'playing' && <Game />}
      {phase === 'gameover' && <GameOver />}
    </div>
  );
}
