import * as THREE from 'three';
import { create } from 'zustand';

type StatusState = {
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
}

const statusStoreInit: StatusState = {
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