import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import {
  getAllListDetails,
  getPlaylistDetails,
  createPlaylist,
  addProblemToPlaylist,
  deletePlaylist,
  removeProblemFromPlaylist,
} from "../controllers/playlist.controller.js";
import {
  createPlaylistSchema,
  playlistIdParamSchema,
  addProblemToPlaylistSchema,
  removeProblemFromPlaylistSchema,
} from "../schemas/playlist.schema.js";

const playlistRoutes = express.Router();

playlistRoutes.get("/", authMiddleware, getAllListDetails);

playlistRoutes.get(
  "/:playlistId",
  authMiddleware,
  validate({ params: playlistIdParamSchema.shape.params }),
  getPlaylistDetails,
);

playlistRoutes.post(
  "/create-playlist",
  authMiddleware,
  validate({ body: createPlaylistSchema.shape.body }),
  createPlaylist,
);

playlistRoutes.post(
  "/:playlistId/add-problem",
  authMiddleware,
  validate({
    params: addProblemToPlaylistSchema.shape.params,
    body: addProblemToPlaylistSchema.shape.body,
  }),
  addProblemToPlaylist,
);

playlistRoutes.delete(
  "/:playlistId",
  authMiddleware,
  validate({ params: playlistIdParamSchema.shape.params }),
  deletePlaylist,
);

playlistRoutes.delete(
  "/:playlistId/remove-problem",
  authMiddleware,
  validate({
    params: removeProblemFromPlaylistSchema.shape.params,
    body: removeProblemFromPlaylistSchema.shape.body,
  }),
  removeProblemFromPlaylist,
);

export default playlistRoutes;
