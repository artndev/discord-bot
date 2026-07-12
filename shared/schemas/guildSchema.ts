import { z } from "zod";
import { AI_PROFILE_KEYS, WEBHOOK_URL_REGEX } from "../constants";

export const guildSettingSchema = z
  .object({
    enable_echoing: z.boolean().optional(),
    ai_profile: z.enum(AI_PROFILE_KEYS).optional(),
    meta: z
      .object({
        webhookUrl: z.string().regex(WEBHOOK_URL_REGEX).nullable().optional(),
      })
      .default({}),
  })
  .partial()
  .default({
    enable_echoing: false,
    ai_profile: "default",
  });

export const guildSchema = z.object({
  id: z.string().trim().min(1),
  owner_id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  icon: z.string().trim().min(1).nullable().optional(),
  settings: guildSettingSchema,
});
