import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface GitStoreState {
  repoName: string;
  currentBranch: string;
  completedCommands: string[];
  setRepoName: (name: string) => void;
  setCurrentBranch: (branch: string) => void;
  addCompletedCommand: (command: string) => void;
  resetGitState: () => void;
}

export const useGitStore = create<GitStoreState>()(
  persist(
    (set) => ({
      repoName: '',
      currentBranch: 'main',
      completedCommands: [],
      setRepoName: (name: string) => set({ repoName: name.trim() }),
      setCurrentBranch: (branch: string) => set({ currentBranch: branch.trim() }),
      addCompletedCommand: (command: string) =>
        set((state) => ({
          completedCommands: state.completedCommands.includes(command)
            ? state.completedCommands
            : [...state.completedCommands, command],
        })),
      resetGitState: () =>
        set({
          repoName: '',
          currentBranch: 'main',
          completedCommands: [],
        }),
    }),
    {
      name: 'gitworld_persistent_git_store',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : (undefined as any))),
    }
  )
);
