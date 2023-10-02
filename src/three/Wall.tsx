import { RigidBody, CuboidCollider } from '@react-three/rapier';

const LENGTH = 50

type Props = {
  position: [number, number, number];
  rotation: [number, number, number];
};

export function Walls() {
  return (
    <>
      <Wall rotation={[Math.PI * 0.5, 0, 0]} position={[0, LENGTH, 0]} />
      <Wall rotation={[Math.PI * 0.5, 0, 0]} position={[0, -LENGTH, 0]} />
      <Wall rotation={[Math.PI * 0.5, Math.PI * 0.5, 0]} position={[LENGTH, 0, 0]} />
      <Wall rotation={[Math.PI * 0.5, Math.PI * 0.5, 0]} position={[-LENGTH, 0, 0]} />
    </>
  );
}

function Wall({ rotation, position }: Props) {
  return (
    <RigidBody
      type="fixed"
      restitution={0}
      friction={0}
      rotation={rotation}
      position={position}
    >
      <CuboidCollider args={[LENGTH, 1000, 0.01]}/>
    </RigidBody>
  );
}