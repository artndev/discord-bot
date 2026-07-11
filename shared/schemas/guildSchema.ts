import { z } from "zod";
import { AI_PROFILE_KEYS, WEBHOOK_URL_REGEX } from "../constants";

// test: z.string().trim().min(1).max(100).optional(),
// test_4: z
//   .array(z.enum(["enum_1", "enum_2", "enum_3", "enum_4", "enum_5"]))
//   .optional(),

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
  settings: guildSettingSchema,
});
