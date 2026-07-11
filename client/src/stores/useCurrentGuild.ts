import { UseCurrentGuild } from '@/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export const useCurrentGuild = create<UseCurrentGuild>()(
    persist(
        immer((set, get) => ({
            guildId: null,
            actions: {
                setGuildId: (value) =>
                    set((state) => {
                        state.guildId = value;
                    }),
            },
        })),
        {
            version: 1,
            name: 'current-guild-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ guildId: state.guildId }),
            migrate: (persistedState, version) => {
                return persistedState;
            },
        },
    ),
);
