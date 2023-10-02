import { useState } from 'react';
import { Game } from './Game';
import { GameOverModal } from './modals';

function App() {
  const [start, setStart] = useState(true);

  const restart = () => {
    setStart(false);
    setTimeout(() => setStart(true), 100);
  }

  return (
    <>
      <GameOverModal restart={restart} />

      {start && <Game />}
    </>
  )
}

export default App
