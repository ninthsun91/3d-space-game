import { RigidBody, CuboidCollider } from '@react-three/rapier';

/**
 * WIDTH: width and height of the flyable field
 * LENGTH: length of the flyable field
 */
const WIDTH = 30;
const LENGTH = 100;

type Props = {
  position: [number, number, number];
  rotation: [number, number, number];
};

/**
 * Create invisible walls
 */
export function Walls() {
  return (
    <>
      <Wall rotation={[Math.PI * 0.5, 0, 0]} position={[0, WIDTH, -LENGTH]} />
      <Wall rotation={[Math.PI * 0.5, 0, 0]} position={[0, -WIDTH, -LENGTH]} />
      <Wall rotation={[Math.PI * 0.5, Math.PI * 0.5, 0]} position={[WIDTH, 0, -LENGTH]} />
      <Wall rotation={[Math.PI * 0.5, Math.PI * 0.5, 0]} position={[-WIDTH, 0, -LENGTH]} />
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
      <CuboidCollider args={[WIDTH, LENGTH, 0.01]} />
    </RigidBody>
  );
}