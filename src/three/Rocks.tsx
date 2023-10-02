import { memo, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF, useMatcapTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';

type InstanceProps = {
  key: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

type RockModel = ReturnType<typeof useGLTF<string>> & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.MeshStandardMaterial>;
}

const ROCK_COUNTS = 100;

export function Rocks() {
  const rockModel = useGLTF('rock.gltf') as RockModel;
  console.log('rock', rockModel);
  const { nodes, materials } = rockModel;

  const [matcap] = useMatcapTexture('908E8E_292828_454444_595757', 256);
  useEffect(() => {
    matcap.colorSpace = THREE.SRGBColorSpace;
    matcap.needsUpdate = true;
  }, []);

  const instances = useMemo(() => {
    const instances = Array<InstanceProps>();
    for (let i = 0; i < ROCK_COUNTS; i++) {
      instances.push({
        key: `rock-${i}`,
        position: randomRockPosition(),
        rotation: [ 0, 0, 0 ],
        scale: Math.random() * 5 + 5,
      });
    }

    return instances;
  }, []);

  return Array(ROCK_COUNTS).fill(0).map((_, i) => (
    <Rock key={`rock-${i}`} nodes={nodes} materials={materials} />
  ));
}

type RockProps = {
  nodes: RockModel['nodes'],
  materials: RockModel['materials'],
  // data: any,
}

const randomRockPosition = (): [number, number, number] => {
  const MAX_X = 50;
  const MAX_Y = 50;
  const MAX_Z = -200;
  const x = (Math.random() - 0.5) * MAX_X;
  const y = (Math.random() - 0.5) * MAX_Y;
  const z = Math.random() * MAX_Z - 20;
  return [ x, y, z ];
}

const Rock = memo(({ nodes, materials }: RockProps) => {
  const rockRef = useRef<RapierRigidBody>(null!);
  
  useFrame((state) => {
    const rock = rockRef.current;
  });
  
  useEffect(() => {
    const rock = rockRef.current;
    const force = new THREE.Vector3(
      0,
      0,
      Math.random() * 50,
    );
    rock.addForce(force, true);
  }, []);

  return (
    <RigidBody ref={rockRef}
      position={randomRockPosition()}
      scale={Math.random() * 5 + 5}
      colliders="hull"
    >
      <mesh
        geometry={nodes.node_id4_Material_52_0.geometry}
        material={materials.Material_52}
      />
    </RigidBody>
  )
});