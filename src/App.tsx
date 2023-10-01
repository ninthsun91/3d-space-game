import './App.css'
import {} from 'react'
import { Canvas } from '@react-three/fiber'
import { Perf }  from 'r3f-perf';

function App() {

  return (
    <>
      <Canvas>
        <Perf debug />
      </Canvas>
    </>
  )
}

export default App
