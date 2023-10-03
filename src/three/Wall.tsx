import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { FIELD_LENGTH, FIELD_WIDTH } from './const';

/**
 * WIDTH: width and height of the flyable field
 * FIELD_LENGTH: FIELD_LENGTH of the flyable field
 */
const WIDTH = FIELD_WIDTH / 2;

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
      <Wall rotation={[Math.PI * 0.5, 0, 0]} position={[0, WIDTH, -FIELD_LENGTH]} />
      <Wall rotation={[Math.PI * 0.5, 0, 0]} position={[0, -WIDTH, -FIELD_LENGTH]} />
      <Wall rotation={[Math.PI * 0.5, Math.PI * 0.5, 0]} position={[WIDTH, 0, -FIELD_LENGTH]} />
      <Wall rotation={[Math.PI * 0.5, Math.PI * 0.5, 0]} position={[-WIDTH, 0, -FIELD_LENGTH]} />
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
      <CuboidCollider args={[WIDTH, FIELD_LENGTH, 0.01]} />
    </RigidBody>
  );
}