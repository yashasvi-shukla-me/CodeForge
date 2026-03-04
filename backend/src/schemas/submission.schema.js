import { z } from "zod";

export const submitSolutionSchema = z.object({
  body: z.object({
    problemId: z.string().uuid("Invalid problem ID"),
    source_code: z.string().min(1, "Source code is required"),
    language_id: z.coerce.number().int().positive("Invalid language ID"),
  }),
});

export const getSubmissionForProblemSchema = z.object({
  params: z.object({
    problemId: z.string().uuid("Invalid problem ID"),
  }),
});

export const getSubmissionCountSchema = z.object({
  params: z.object({
    problemId: z.string().uuid("Invalid problem ID"),
  }),
});
