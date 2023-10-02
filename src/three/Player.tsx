import * as THREE from 'three'
import { useRef } from 'react'
import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';

const shouldRotate = (rotate: number) => {
  return Math.abs(rotate) < Math.PI * 0.25;
}

export function Player() {
  const shipModel = useGLTF('ship.gltf');

  const shipRef = useRef<THREE.Group>(null!);
  const shipPhysicsRef = useRef<RapierRigidBody>(null!);
  const exhaustRef1 = useRef<THREE.Mesh>(null!);
  const exhaustRef2 = useRef<THREE.Mesh>(null!);

  // Camera
  useFrame((state) => {
    const ship = shipRef.current;

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(ship.position);
    cameraPosition.z += 10;
    cameraPosition.y += 5;
    state.camera.position.copy(cameraPosition);
    state.camera.lookAt(ship.position);
  });
  
  // Exhaust animation
  useFrame((state) => {
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

    const force = new THREE.Vector3(0, 0, delta * -1);
    const distance = delta * 10;
    const degree = Math.PI * delta;

    switch (true) {
      case forward: {
        force.y += distance;
        const rotate = ship.rotation.x + degree;
        if (shouldRotate(rotate)) {
          ship.rotation.x = rotate;
        }
        break;
      } case backward: {
        force.y -= distance;
        const rotate = ship.rotation.x - degree;
        if (shouldRotate(rotate)) {
          ship.rotation.x = rotate;
        }
        break;
      } case left: {
        force.x -= distance;
        const rotate = ship.rotation.z + degree;
        if (shouldRotate(rotate)) {
          ship.rotation.z = rotate;
        }
        break;
      } case right: {
        force.x += distance;
        const rotate = ship.rotation.z - degree;
        if (shouldRotate(rotate)) {
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
    <>
      <group ref={shipRef}>
        <RigidBody ref={shipPhysicsRef} type="kinematicPosition">
          <primitive object={shipModel.scene} position={[0, 0, 0]} rotation={[ 0, Math.PI, 0 ]} />
        </RigidBody>

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
    </>
  )
}
