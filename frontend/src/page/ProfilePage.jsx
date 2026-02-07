import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";
import { Mail, Shield, Calendar, Folder, ArrowLeft } from "lucide-react";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axiosInstance.get("/playlist");
        setPlaylists(res.data.playlists || []);
      } catch (err) {
        console.log(err);
        setPlaylists([]);
      }
    };

    fetchPlaylists();
  }, []);

  if (!authUser) return <div>Not authenticated</div>;

  console.log(authUser);

  const joinedDate = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="btn btn-ghost mb-6 gap-2"
      >
        <ArrowLeft size={18} />
        Home
      </button>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile header */}
        <div className="bg-base-100 rounded-2xl shadow p-8 flex items-center gap-6">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${authUser.email}`}
            className="w-28 h-28 rounded-full"
          />

          <div className="flex-1">
            <h2 className="text-3xl font-bold">{authUser.name}</h2>
            <p className="text-base-content/60">{authUser.email}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/profile/edit")}
              className="btn btn-primary"
            >
              Edit
            </button>
            <button
              onClick={() => navigate("/change-password")}
              className="btn btn-outline"
            >
              Password
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-base-100 p-4 flex gap-3 items-center">
            <Mail size={18} />
            {authUser.email}
          </div>

          <div className="card bg-base-100 p-4 flex gap-3 items-center">
            <Shield size={18} />
            {authUser.role}
          </div>

          <div className="card bg-base-100 p-4 flex gap-3 items-center">
            <Calendar size={18} />
            Joined {joinedDate}
          </div>
        </div>

        {/* Playlists */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Playlists</h3>

          {playlists.length === 0 ? (
            <p className="text-base-content/60">No playlists yet</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {playlists.map((pl) => (
                <div
                  key={pl.id}
                  className="bg-base-100 p-5 rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate(`/playlist/${pl.id}`)}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold">{pl.name}</h4>

                    <span className="badge badge-primary">
                      {pl.problems.length}
                    </span>
                  </div>

                  {/* Description */}
                  {pl.description && (
                    <p className="text-sm text-base-content/60 mb-3">
                      {pl.description}
                    </p>
                  )}

                  {/* Problems preview */}
                  <div className="flex flex-wrap gap-2">
                    {pl.problems.slice(0, 4).map((p) => (
                      <span
                        key={p.problem.id}
                        className="badge badge-outline text-xs"
                      >
                        {p.problem.title}
                      </span>
                    ))}

                    {pl.problems.length > 4 && (
                      <span className="badge badge-ghost text-xs">
                        +{pl.problems.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
