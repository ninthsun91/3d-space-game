import { Bloom, DepthOfField, EffectComposer } from '@react-three/postprocessing';

export function Effects() {
  return <EffectComposer>
    <Bloom />
    <DepthOfField
      focusRange={0.1}
    />
  </EffectComposer>
}