import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { OrbitControls, useGLTF, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { CollisionEnterPayload, CuboidCollider, RapierRigidBody, RigidBody, useRapier } from '@react-three/rapier';
import { KinematicCharacterController } from '@dimforge/rapier3d';
import { useShipStore } from '../store';

const shouldRotate = (rotate: number) => {
  return Math.abs(rotate) < Math.PI * 0.1;
}

const getShipPosition = (ship: RapierRigidBody) => {
  const { x, y, z } = ship.translation();
  return new THREE.Vector3(x, y, z);
}

const INITIAL_SPEED = 0.1;

export function Player() {
  const shipModel = useGLTF('ship.gltf');
  
  const shipRef = useRef<RapierRigidBody>(null!);
  const exhaustRef1 = useRef<THREE.Mesh>(null!);
  const exhaustRef2 = useRef<THREE.Mesh>(null!);
  const controllerRef = useRef<KinematicCharacterController>(null!);

  const { setShipPosition, setCameraPosition } = useShipStore();
  const { world } = useRapier();

  // Camera
  useFrame((state) => {
    const ship = shipRef.current;
    const shipPosition = getShipPosition(ship);

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(shipPosition);
    cameraPosition.z += 10;
    cameraPosition.y += 5;
    state.camera.position.copy(cameraPosition);
    state.camera.lookAt(shipPosition);

    setCameraPosition(cameraPosition);
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

  // Ship Movement
  const [_, getKeys] = useKeyboardControls();
  useFrame((state, delta) => {
    const ship = shipRef.current;
    const shipPosition = getShipPosition(ship);
    const rotation = ship.rotation();
    const speed = INITIAL_SPEED + (state.clock.elapsedTime * 0.001);

    const { forward, backward, left, right } = getKeys();

    const translation = new THREE.Vector3(...shipPosition);
    // const translation = new THREE.Vector3(shipPosition.x, shipPosition.y, shipPosition.z - speed);
    const distance = delta * 10;
    const degree = Math.PI * delta;

    switch (true) {
      case forward: {
        translation.y += distance;
        const rotate = rotation.x + degree;
        if (shouldRotate(rotate)) {
          rotation.x = rotate;
        }
        break;
      } case backward: {
        translation.y -= distance;
        const rotate = rotation.x - degree;
        if (shouldRotate(rotate)) {
          rotation.x = rotate;
        }
        break;
      } case left: {
        translation.x -= distance;
        const rotate = rotation.z + degree;
        if (shouldRotate(rotate)) {
          rotation.z = rotate;
        }
        break;
      } case right: {
        translation.x += distance;
        const rotate = rotation.z - degree;
        if (shouldRotate(rotate)) {
          rotation.z = rotate;
        }
        break;
      } default:
        if (Math.abs(rotation.z) > delta * 1.1) {
          rotation.z -= Math.PI * delta * Math.sign(rotation.z);
        }
        if (Math.abs(rotation.x) > delta * 1.1) {
          rotation.x -= Math.PI * delta * Math.sign(rotation.x);
        }
        break;
    }

    const controller = controllerRef.current;
    controller.computeColliderMovement(
      ship.collider(0) as any,   // force type due to pnpm bug
      translation,
    );
    const collision = controller.computedCollision(0);
    if (collision && collision.toi === 0) {
      translation.copy(shipPosition);
    }

    ship.setNextKinematicTranslation(translation);
    ship.setNextKinematicRotation(rotation);

    setShipPosition(getShipPosition(ship));
  });

  // Initial Loading
  useEffect(() => {
    const characterController = world.createCharacterController(0.0001);
    controllerRef.current = characterController as any;
    
    return () => {
      world.removeCharacterController(characterController);
    }
  }, []);

  const onCollisionEnter = (collision: CollisionEnterPayload) => {
    const name = collision.colliderObject?.name;
    if (name === 'rock') {
      console.log('GAME OVER');
    }
  }

  return (
    <>
      <OrbitControls />

      <RigidBody ref={shipRef}
        type="kinematicPosition"
        colliders={false}
        onCollisionEnter={onCollisionEnter}
      >
        <CuboidCollider args={[2, 2, 2]} />
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
      </RigidBody>
    </>
  );
}
