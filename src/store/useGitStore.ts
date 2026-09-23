import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CommitData {
  id: string;
  hash: string;
  message: string;
  isNew?: boolean;
}

export interface GitStoreState {
  userId: string | null;
  repoName: string;
  repo_name: string;
  currentBranch: string;
  current_branch_name: string;
  completedTopics: string[];
  completed_topics: string[];
  completedCommands: string[];
  commits: CommitData[];
  isMerged: boolean;
  setIsMerged: (val: boolean) => void;
  setUserId: (userId: string | null) => void;
  setRepoName: (name: string) => void;
  setRepo_name: (name: string) => void;
  setCurrentBranch: (branch: string) => void;
  setCompletedTopics: (topics: string[]) => void;
  addCompletedTopic: (topicId: string) => void;
  addCompletedCommand: (command: string) => void;
  addCommit: (message: string, hash: string) => void;
  initializeFromUserProgress: (record: {
    userId?: string | null;
    id?: string;
    user_id?: string;
    completed_topics?: string[];
    completedTopics?: string[];
    repo_name?: string;
    repoName?: string;
    current_branch_name?: string;
    currentBranch?: string;
    commits?: CommitData[];
  } | any) => void;
  resetGitState: () => void;
  logout: (supabase?: any, router?: any) => Promise<void>;
}

export const useGitStore = create<GitStoreState>()(
  persist(
    (set) => ({
      userId: null,
      repoName: '',
      repo_name: '',
      currentBranch: 'main',
      current_branch_name: 'main',
      completedTopics: [],
      completed_topics: [],
      completedCommands: [],
      commits: [{ id: 'c0', hash: '9a01fd2', message: 'genesis snapshot' }],
      isMerged: false,
      setIsMerged: (val: boolean) => set({ isMerged: val }),
      setUserId: (userId: string | null) => set({ userId }),
      setRepoName: (name: string) => {
        const clean = name ? name.trim() : '';
        set({ repoName: clean, repo_name: clean });
      },
      setRepo_name: (name: string) => {
        const clean = name ? name.trim() : '';
        set({ repoName: clean, repo_name: clean });
      },
      setCurrentBranch: (branch: string) => {
        const clean = branch ? branch.trim() : 'main';
        set({ currentBranch: clean, current_branch_name: clean });
      },
      setCompletedTopics: (topics: string[]) =>
        set({ completedTopics: topics, completed_topics: topics }),
      addCompletedTopic: (topicId: string) =>
        set((state) => {
          const list = state.completedTopics || [];
          const updated = list.includes(topicId) ? list : [...list, topicId];
          return { completedTopics: updated, completed_topics: updated };
        }),
      addCompletedCommand: (command: string) =>
        set((state) => ({
          completedCommands: state.completedCommands.includes(command)
            ? state.completedCommands
            : [...state.completedCommands, command],
        })),
      addCommit: (message: string, hash: string) =>
        set((state) => ({
          commits: [
            ...state.commits.map((c) => ({ ...c, isNew: false })),
            { id: `c${state.commits.length}`, hash, message, isNew: true },
          ],
        })),
      initializeFromUserProgress: (record: any) => {
        const uid = record?.userId || record?.id || record?.user_id || null;
        const topics = record?.completed_topics || record?.completedTopics || ['init'];
        const repo = record?.repo_name || record?.repoName || '';
        const branch = record?.current_branch_name || record?.currentBranch || 'main';
        const commits = Array.isArray(record?.commits) && record.commits.length > 0
          ? record.commits
          : [{ id: 'c0', hash: '9a01fd2', message: 'genesis snapshot' }];
        const isMerged = Boolean(record?.isMerged);
        set({
          userId: uid,
          repoName: repo,
          repo_name: repo,
          currentBranch: branch,
          current_branch_name: branch,
          completedTopics: topics,
          completed_topics: topics,
          commits,
          isMerged,
        });
      },
      resetGitState: () =>
        set({
          userId: null,
          repoName: '',
          repo_name: '',
          currentBranch: 'main',
          current_branch_name: 'main',
          completedTopics: [],
          completed_topics: [],
          completedCommands: [],
          commits: [{ id: 'c0', hash: '9a01fd2', message: 'genesis snapshot' }],
          isMerged: false,
        }),
      logout: async (supabase?: any, router?: any) => {
        await logoutUser(supabase, router);
      },
    }),
    {
      name: 'gitworld-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : (undefined as any))),
    }
  )
);

/**
 * Logout function: signs out of Supabase, purges localStorage 'gitworld-storage', resets store state, and navigates to '/'
 */
export const logoutUser = async (supabase?: any, router?: any) => {
  try {
    if (supabase?.auth?.signOut) {
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.error('SignOut error:', err);
  }
  useGitStore.getState().resetGitState();
  if (typeof window !== 'undefined') {
    try {
      if (useGitStore.persist?.clearStorage) {
        useGitStore.persist.clearStorage();
      }
    } catch {}
    localStorage.removeItem('gitworld-storage');
    localStorage.removeItem('gitworld_progress');
    localStorage.removeItem('gitworld_persistent_git_store');
  }
  if (router && typeof router.push === 'function') {
    router.push('/');
  }
};

export const logout = logoutUser;
