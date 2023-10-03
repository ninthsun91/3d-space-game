import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Perf }  from 'r3f-perf';

import { Lane, Lights, Player, Rocks, Stars, Walls } from './three';

type GameProps = {
  start: boolean;
}

export function Game({ start }: GameProps) {
  const [bgm] = useState(() => new Audio('/space.wav'));
  
  /**
   * Play / Pause the background music
   */
  useEffect(() => {
    if (start) {
      bgm.play();
    } else {
      bgm.pause();
    }
  }, [start]);
  
  /**
   * Setup the background music
   */
  useEffect(() => {
    bgm.loop = true;
    bgm.volume = 1;
  }, []);

  return (
    /**
     * Key Binding
     * TODO: KeyD not working in Chrome
     */
    <KeyboardControls
      map={[
        { name: 'forward', keys: [ 'KeyW', 'ArrowUp' ] },
        { name: 'backward', keys: [ 'KeyS', 'ArrowDown' ] },
        { name: 'left', keys: [ 'KeyA', 'ArrowLeft' ] },
        { name: 'right', keys: [ 'KeyD', 'ArrowRight' ] },
      ]}
    >
      {/* All threejs objects must be in Canvas */}
      <Canvas
        camera={{
          fov: 105,
          near: 0.1,
          far: 10000,
          position: [ 0, 7, 10 ],
          lookAt: () => [ 0, 0, -50 ],
        }}
      >
        <Perf />
        <Lights />

        <Stars />
        <Lane />

        {/* All physical objects must be in Physics */}
        <Physics
          // debug
          gravity={[ 0, 0, 0 ]}
        >
          <Walls />

          {/* Load components only when the game starts */}
          {start && <Player />}
          {start && <Rocks />}
        </Physics>
      </Canvas>
    </KeyboardControls>
  )
}
