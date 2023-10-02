import * as THREE from 'three'
import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';

export function Player() {
  const shipModel = useGLTF('ship.gltf');

  const shipRef = useRef<THREE.Group>(null!);
  const exhaustRef1 = useRef<THREE.Mesh>(null!);
  const exhaustRef2 = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(shipRef.current.position);
    cameraPosition.z += 10;
    cameraPosition.y += 5;
    state.camera.position.copy(cameraPosition);
    state.camera.lookAt(shipRef.current.position);

    shipRef.current.position.z += delta * -1;

    const time = state.clock.getElapsedTime();
    const scale1 = 1 + Math.sin(time * 200);
    const scale2 = 1 + Math.cos(time * 200);
    exhaustRef1.current.scale.x = scale1;
    exhaustRef1.current.scale.y = scale1;
    exhaustRef2.current.scale.x = scale2;
    exhaustRef2.current.scale.y = scale2;
  });

  return (
    <group ref={shipRef}>
      <primitive object={shipModel.scene} position={[0, 0, 0]} rotation={[ 0, Math.PI, 0 ]} />

      <group>
        <mesh ref={exhaustRef1} scale={[1, 1, 3]} position={[0, 0.65, 2.85]}>
          <dodecahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial color="white" emissive="orange" emissiveIntensity={1} toneMapped={false} />
        </mesh>
        <mesh ref={exhaustRef2} scale={[1, 1, 3]} position={[0, -0.25, 2.85]}>
          <dodecahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial color="white" emissive="orange" emissiveIntensity={1} toneMapped={false} />
        </mesh>
      </group>

    </group>
  )
}
