import { create } from 'zustand'

interface AppState {
  selectedProjectId: string | null
  setSelectedProject: (projectId: string | null) => void
}

const useAppStore = create<AppState>((set) => ({
  selectedProjectId: null,

  setSelectedProject: (projectId) =>
    set({
      selectedProjectId: projectId,
    }),
}))

export default useAppStore