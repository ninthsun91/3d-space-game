import { useState } from 'react';
import { Game } from './Game';
import { GameOverModal, GameStartModal } from './modals';

function App() {
  const [start, setStart] = useState(false);

  /**
   * Start / Restart the game.
   * Ensures the user interacts the document first
   */
  const restart = () => {
    setStart(false);
    setTimeout(() => setStart(true), 100);
  }

  return (
    <>
      <GameStartModal start={() => setStart(true)} />
      <GameOverModal restart={restart} />

      <Game start={start} />
    </>
  )
}

export default App
