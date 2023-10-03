import { useState } from 'react';
import { Lane, Rocks, Walls } from '.';

type FieldProps = {
  z: number;
}

export function Field({ z }: FieldProps) {
  const [blockStart, setBlockStart] = useState<number>(z);
  return <group position={[ 0, 0, z ]}>
    <Lane />
    <Walls />
    <Rocks />
  </group>;
}