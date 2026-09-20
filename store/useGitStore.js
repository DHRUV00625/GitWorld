import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useGitStore = create()(
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
      setUserId: (userId) => set({ userId }),
      setRepoName: (name) => {
        const clean = name ? name.trim() : '';
        set({ repoName: clean, repo_name: clean });
      },
      setCurrentBranch: (branch) => {
        const clean = branch ? branch.trim() : 'main';
        set({ currentBranch: clean, current_branch_name: clean });
      },
      setCompletedTopics: (topics) =>
        set({ completedTopics: topics, completed_topics: topics }),
      addCompletedTopic: (topicId) =>
        set((state) => {
          const list = state.completedTopics || [];
          const updated = list.includes(topicId) ? list : [...list, topicId];
          return { completedTopics: updated, completed_topics: updated };
        }),
      addCompletedCommand: (command) =>
        set((state) => ({
          completedCommands: state.completedCommands.includes(command)
            ? state.completedCommands
            : [...state.completedCommands, command],
        })),
      initializeFromUserProgress: (record) => {
        const uid = record?.userId || record?.id || record?.user_id || null;
        const topics = record?.completed_topics || record?.completedTopics || ['init'];
        const repo = record?.repo_name || record?.repoName || '';
        const branch = record?.current_branch_name || record?.currentBranch || 'main';
        set({
          userId: uid,
          repoName: repo,
          repo_name: repo,
          currentBranch: branch,
          current_branch_name: branch,
          completedTopics: topics,
          completed_topics: topics,
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
        }),
      logout: async (supabase, router) => {
        await logoutUser(supabase, router);
      },
    }),
    {
      name: 'gitworld-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : undefined)),
    }
  )
);

export const logoutUser = async (supabase, router) => {
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
