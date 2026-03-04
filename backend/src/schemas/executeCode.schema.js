import { z } from "zod";

export const executeCodeSchema = z.object({
  body: z.object({
    source_code: z.string().min(1, "Source code is required"),
    language_id: z.coerce.number().int().positive("Invalid language ID"),
    problemId: z.string().uuid("Invalid problem ID"),
  }),
});
