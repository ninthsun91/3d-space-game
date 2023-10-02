import { useState } from 'react';
import { Game } from './Game';
import { GameOverModal } from './modals';

function App() {
  // TODO: Add game start modal
  // const [start, setStart] = useState();

  return (
    <>
      <GameOverModal />

      <Game />
    </>
  )
}

export default App
