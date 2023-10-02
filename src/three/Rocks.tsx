import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF, useMatcapTexture } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

export function Rocks() {
  const rockModel = useGLTF('rock.gltf');
  const rockRef = useRef<THREE.Group>(null!);

  const [matcap] = useMatcapTexture('908E8E_292828_454444_595757', 256);
  useEffect(() => {
    matcap.colorSpace = THREE.SRGBColorSpace;
    matcap.needsUpdate = true;

    console.log("rock", rockRef.current.children[0]);
  }, []);
  return (
    <RigidBody position={[ 0, 5, 0 ]}>
      <group ref={rockRef}>
        <primitive object={rockModel.scene} scale={10} />
        <meshStandardMaterial attach="material" />
      </group>
    </RigidBody>
  );
}
