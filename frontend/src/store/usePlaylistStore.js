import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const BASE = "/playlist"; // axiosInstance already has baseURL="/api"

export const usePlaylistStore = create((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,

  // ------------------------------------------------
  // Create playlist
  // POST /api/playlists/create-playlist
  // ------------------------------------------------
  createPlaylist: async (playlistData) => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.post(
        `${BASE}/create-playlist`,
        playlistData,
      );

      set((state) => ({
        playlists: [...state.playlists, res.data.playlist],
      }));

      toast.success("Playlist created successfully");
      return res.data.playlist;
    } catch (error) {
      console.error("Create playlist error:", error);
      toast.error("Failed to create playlist");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // ------------------------------------------------
  // Get all playlists
  // GET /api/playlists
  // ------------------------------------------------
  getAllPlaylists: async () => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.get(BASE);

      set({ playlists: res.data.playlists || [] });
    } catch (error) {
      console.error("Fetch playlists error:", error);
      toast.error("Failed to fetch playlists");
    } finally {
      set({ isLoading: false });
    }
  },

  // ------------------------------------------------
  // Get single playlist
  // GET /api/playlists/:id
  // ------------------------------------------------
  getPlaylistDetails: async (playlistId) => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.get(`${BASE}/${playlistId}`);

      set({ currentPlaylist: res.data.playlist });
    } catch (error) {
      console.error("Fetch playlist details error:", error);
      toast.error("Failed to fetch playlist details");
    } finally {
      set({ isLoading: false });
    }
  },

  // ------------------------------------------------
  // Add problem (with duplicate-safe logic)
  // POST /api/playlists/:id/add-problem
  // ------------------------------------------------
  addProblemToPlaylist: async (playlistId, problemIds) => {
    try {
      const res = await axiosInstance.post(
        `${BASE}/${playlistId}/add-problem`,
        { problemIds },
      );

      if (res.data.addedCount === 0) {
        toast("Already in playlist");
      } else {
        toast.success("Added to playlist");
      }

      // Refresh playlist after change
      if (get().currentPlaylist?.id === playlistId) {
        await get().getPlaylistDetails(playlistId);
      }
    } catch (error) {
      console.error("Add problem error:", error);
      toast.error("Failed to add problem");
    }
  },

  // ------------------------------------------------
  // Remove problem
  // DELETE /api/playlists/:id/remove-problem
  // ------------------------------------------------
  removeProblemFromPlaylist: async (playlistId, problemIds) => {
    try {
      set({ isLoading: true });

      await axiosInstance.delete(`${BASE}/${playlistId}/remove-problem`, {
        data: { problemIds }, // axios delete sends body like this
      });

      toast.success("Problem removed");

      if (get().currentPlaylist?.id === playlistId) {
        await get().getPlaylistDetails(playlistId);
      }
    } catch (error) {
      console.error("Remove problem error:", error);
      toast.error("Failed to remove problem");
    } finally {
      set({ isLoading: false });
    }
  },

  // ------------------------------------------------
  // Delete playlist
  // DELETE /api/playlists/:id
  // ------------------------------------------------
  deletePlaylist: async (playlistId) => {
    try {
      set({ isLoading: true });

      await axiosInstance.delete(`${BASE}/${playlistId}`);

      set((state) => ({
        playlists: state.playlists.filter((p) => p.id !== playlistId),
      }));

      toast.success("Playlist deleted");
    } catch (error) {
      console.error("Delete playlist error:", error);
      toast.error("Failed to delete playlist");
    } finally {
      set({ isLoading: false });
    }
  },
}));
