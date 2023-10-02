import * as THREE from 'three';
import { create } from 'zustand';

type ShipState = {
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

interface ShipStore extends ShipState {
  setShipPosition: (position: THREE.Vector3) => void;
  setCameraPosition: (position: THREE.Vector3) => void;
}

const shipStoreInit: ShipState = {
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

export const useShipStore = create<ShipStore>((set) => ({
  ...shipStoreInit,
  setShipPosition: (position: THREE.Vector3) => set(() => ({
    ship: {
      position: {
        ...position,
      }
    }
  })),
  setCameraPosition: (position: THREE.Vector3) => set(() => ({
    camera: {
      position: {
        ...position,
      }
    }
  })),
}));