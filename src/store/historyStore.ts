import { create } from 'zustand';

type HistoryState = {
  history: number[];
}

interface HistoryStore extends HistoryState {
  pushHistory: (elapsedTime: number) => void;
}

const historyStoreInit: HistoryState = {
  history: [],
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  ...historyStoreInit,
  pushHistory: (elapsedTime: number) => set(({ history }) => {
    history.push(elapsedTime);
    history.sort((a, b) => b - a);
    return { history };
  }),
}));
