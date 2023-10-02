import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Perf }  from 'r3f-perf';

import { Lane, Lights, Player, Rocks, Stars, Walls } from './three';

export function Game() {

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
          fov: 105,
          near: 0.1,
          far: 10000,
        }}
      >
        <Perf debug />
        <Lights />

        <Stars />
        <Lane />

        <Physics
          debug
          gravity={[ 0, 0, 0 ]}
        >
          <Walls />

          <Player />
          <Rocks />
        </Physics>
      </Canvas>
    </KeyboardControls>
  )
}