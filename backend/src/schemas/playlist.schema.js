import { z } from "zod";

export const createPlaylistSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Playlist name is required"),
    description: z.string().optional(),
  }),
});

export const playlistIdParamSchema = z.object({
  params: z.object({
    playlistId: z.string().uuid("Invalid playlist ID"),
  }),
});

export const addProblemToPlaylistSchema = z.object({
  params: z.object({
    playlistId: z.string().uuid("Invalid playlist ID"),
  }),
  body: z.object({
    problemIds: z.array(z.string().uuid()).min(1, "At least one problem ID is required"),
  }),
});

export const removeProblemFromPlaylistSchema = z.object({
  params: z.object({
    playlistId: z.string().uuid("Invalid playlist ID"),
  }),
  body: z.object({
    problemIds: z.array(z.string().uuid()).min(1, "At least one problem ID is required"),
  }),
});
