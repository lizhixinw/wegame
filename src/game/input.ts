import { InputState } from './types';

export function createInputState(): InputState {
  return { left: false, right: false, up: false, down: false, jump: false, shoot: false };
}

export function setupInputListeners(input: InputState): () => void {
  const keyMap: Record<string, keyof InputState> = {
    'ArrowLeft': 'left', 'a': 'left', 'A': 'left',
    'ArrowRight': 'right', 'd': 'right', 'D': 'right',
    'ArrowUp': 'up', 'w': 'up', 'W': 'up',
    'ArrowDown': 'down', 's': 'down', 'S': 'down',
    ' ': 'jump',
    'z': 'shoot', 'Z': 'shoot',
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const key = keyMap[e.key];
    if (key) { input[key] = true; e.preventDefault(); }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    const key = keyMap[e.key];
    if (key) { input[key] = false; e.preventDefault(); }
  };

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  };
}
