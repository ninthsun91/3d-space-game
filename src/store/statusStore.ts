import * as THREE from 'three';
import { create } from 'zustand';

type StatusState = {
  elapsedTime: number;
  distance: number;
  isGameOver: boolean;
  ship: {
    position: {
      x: number;
      y: number;
      z: number;
    }
  },
  camera: {
    position: {
      x: number;
      y: number;
      z: number;
    }
  }
}

interface StatusStore extends StatusState {
  setShipPosition: (position: THREE.Vector3) => void;
  setCameraPosition: (position: THREE.Vector3) => void;
  setGameOver: (elapsedTime: number, position: THREE.Vector3) => void;
  init: () => void;
}

const statusStoreInit: StatusState = {
  elapsedTime: 0,
  distance: 0,
  isGameOver: false,
  ship: {
    position: {
      x: 0,
      y: 0,
      z: 0,
    }
  },
  camera: {
    position: {
      x: 0,
      y: 0,
      z: 0,
    }
  } 
}

export const useStatusStore = create<StatusStore>((set) => ({
  ...statusStoreInit,
  setShipPosition: ({ x, y, z }: THREE.Vector3) => set(() => ({
    ship: {
      position: { x, y, z}
    },
    distance: Math.sqrt(x**2 + y**2 + z**2),
  })),
  setCameraPosition: (position: THREE.Vector3) => set(() => ({
    camera: {
      position: {
        ...position,
      }
    }
  })),
  setGameOver: (elapsedTime: number, { x, y, z }: THREE.Vector3) => set(({ isGameOver }) => {
    if (isGameOver) return {};

    return {
      elapsedTime,
      isGameOver: true,
      ship: {
        position: { x, y, z }
      },
      distance: Math.sqrt(x**2 + y**2 + z**2),
    }
  }),
  init: () => set(() => ({
    ...statusStoreInit,
  })),
}));
