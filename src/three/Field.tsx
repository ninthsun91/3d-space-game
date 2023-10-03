import { useState } from 'react';
import { Lane, Rocks, Walls } from '.';
import { useStatusStore } from '../store';

type FieldProps = {
  z: number;
}

export function Field({ z }: FieldProps) {
  const [blockStart, setBlockStart] = useState<number>(z);
  const [rerender, setRerender] = useState<number>(0);

  const { ship } = useStatusStore();

  if (ship.position.z < blockStart - 200) {
    setBlockStart(blockStart - 500);
    setRerender(rerender + 1);
  }
  
  return <group position={[ 0, 0, blockStart ]}>
    <Lane />
    <Walls />
    <Rocks rerender={rerender} />
  </group>;
}