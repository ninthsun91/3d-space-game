import { memo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';

type RockModel = ReturnType<typeof useGLTF<string>> & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.MeshStandardMaterial>;
}

const ROCK_COUNTS = 1000;

export function Rocks() {
  const { nodes, materials } = useGLTF('rock.gltf') as RockModel;

  return Array(ROCK_COUNTS).fill(0).map((_, i) => (
    <Rock key={`rock-${i}`} nodes={nodes} materials={materials} />
  ));
}

type RockProps = {
  nodes: RockModel['nodes'],
  materials: RockModel['materials'],
}

const randomRockPosition = (): [number, number, number] => {
  const MAX_X = 80;
  const MAX_Y = 80;
  const MAX_Z = -1000;
  const x = (Math.random() - 0.5) * MAX_X;
  const y = (Math.random() - 0.5) * MAX_Y;
  const z = Math.random() * MAX_Z - 20;
  return [ x, y, z ];
}

const Rock = memo(({ nodes, materials }: RockProps) => {
  const rockRef = useRef<RapierRigidBody>(null!);
  
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
});