import { z } from "zod";

export const matchSchema = z.object({
  first_country: z.string().trim().min(1),
  second_country: z.string().trim().min(1),
  first_country_score: z.string().trim().min(1),
  second_country_score: z.string().trim().min(1),
  date: z
    .string()
    .trim()
    .min(1)
    .transform((val) => {
      return new Date(val).toISOString();
    })
    .pipe(z.string().datetime()),
});
