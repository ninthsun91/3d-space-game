import { useState } from 'react';
import { Lane, Rocks, Walls } from '.';
import { useStatusStore } from '../store';

type FieldProps = {
  z: number;
}

/**
 * Create the field
 */
export function Field({ z }: FieldProps) {
  const [blockStart, setBlockStart] = useState<number>(z);
  const [rerender, setRerender] = useState<number>(Math.abs(z) / 100);

  const { ship } = useStatusStore();

  /**
   * Move the field to the next position
   * when the ship has reached a certain position
   */
  if (ship.position.z < blockStart - 200) {
    setBlockStart(blockStart - 500);
    setRerender(rerender + 5);
  }
  
  return <group position={[ 0, 0, blockStart ]}>
    <Lane />
    <Walls />
    <Rocks rerender={rerender} />
  </group>;
}