import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';

const wallGeometry = new THREE.BoxGeometry(10, 10, 0.1);
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'white' });

export function Wall() {
  return (
    <RigidBody
      type="fixed"
      restitution={0}
      friction={0}
    >
      <mesh
        geometry={wallGeometry}
        material={wallMaterial}
        rotation-x={Math.PI * 0.5}
        position={[ 0, 10, 0 ]}
      />
    </RigidBody>
  );
}