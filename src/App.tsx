import './App.css'
import {} from 'react'
import { Canvas } from '@react-three/fiber'
import { Perf }  from 'r3f-perf';
import { Lights } from './Lights';
import { Stars } from './Stars';
import { Lane } from './Lane';
import { OrbitControls } from '@react-three/drei';

function App() {

  return (
    <>
      <Canvas
        camera={{
          near: 0.1,
          far: 10000,
        }}
      >
        <Perf debug />
        <Lights />
        <OrbitControls />

        <Stars />
        <Lane />
      </Canvas>
    </>
  )
}

export default App
