import './App.css'
import {} from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei';
import { Perf }  from 'r3f-perf';

import { Lights } from './Lights';
import { Stars } from './Stars';
import { Lane } from './Lane';
import { Player } from './Player';

function App() {

  return (
    <KeyboardControls
      map={[
        { name: 'forward', keys: [ 'KeyW', 'ArrowUp' ] },
        { name: 'backward', keys: [ 'KeyS', 'ArrowDown' ] },
        { name: 'left', keys: [ 'KeyA', 'ArrowLeft' ] },
        { name: 'right', keys: [ 'KeyD', 'ArrowRight' ] },
      ]}
    >
      <Canvas
        camera={{
          near: 0.1,
          far: 10000,
        }}
      >
        <Perf debug />
        <Lights />

        <Stars />
        <Lane />

        <Player />
      </Canvas>
    </KeyboardControls>
  )
}

export default App
