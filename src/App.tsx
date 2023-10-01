import './App.css'
import {} from 'react'
import { Canvas } from '@react-three/fiber'
import { Perf }  from 'r3f-perf';
import { Lights } from './Lights';

function App() {

  return (
    <>
      <Canvas>
        <Perf debug />
        <Lights />
      </Canvas>
    </>
  )
}

export default App
