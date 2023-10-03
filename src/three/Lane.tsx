import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Object3DNode, extend } from '@react-three/fiber';
import { FIELD_LENGTH } from './const';

extend({ ReactAreaLight: THREE.RectAreaLight });
declare module '@react-three/fiber' {
  interface ThreeElements {
    reactAreaLight: Object3DNode<THREE.RectAreaLight, typeof THREE.RectAreaLight>;
  }
}

const LANE_LENGTH = 3;
const LANE_COUNT = (FIELD_LENGTH / LANE_LENGTH) * 2;
const laneGeometry = new THREE.PlaneGeometry(0.1, 2);
const laneMaterial = new THREE.MeshStandardMaterial({
  color: 'yellow',
  emissive: 'yellow',
  emissiveIntensity: 1,
  side: THREE.DoubleSide,
});

/**
 * Create track guide lanes
 */
export function Lane() {
  const lanes = useRef<THREE.InstancedMesh>(null!);

  /**
   * Set the position of each lane
   */
  useEffect(() => {
    for (let i = 0; i < LANE_COUNT; i++) {
      const isLeft = i % 2 === 0;
      const order = Math.floor(i / 2);

      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(isLeft ? -15 : 15, -0.5, -3 * order),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI * -0.5, 0, 0)),
        new THREE.Vector3(1, 1, 1),
      );
      lanes.current.setMatrixAt(i, matrix);
    }
  }, []);

  return (
    <>
      <instancedMesh ref={lanes} args={[ laneGeometry, laneMaterial, LANE_COUNT ]} >
        {/* AreaLight for lane visibility, but turn off for now due to performance issue */}
        {/* TODO: reuse created light object */}
        {/* <reactAreaLight
          attach="light"
          width={10}
          height={20}
          intensity={2000}
          color="white"
          position={[ -2, -0.49, -3 ]}
          // position={[ isLeft ? -2 : 2, -0.49, -3 * order ]}
          // rotation-x={Math.PI * 0.5}
        /> */}
      </instancedMesh>
    </>
  );
}