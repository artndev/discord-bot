import { z } from "zod";
import { AI_PROFILES } from "../constants";
import { guildSettingSchema } from "../schemas";

export * from "./database.types";

export type GuildSettings = z.infer<typeof guildSettingSchema>;

export type AiProfileName = keyof typeof AI_PROFILES;

export type ApiResponse = {
  message: string;
  status: number;
};
