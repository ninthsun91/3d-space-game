import * as THREE from 'three'
import { useRef } from 'react'
import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';

export function Player() {
  const shipModel = useGLTF('ship.gltf');

  const shipRef = useRef<THREE.Group>(null!);
  const exhaustRef1 = useRef<THREE.Mesh>(null!);
  const exhaustRef2 = useRef<THREE.Mesh>(null!);

  // Ship Animation
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

  // Key Mapping
  const [_, getKeys] = useKeyboardControls();
  useFrame((_, delta) => {
    const ship = shipRef.current;
    const { forward, backward, left, right } = getKeys();

    const force = new THREE.Vector3(0, 0, 0);
    const rotation = new THREE.Quaternion(0, 0, 0);
    const distance = delta * 10;

    switch (true) {
      case forward: {
        force.y += distance;
        const rotate = ship.rotation.x + (Math.PI * delta);
        if (Math.abs(rotate) < Math.PI * 0.25) {
          ship.rotation.x = rotate;
        }
        break;
      } case backward: {
        force.y -= distance;
        const rotate = ship.rotation.x + (Math.PI * -delta);
        if (Math.abs(rotate) < Math.PI * 0.25) {
          ship.rotation.x = rotate;
        }
        break;
      } case left: {
        force.x -= distance;
        const rotate = ship.rotation.z + (Math.PI * delta);
        if (Math.abs(rotate) < Math.PI * 0.25) {
          ship.rotation.z = rotate;
        }
        break;
      } case right: {
        force.x += distance;
        const rotate = ship.rotation.z + (Math.PI * -delta);
        if (Math.abs(rotate) < Math.PI * 0.25) {
          ship.rotation.z = rotate;
        }
        break;
      } default:
        if (ship.rotation.z < -delta) {
          ship.rotation.z += Math.PI * delta;
        } else if (ship.rotation.z > delta) {
          ship.rotation.z -= Math.PI * delta;
        }

        if (ship.rotation.x < -delta) {
          ship.rotation.x += Math.PI * delta;
        } else if (ship.rotation.x > delta) {
          ship.rotation.x -= Math.PI * delta;
        }
        break;
    }

    ship.position.add(force);
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
