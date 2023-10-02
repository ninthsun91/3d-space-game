import './App.css'
import {} from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Perf }  from 'r3f-perf';

import { Lane, Lights, Player, Stars } from './three';

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
        <Physics debug>
          <Lane />

          <Player />
        </Physics>
      </Canvas>
    </KeyboardControls>
  )
}

export default App
