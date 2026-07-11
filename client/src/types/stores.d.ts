export interface UseCurrentGuild {
    guildId: string | null;
    actions: {
        setGuildId: (value: string | null) => void;
    };
}
