import { memo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { FIELD_LENGTH, FIELD_WIDTH } from './const';

const ROCK_COUNTS = 100;

type RocksProp = {
  rerender: number;
}

/**
 * Create rocks
 */
export function Rocks({ rerender }: RocksProp) {
  const { nodes, materials } = useGLTF('rock.gltf') as RockModel;

  return <>
    {Array(ROCK_COUNTS).fill(0).map((_, i) => (
      <Rock key={`rock-${i}`} nodes={nodes} materials={materials} rerender={rerender} />
    ))}
  </>
}

type RockProps = {
  nodes: RockModel['nodes'],
  materials: RockModel['materials'],
  rerender: number;
}

/**
 * Memo each rock to preserve movements
 */
const Rock = memo(({ nodes, materials }: RockProps) => {
  const rockRef = useRef<RapierRigidBody>(null!);
  
  /**
   * Set random speed and torque to each rock
   */
  useEffect(() => {
    const rock = rockRef.current;
    const speed = Math.random() * 20;
    rock.addForce(new THREE.Vector3(0, 0, speed), true);
    rock.addTorque(new THREE.Vector3(Math.random(), Math.random(), Math.random()), true);
  }, []);

  return (
    <RigidBody ref={rockRef}
      position={randomRockPosition()}
      rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
      scale={Math.random() * 5 + 2}
      colliders="hull"
      name="rock"
    >
      <mesh
        geometry={nodes.node_id4_Material_52_0.geometry}
        material={materials.Material_52}
      />
    </RigidBody>
  )
}, (prev, next) => prev.rerender === next.rerender);

const randomRockPosition = (): [number, number, number] => {
  /**
   * offset from the flyable field
   */
  const ROCK_OFFSET = 20;

  /**
   * set random rock position
   * MAX_X, MAX_Y, MAX_Z should be greater than flyable field range
   */
  const MAX_X = FIELD_WIDTH + 20;
  const MAX_Y = FIELD_WIDTH + 20;
  const MAX_Z = (FIELD_LENGTH + ROCK_OFFSET) * -1;
  const x = (Math.random() - 0.5) * MAX_X;
  const y = (Math.random() - 0.5) * MAX_Y;
  const z = (Math.random() * MAX_Z) - ROCK_OFFSET;
  return [ x, y, z ];
}

type RockModel = ReturnType<typeof useGLTF<string>> & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.MeshStandardMaterial>;
}