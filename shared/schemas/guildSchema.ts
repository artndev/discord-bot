import { z } from "zod";
import { WEBHOOK_URL_REGEX } from "../constants";

export const guildSettingSchema = z
  .object({
    test: z.string().trim().min(1).max(100).optional(),
    test_2: z.boolean().optional(),
    test_3: z.enum(["enum_1", "enum_2"]).optional(),
    test_4: z
      .array(z.enum(["enum_1", "enum_2", "enum_3", "enum_4", "enum_5"]))
      .optional(),
    meta: z
      .object({
        webhookUrl: z.string().regex(WEBHOOK_URL_REGEX).nullable().optional(),
      })
      .default({}),
  })
  .partial()
  .default({});

export const guildSchema = z.object({
  id: z.string().trim().min(1),
  owner_id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  settings: guildSettingSchema,
});

export type GuildSettings = z.infer<typeof guildSettingSchema>;
