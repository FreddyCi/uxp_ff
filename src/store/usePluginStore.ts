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
  
  // Radio component state (for Features tab demos)
  radioPreferences: {
    basicOption: string;
    sizeSmall: string;
    sizeMedium: string;
    sizeLarge: string;
    horizontalAlignment: string;
    disabledExample: string;
  };
  
  // Stepper component state (for Features tab demos)
  stepperPreferences: {
    sizeXL: number;
  };
  
  // Actions
  setLastSavedFile: (path: string) => void;
  addRecentFile: (path: string) => void;
  setActiveTab: (tab: string) => void;
  toggleDarkMode: () => void;
  toggleAutoSave: () => void;
  setFileFormat: (format: 'txt' | 'json' | 'md') => void;
  clearRecentFiles: () => void;
  
  // Radio actions
  setRadioPreference: (key: keyof PluginState['radioPreferences'], value: string) => void;
  
  // Stepper actions
  setStepperPreference: (key: keyof PluginState['stepperPreferences'], value: number) => void;
  incrementStepper: (key: keyof PluginState['stepperPreferences'], step?: number) => void;
  decrementStepper: (key: keyof PluginState['stepperPreferences'], step?: number) => void;
}

export const usePluginStore = create<PluginState>((set, get) => ({
  // Initial state
  lastSavedFile: null,
  recentFiles: [],
  activeTab: 'files',
  isDarkMode: true,
  autoSave: false,
  fileFormat: 'txt',
  
  // Radio preferences initial state
  radioPreferences: {
    basicOption: 'option2',
    sizeSmall: 'small1',
    sizeMedium: 'medium1',
    sizeLarge: 'large1',
    horizontalAlignment: 'center',
    disabledExample: 'disabled2',
  },
  
  // Stepper preferences initial state
  stepperPreferences: {
    sizeXL: 1000,
  },
  
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
  
  clearRecentFiles: () => set({ recentFiles: [] }),
  
  // Radio actions
  setRadioPreference: (key: keyof PluginState['radioPreferences'], value: string) => {
    set((state) => ({
      radioPreferences: {
        ...state.radioPreferences,
        [key]: value
      }
    }));
  },
  
  // Stepper actions
  setStepperPreference: (key: keyof PluginState['stepperPreferences'], value: number) => {
    set((state) => ({
      stepperPreferences: {
        ...state.stepperPreferences,
        [key]: value
      }
    }));
  },
  
  incrementStepper: (key: keyof PluginState['stepperPreferences'], step: number = 1) => {
    set((state) => ({
      stepperPreferences: {
        ...state.stepperPreferences,
        [key]: state.stepperPreferences[key] + step
      }
    }));
  },
  
  decrementStepper: (key: keyof PluginState['stepperPreferences'], step: number = 1) => {
    set((state) => ({
      stepperPreferences: {
        ...state.stepperPreferences,
        [key]: state.stepperPreferences[key] - step
      }
    }));
  }
}));