import { create } from 'zustand';

interface PluginState {
  // File management
  lastSavedFile: string | null;
  recentFiles: string[];
  
  // UI state
  activeTab: string;
  isDarkMode: boolean;
  
  // User preferences
  autoSave: boolean;
  fileFormat: 'txt' | 'json' | 'md';
  
  // Actions
  setLastSavedFile: (path: string) => void;
  addRecentFile: (path: string) => void;
  setActiveTab: (tab: string) => void;
  toggleDarkMode: () => void;
  toggleAutoSave: () => void;
  setFileFormat: (format: 'txt' | 'json' | 'md') => void;
  clearRecentFiles: () => void;
}

export const usePluginStore = create<PluginState>((set, get) => ({
  // Initial state
  lastSavedFile: null,
  recentFiles: [],
  activeTab: 'files',
  isDarkMode: true,
  autoSave: false,
  fileFormat: 'txt',
  
  // Actions
  setLastSavedFile: (path: string) => {
    set({ lastSavedFile: path });
    // Auto-add to recent files
    get().addRecentFile(path);
  },
  
  addRecentFile: (path: string) => {
    set((state) => {
      const newRecent = [path, ...state.recentFiles.filter(f => f !== path)].slice(0, 10);
      return { recentFiles: newRecent };
    });
  },
  
  setActiveTab: (tab: string) => set({ activeTab: tab }),
  
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  toggleAutoSave: () => set((state) => ({ autoSave: !state.autoSave })),
  
  setFileFormat: (format: 'txt' | 'json' | 'md') => set({ fileFormat: format }),
  
  clearRecentFiles: () => set({ recentFiles: [] })
}));