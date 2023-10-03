import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { OrbitControls, useGLTF, useKeyboardControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber';
import { CollisionEnterPayload, CuboidCollider, RapierRigidBody, RigidBody, useRapier } from '@react-three/rapier';
import { KinematicCharacterController } from '@dimforge/rapier3d';
import { useStatusStore } from '../store';

/**
 * Initial speed of the ship
 */
const INITIAL_SPEED = 0.1;

/**
 * Create the player
 */
export function Player() {
  const shipModel = useGLTF('ship.gltf');
  
  const shipRef = useRef<RapierRigidBody>(null!);
  const exhaustRef1 = useRef<THREE.Mesh>(null!);
  const exhaustRef2 = useRef<THREE.Mesh>(null!);
  const controllerRef = useRef<KinematicCharacterController>(null!);

  const [thrustSound] = useState(() => new Audio('/thrust.wav'));
  const [crashSound] = useState(() => new Audio('/crash.wav'));

  const { isGameOver, setShipPosition, setCameraPosition, setGameOver } = useStatusStore();
  const { world } = useRapier();
  const { clock } = useThree();

  /**
   * Set the camera position
   */
  useFrame((state) => {
    const ship = shipRef.current;
    const shipPosition = getShipPosition(ship);

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(shipPosition);
    cameraPosition.z += 10;
    cameraPosition.y += 7;
    state.camera.position.copy(cameraPosition);

    shipPosition.z -= 50;
    state.camera.lookAt(shipPosition);

    setCameraPosition(cameraPosition);
    console.log(shipPosition.z);
  });
  
  /**
   * Thruster exhuast animation
   */
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scale1 = 1 + Math.sin(time * 200);
    const scale2 = 1 + Math.cos(time * 200);
    exhaustRef1.current.scale.x = scale1;
    exhaustRef1.current.scale.y = scale1;
    exhaustRef2.current.scale.x = scale2;
    exhaustRef2.current.scale.y = scale2;
  });

  /**
   * Key bind ship movement
   */
  const [_, getKeys] = useKeyboardControls();
  useFrame((state, delta) => {
    const ship = shipRef.current;
    const shipPosition = getShipPosition(ship);

    /**
     * Stop the ship when game is over
     */
    if (isGameOver) {
      ship.setNextKinematicTranslation(shipPosition);
      state.clock.stop();
      return;
    }

    const rotation = ship.rotation();
    const speed = INITIAL_SPEED + (state.clock.elapsedTime * 0.01);

    const { forward, backward, left, right } = getKeys();

    const translation = new THREE.Vector3(shipPosition.x, shipPosition.y, shipPosition.z - speed);
    const distance = delta * 20;
    const degree = Math.PI * delta;

    /**
     * Adjust translation and rotation based on key input
     */
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
        /**
         * return to the original rotation if no key is pressed
         */
        if (Math.abs(rotation.z) > delta * 1.1) {
          rotation.z -= Math.PI * delta * Math.sign(rotation.z);
        }
        if (Math.abs(rotation.x) > delta * 1.1) {
          rotation.x -= Math.PI * delta * Math.sign(rotation.x);
        }
        break;
    }

    /**
     * Compute collision
     */
    const controller = controllerRef.current;
    controller.computeColliderMovement(
      ship.collider(0) as any,   // force type due to pnpm bug
      translation,
    );
    const collision = controller.computedCollision(0);
    if (collision && collision.toi === 0) {
      translation.copy(shipPosition);
    }

    /**
     * Set the next position and rotation
     */
    ship.setNextKinematicTranslation(translation);
    ship.setNextKinematicRotation(rotation);

    setShipPosition(getShipPosition(ship));
  });

  /**
   * Initial loading
   * create character controller and setup sounds
   */
  useEffect(() => {
    const characterController = world.createCharacterController(0.0001);
    controllerRef.current = characterController as any;

    clock.start();

    crashSound.volume = 0.3;
    thrustSound.loop = true;
    thrustSound.volume = 0.05;
    thrustSound.play();
    
    return () => {
      world.removeCharacterController(characterController);
    }
  }, []);

  /**
   * Collision handler
   * game over when the ship collides with a rock
   */
  const onCollisionEnter = (collision: CollisionEnterPayload) => {
    const name = collision.colliderObject?.name;
    if (name === 'rock' && !isGameOver) {
      thrustSound.pause();
      crashSound.play();

      const elapsedTime = clock.getElapsedTime();
      const position = getShipPosition(shipRef.current);
      setGameOver(elapsedTime, position);
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
        <CuboidCollider args={[1, 1, 2]} />
        <CuboidCollider args={[4, 0.2, 1]} />
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

/**
 * Check if the ship has rotated too much
 */
const shouldRotate = (rotate: number) => {
  return Math.abs(rotate) < Math.PI * 0.1;
}

/**
 * Convert Rapier.Vector to THREE.Vector3
 */
const getShipPosition = (ship: RapierRigidBody) => {
  const { x, y, z } = ship.translation();
  return new THREE.Vector3(x, y, z);
}