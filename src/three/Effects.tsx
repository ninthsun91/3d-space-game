import { Bloom, EffectComposer } from '@react-three/postprocessing';

export function Effects() {
  return <EffectComposer>
    <Bloom />
  </EffectComposer>
}