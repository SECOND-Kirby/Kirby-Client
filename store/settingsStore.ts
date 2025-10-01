// store/settingsStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
    dailyGoalHours: number;
    serveGoal: number;
    soundEnabled: boolean;
    notificationEnabled: boolean;
}

interface SettingsActions {
    setDailyGoalHours: (hours: number) => void;
    setServeGoal: (goal: number) => void;
    setSoundEnabled: (enabled: boolean) => void;
    setNotificationEnabled: (enabled: boolean) => void;
    resetSettings: () => void;
}

type SettingsStore = SettingsState & SettingsActions;

const DEFAULT_SETTINGS: SettingsState = {
    dailyGoalHours: 2,
    serveGoal: 50,
    soundEnabled: true,
    notificationEnabled: true,
};

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            ...DEFAULT_SETTINGS,

            setDailyGoalHours: (hours: number) => {
                set({ dailyGoalHours: hours });
            },

            setServeGoal: (goal: number) => {
                set({ serveGoal: goal });
            },

            setSoundEnabled: (enabled: boolean) => {
                set({ soundEnabled: enabled });
            },

            setNotificationEnabled: (enabled: boolean) => {
                set({ notificationEnabled: enabled });
            },

            resetSettings: () => {
                set(DEFAULT_SETTINGS);
            },
        }),
        {
            name: 'settings-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);